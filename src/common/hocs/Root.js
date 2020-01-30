import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { NativeModules } from 'react-native'
import MaterialCommunityPack from '../../libraries/icons/MaterialCommunityPack'
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten'
import initialize from '../utils/initialize'
import logger from '../utils/logger'
import database from '../../libraries/Database'
import MainPage from './MainPage'

class Root extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { darkMode, appIntro, language } = this.props
    const { loading } = this.state
    if (darkMode !== nextProps.darkMode) {
      this.setState({
        loading: true
      }, () => {
        setTimeout(() => {
          this.setState({
            loading: false
          })
        }, 50)
      })
    }
    return appIntro !== nextProps.appIntro || language !== nextProps.language || nextState.loading !== loading
  }

  async componentDidMount () {
    const { dispatch, language } = this.props
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
    const { loading } = this.state
    const { dispatch, appIntro, language, darkMode } = this.props
    if (loading) {
      return null
    }
    return (
      <ApplicationProvider mapping={mapping} theme={darkMode ? darkTheme : lightTheme}>
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
    appIntro: state.common.appIntro,
    darkMode: state.user.darkMode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
