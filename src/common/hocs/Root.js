import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { NativeModules } from 'react-native'
import MaterialCommunityPack from '../../libraries/icons/MaterialCommunityPack'
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

  async componentDidMount () {
    const { dispatch, language } = this.props
    // NativeModules.QVIBackground.startService()
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
