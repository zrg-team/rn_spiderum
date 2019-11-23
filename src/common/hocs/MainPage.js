import React, { Component } from 'react'
import NetInfo from '@react-native-community/netinfo'
import splashScreen from 'react-native-splash-screen'
import {
  View,
  Linking,
  AppState,
  StatusBar,
  BackHandler,
  SafeAreaView
} from 'react-native'
import commonStyle, { appHeight } from '../../styles/common'
import Modal from '../components/Widgets/Modal'
import ProgressBar from '../components/Widgets/ProgressBar'
import Camera from '../components/Widgets/Camera'
import Toast from '../components/Widgets/Toast'
import CommonLoading from '../components/Widgets/CommonLoading'
import NotificationPanel from '../components/Widgets/NotificationPanel'
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
export default class MainPage extends Component {
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
    switch (currentAppState) {
      case 'inactive':
      case 'background':
      case 'active':
    }
  }

  getNavigator (appIntro, language) {
    const { lazy } = this.state
    if (lazy) {
      return View
    }
    if (`${appIntro}_${language}` === this.unique) {
      return this.AppNavigator
    }
    const { persistor, dispatch } = this.props
    this.AppNavigator = LazyComponent({
      persistor,
      dispatch,
      appIntro,
      setTopLevelNavigator
    })
    this.unique = `${appIntro}_${language}`
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
    ProgressBar.show()
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange.bind(this)
    )
    AppState.removeEventListener('change', this.onAppStateChange)
    AppState.addEventListener('change', this.onAppStateChange.bind(this))
    this.initial()
  }

  initial () {
    LazyComponent = require('../routes').default
    const { persistor, dispatch, appIntro, language } = this.props
    // TODO: Loading page
    this.unique = `${appIntro}_${language}`
    this.AppNavigator = LazyComponent({
      persistor,
      dispatch,
      appIntro,
      setTopLevelNavigator
    })
    splashScreen.hide()
    ProgressBar.hide()
    this.setState({
      lazy: false,
      loading: false
    })
  }

  render () {
    const { appIntro, language } = this.props
    const { loading } = this.state
    const AppNavigator = this.getNavigator(appIntro, language)
    return (
      <SafeAreaView>
        <View style={commonStyle.status_bar} />
        <View
          ref={this.getNavigatorRef}
          style={[
            {
              height: !loading ? appHeight : 0,
              marginTop: StatusBar.currentHeight
            },
            commonStyle.backgroundColor
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
        <NotificationPanel.Component parentRef={this.navigatorRef} key='notification-panel' global />
        <ProgressBar.Component key='progress-bar' global />
        <CommonLoading.Component key='common-bar' global />
        <Camera.Component key='app-camera' zIndex={5} global />
        <Toast.Component key='toast-bar' global />
      </SafeAreaView>
    )
  }
}
