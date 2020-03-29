import React, { Component } from 'react'
import NetInfo from '@react-native-community/netinfo'
import splashScreen from 'react-native-splash-screen'
import {
  View,
  Linking,
  AppState,
  BackHandler
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'
import commonStyle from '../../styles/common'
import Modal from '../components/Widgets/Modal'
import ProgressBar from '../components/Widgets/ProgressBar'
// import Camera from '../components/Widgets/Camera'
import Toast from '../components/Widgets/Toast'
import CommonLoading from '../components/Widgets/CommonLoading'
import SearchPanel from '../components/Widgets/SearchPanel'
import BottomSheet from '../components/Widgets/BottomSheet'
import { setTopLevelNavigator } from '../utils/navigation'
import {
  setApplicationState,
  setNavigationPage,
  setNetworkStatus
} from '../actions/common'

// gets the current screen from navigation state
function getActiveRouteName (navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

let LazyComponent = null
class MainPage extends Component {
  constructor (props) {
    super(props)
    this.network = false
    this.state = {
      lazy: true,
      loading: true
    }
    this.navigatorRef = null
    this.getNavigatorRef = this.getNavigatorRef.bind(this)
    this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this)
    this.getNavigator = this.getNavigator.bind(this)

    BackHandler.addEventListener('hardwareBackPress', () => true)
  }

  getNavigatorRef (ref) {
    this.navigatorRef = ref
  }

  async onAppStateChange (currentAppState) {
    const { dispatch } = this.props
    // Should dispatch to redux network status
    dispatch(setApplicationState(currentAppState))
  }

  getNavigator (appIntro, language) {
    const { lazy } = this.state
    if (lazy) {
      return View
    }
    if (`${appIntro}_${language}` === this.unique) {
      return this.AppNavigator
    }
    const { persistor, dispatch, themedStyle } = this.props
    this.AppNavigator = LazyComponent({
      persistor,
      dispatch,
      appIntro,
      setTopLevelNavigator,
      themedStyle
    })
    this.unique = `${appIntro}_${language}`
    console.info(`[MAIN PAGE] Navigation reloaded. Keys: ${this.unique}`)
    return this.AppNavigator
  }

  // Keep up with network information
  handleFirstConnectivityChange (connectionInfo) {
    const { dispatch } = this.props
    // Should dispatch to redux network status
    dispatch(setNetworkStatus(connectionInfo))
  }

  // Usefull in analysis report
  handleNavigationStateChange (prevState, currentState) {
    const { dispatch } = this.props
    const currentPage = getActiveRouteName(currentState)
    const previousPage = getActiveRouteName(prevState)
    dispatch(setNavigationPage({ currentPage, previousPage }))
  }

  // Whole app will rerender. So be carefull
  shouldComponentUpdate (nextProps, nextState) {
    const { appIntro, language } = this.props
    const { lazy } = this.state
    if (
      language !== nextProps.language ||
      appIntro !== nextProps.appIntro ||
      lazy !== nextProps.lazy
    ) {
      return true
    }
    return false
  }

  async componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', () => {})
    Linking.removeEventListener('url', () => {})
    AppState.removeEventListener('change', this.onAppStateChange)
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }

  async componentDidMount () {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange.bind(this)
    )
    AppState.addEventListener('change', this.onAppStateChange.bind(this))
    this.initial()
  }

  initial () {
    LazyComponent = require('../routes').default
    const { persistor, dispatch, appIntro, language, themedStyle } = this.props
    // TODO: Loading page
    this.unique = `${appIntro}_${language}`
    this.AppNavigator = LazyComponent({
      persistor,
      dispatch,
      appIntro,
      setTopLevelNavigator,
      themedStyle
    })
    splashScreen.hide()
    this.setState({
      lazy: false,
      loading: false
    }, () => {
      console.info(`[MAIN PAGE] Navigation loaded. Keys: ${this.unique}`)
    })
  }

  render () {
    const { appIntro, language, themedStyle } = this.props
    const { loading } = this.state
    const AppNavigator = this.getNavigator(appIntro, language)
    return (
      <>
        <View style={[commonStyle.statusBar, themedStyle.statusBar]} />
        <View
          ref={this.getNavigatorRef}
          style={[
            themedStyle.mainContent,
            commonStyle.mainContent,
            themedStyle.backgroundColor,
            { opacity: loading ? 0 : 1 }
          ]}
        >
          <AppNavigator
            key='main'
            ref={navigatorRef => {
              setTopLevelNavigator(navigatorRef)
            }}
            onNavigationStateChange={this.handleNavigationStateChange}
          />
        </View>
        <Modal.Component key='common-modal' global />
        <BottomSheet.Component zIndex={2} parentRef={this.navigatorRef} key='common-bottom-sheet' global />
        <SearchPanel.Component parentRef={this.navigatorRef} key='search-panel' global />
        <ProgressBar.Component key='progress-bar' global />
        <CommonLoading.Component key='common-bar' global />
        {/* <Camera.Component key='app-camera' zIndex={5} global /> */}
        <Toast.Component key='toast-bar' global />
      </>
    )
  }
}

export default withStyles(MainPage, (theme) => ({
  tabBarStyle: {
    color: theme['text-basic-color']
  },
  barStyle: {
    backgroundColor: theme['background-basic-color-4']
  },
  backgroundColor: {
    backgroundColor: theme['background-basic-color-3']
  },
  backgroundTransparent: {
    backgroundColor: 'transparent'
  },
  mainNavigator: {
    backgroundColor: theme['background-basic-color-3']
  },
  mainContent: {
    zIndex: 1
  },
  statusBar: {
    backgroundColor: theme['background-basic-color-4']
  }
}))
