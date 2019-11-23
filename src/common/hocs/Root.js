import React, { Component } from 'react'
import i18n from 'i18n-js'
import { connect } from 'react-redux'
import { Platform } from 'react-native'
// import { NativeModules } from 'react-native'
import MaterialCommunityPack from '../../libraries/icons/MaterialCommunityPack'
import PushNotification from 'react-native-push-notification'
import { mapping, light as lightTheme } from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten'
import initialize from '../utils/initialize'
import logger from '../utils/logger'
import database from '../../libraries/Database'
import MainPage from './MainPage'

class Root extends Component {
  shouldComponentUpdate (nextProps) {
    const { appIntro, language } = this.props
    if (appIntro !== nextProps.appIntro || language !== nextProps.language) {
      return true
    }
    return false
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line
    try {
      const { message } = this.props
      if (nextProps.message && nextProps.message.id && (!message || !message.id || nextProps.message.id !== message.id)) {
        if (Platform.OS === 'android') {
          PushNotification.localNotification({
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            title: 'QVI Service', // (optional)
            message: i18n.t('messages.transaction_confirmed')
          })
        }
      }
    } catch (err) {}
  }

  async componentDidMount () {
    const { dispatch, language } = this.props
    // NativeModules.QVIBackground.startService()
    PushNotification.configure({
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    })
    try {
      await database.init()
      await logger.init()
    } catch (err) {
      console.log('logger Error. Cannot Initialize logger.', err)
    }
    try {
      await initialize(dispatch, language || undefined)
    } catch (error) {
      console.log('Fatal Error. Cannot Initialize.', error)
    }
  }

  render () {
    const { dispatch, appIntro, language } = this.props
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <IconRegistry icons={MaterialCommunityPack} />
        <MainPage
          appIntro={appIntro}
          dispatch={dispatch}
          language={language}
        />
      </ApplicationProvider>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch
})

const mapStateToProps = state => {
  return {
    message: state.session.message,
    language: state.common.language,
    appIntro: state.common.appIntro
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
