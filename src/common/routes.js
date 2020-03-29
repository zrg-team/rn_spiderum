import React from 'react'
import {
  createAppContainer,
  createBottomTabNavigator,
  BottomTabBar
} from 'react-navigation'
import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator'
import { FluidNavigator } from 'react-navigation-fluid-transitions'
import { fadeIn } from 'react-navigation-transitions'
// import { icons } from '../assets/elements'
import { Platform } from 'react-native'
import commonStyle, { TAB_BAR_HEIGHT } from '../styles/common'
import TabarItem from './containers/TabarItem'

import DebugPage from '../pages/DebugPage'
import HomePage from '../pages/HomePage'
import NewsPage from '../pages/NewsPage'
import TopPage from '../pages/TopPage'
import OptionPage from '../pages/OptionPage'
import ProfilePage from '../pages/ProfilePage'
import LoadingPage from '../pages/LoadingPage'
import ReadingPage from '../pages/ReadingPage'
import BookmarkPage from '../pages/BookmarkPage'
import AppIntroPage from '../pages/AppIntroPage'
import CategoriesPage from '../pages/CategoriesPage'
import CategoryDetailPage from '../pages/CategoryDetailPage'

export const SCREENS = {
  Home: 'Home',
  News: 'News',
  Top: 'Top',
  Option: 'Option',
  Loading: 'Loading',
  TabGroup: 'TabGroup',
  OptionList: 'OptionList',
  HotList: 'HotList',
  NewsList: 'NewsList',
  TopList: 'TopList',
  Reading: 'Reading',
  Category: 'Category',
  Categories: 'Categories',
  CategoryDetail: 'CategoryDetail',
  Profile: 'Profile',
  Bookmark: 'Bookmark',
  AppIntro: 'AppIntro',
  Debug: 'Debug'
}

const customScreenOption = {
  navigationOptions: {
    stackAnimation: 'fade'
  }
}

export default ({
  persistor = undefined,
  dispatch = null,
  appIntro,
  themedStyle
}) => {
  // Option flow
  const OptionFlow = createNativeStackNavigator({
    [SCREENS.OptionList]: { screen: OptionPage, ...customScreenOption },
    [SCREENS.Bookmark]: { screen: BookmarkPage, ...customScreenOption },
    [SCREENS.Reading]: { screen: ReadingPage, ...customScreenOption },
    [SCREENS.Debug]: { screen: DebugPage, ...customScreenOption }
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
    [SCREENS.HotList]: { screen: HomePage },
    [SCREENS.Reading]: { screen: ReadingPage },
    [SCREENS.Profile]: { screen: ProfilePage }
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
    [SCREENS.NewsList]: { screen: NewsPage },
    [SCREENS.Reading]: { screen: ReadingPage },
    [SCREENS.Profile]: { screen: ProfilePage }
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
    [SCREENS.TopList]: { screen: TopPage },
    [SCREENS.Reading]: { screen: ReadingPage },
    [SCREENS.Profile]: { screen: ProfilePage }
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
    [SCREENS.Categories]: { screen: CategoriesPage, ...customScreenOption },
    [SCREENS.CategoryDetail]: { screen: CategoryDetailPage, ...customScreenOption },
    [SCREENS.Reading]: { screen: ReadingPage, ...customScreenOption },
    [SCREENS.Profile]: { screen: ProfilePage, ...customScreenOption }
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
    [SCREENS.Home]: HomeFlow,
    [SCREENS.News]: NewsFlow,
    [SCREENS.Top]: TopFlow,
    [SCREENS.Category]: CategoryFlow,
    [SCREENS.Option]: OptionFlow
  }, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarComponent: (props) => {
        return (
          <BottomTabBar
            {...props}
            style={[themedStyle.barStyle, { borderTopColor: 'transparent' }, commonStyle.shadow]}
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
    initialRouteName: SCREENS.Home,
    barStyle: themedStyle.barStyle,
    activeColor: commonStyle.activeMenu.color
  })

  let AppNavigator = null
  if (appIntro || Platform.OS === 'ios') {
    AppNavigator = createNativeStackNavigator(
      {
        [SCREENS.Loading]: {
          screen: (props) => (
            <LoadingPage
              time={0}
              dispatch={dispatch}
              persistor={persistor}
              page={SCREENS.TabGroup}
              {...props}
            />
          ),
          ...customScreenOption
        },
        [SCREENS.TabGroup]: { screen: TabGroup, ...customScreenOption }
      },
      {
        headerMode: 'none',
        cardShadowEnabled: false,
        transitionConfig: () => fadeIn(),
        cardStyle: themedStyle.mainNavigator,
        initialRouteName: SCREENS.Loading
      }
    )
  } else {
    AppNavigator = FluidNavigator(
      {
        [SCREENS.Loading]: {
          screen: (props) => (
            <LoadingPage
              time={300}
              page={SCREENS.AppIntro}
              {...props}
            />
          )
        },
        [SCREENS.AppIntro]: { screen: AppIntroPage }
      },
      {
        headerMode: 'none',
        initialRouteName: SCREENS.LoadingPage,
        defaultNavigationOptions: { gesturesEnabled: false }
      }
    )
  }

  return createAppContainer(AppNavigator)
}
