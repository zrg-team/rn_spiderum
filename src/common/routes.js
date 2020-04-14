import React from 'react'
import { Platform } from 'react-native'
import {
  createAppContainer,
  createBottomTabNavigator,
  BottomTabBar,
  createStackNavigator
} from 'react-navigation'
import { register } from 'react-native-bundle-splitter'
import createScreensStackNavigator from 'react-native-screens/createNativeStackNavigator'
import { FluidNavigator } from 'react-navigation-fluid-transitions'
import { fadeIn } from 'react-navigation-transitions'
// import { icons } from '../assets/elements'
import commonStyle, { TAB_BAR_HEIGHT } from '../styles/common'
import TabarItem from './containers/TabarItem'

import createOptionFlow, { PAGES as OPTION_PAGES } from './flows/option'
import createReadingFlow, { PAGES as READING_PAGES } from './flows/reading'
import createCategoryFlow, { PAGES as CATEGORY_PAGES } from './flows/category'

import LoadingPage from '../pages/LoadingPage'
import AppIntroPage from '../pages/AppIntroPage'

export const PAGES = {
  AppIntro: 'AppIntro',
  Home: 'Home',
  News: 'News',
  Top: 'Top',
  Option: 'Option',
  Loading: 'Loading',
  TabGroup: 'TabGroup',
  NewsList: 'NewsList',
  TopList: 'TopList',
  HotList: 'HotList',
  Category: 'Category',
  ...OPTION_PAGES,
  ...READING_PAGES,
  ...CATEGORY_PAGES
}

const customScreenOption = {
  navigationOptions: {
    stackAnimation: 'fade'
  }
}

const createNativeStackNavigator = Platform.OS !== 'ios'
  ? createScreensStackNavigator
  : createStackNavigator

export default ({
  persistor = undefined,
  dispatch = null,
  appIntro,
  themedStyle,
  setTopLevelNavigator,
  ...navigationProps
}) => {
  // create flow
  const optionPages = createOptionFlow(customScreenOption)
  const readingPages = createReadingFlow(customScreenOption)
  const categogyPages = createCategoryFlow(customScreenOption)

  // Option flow
  const OptionFlow = createNativeStackNavigator({
    ...optionPages,
    ...readingPages
  }, {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }
      return {
        tabBarVisible
      }
    }
  })
  // Option Home flow
  const HomeFlow = FluidNavigator({
    [PAGES.HotList]: { screen: register({ require: () => require('../pages/HomePage') }) },
    ...readingPages
  }, {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }
      return {
        tabBarVisible
      }
    }
  })
  // News Home flow
  const NewsFlow = FluidNavigator({
    [PAGES.NewsList]: { screen: register({ require: () => require('../pages/NewsPage') }) },
    ...readingPages
  }, {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }
      return {
        tabBarVisible
      }
    }
  })
  // Top Home flow
  const TopFlow = FluidNavigator({
    [PAGES.TopList]: { screen: register({ require: () => require('../pages/TopPage') }) },
    ...readingPages
  }, {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }
      return {
        tabBarVisible
      }
    }
  })
  // Category Home flow
  const CategoryFlow = createNativeStackNavigator({
    ...categogyPages,
    ...readingPages
  }, {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }
      return {
        tabBarVisible
      }
    }
  })
  // Tab navigator
  const TabGroup = createBottomTabNavigator({
    [PAGES.Home]: HomeFlow,
    [PAGES.News]: NewsFlow,
    [PAGES.Top]: TopFlow,
    [PAGES.Category]: CategoryFlow,
    [PAGES.Option]: OptionFlow
  }, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarComponent: (props) => {
        return (
          <BottomTabBar
            {...props}
            style={[themedStyle.barStyle, commonStyle.bottom_bar_container, commonStyle.shadow]}
          />
        )
      },
      tabBarLabel: (data) => {
        return null
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        return <TabarItem key={routeName} focused={focused} navigation={navigation} style={themedStyle.tabBarStyle} />
      }
    }),
    lazy: true,
    height: TAB_BAR_HEIGHT,
    labeled: false,
    shifting: true,
    swipeEnabled: false,
    backBehavior: 'none',
    animationEnabled: false,
    // removeClippedSubviews: false,
    initialRouteName: PAGES.Home,
    barStyle: themedStyle.barStyle,
    activeColor: commonStyle.activeMenu.color
  })

  let AppNavigator = null
  if (appIntro || Platform.OS === 'ios') {
    AppNavigator = createNativeStackNavigator(
      {
        [PAGES.Loading]: {
          screen: (props) => (
            <LoadingPage
              time={0}
              dispatch={dispatch}
              persistor={persistor}
              page={PAGES.TabGroup}
              {...props}
            />
          ),
          ...customScreenOption
        },
        [PAGES.TabGroup]: { screen: TabGroup, ...customScreenOption }
      },
      {
        headerMode: 'none',
        cardShadowEnabled: false,
        transitionConfig: () => fadeIn(),
        cardStyle: themedStyle.mainNavigator,
        initialRouteName: PAGES.Loading
      }
    )
  } else {
    AppNavigator = FluidNavigator(
      {
        [PAGES.Loading]: {
          screen: (props) => (
            <LoadingPage
              time={300}
              page={PAGES.AppIntro}
              {...props}
            />
          )
        },
        [PAGES.AppIntro]: { screen: AppIntroPage }
      },
      {
        headerMode: 'none',
        initialRouteName: PAGES.Loading,
        defaultNavigationOptions: { gesturesEnabled: false }
      }
    )
  }

  const NavigationComponent = createAppContainer(AppNavigator)
  return <NavigationComponent {...navigationProps} ref={setTopLevelNavigator} />
}
