import React from 'react'
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  BottomTabBar
} from 'react-navigation'
import { FluidNavigator } from 'react-navigation-fluid-transitions'
// import { icons } from '../assets/elements'
import { Animated, Easing, Platform } from 'react-native'
import commonStyle from '../styles/common'
import TabarItem from './containers/TabarItem'

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
  AppIntro: 'AppIntro'
}

const transitionConfig = {
  duration: 300,
  timing: Animated.timing,
  easing: Easing.easing
}

export default ({
  persistor = undefined,
  dispatch = null,
  appIntro
}) => {
  const OptionFlow = createStackNavigator({
    [SCREENS.OptionList]: { screen: OptionPage },
    [SCREENS.Bookmark]: { screen: BookmarkPage },
    [SCREENS.Reading]: { screen: ReadingPage }
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
  const CategoryFlow = FluidNavigator({
    [SCREENS.Categories]: { screen: CategoriesPage },
    [SCREENS.CategoryDetail]: { screen: CategoryDetailPage },
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
            style={[{ borderTopColor: 'transparent' }, commonStyle.shadow]}
          />
        )
      },
      tabBarLabel: (data) => {
        return null
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        return <TabarItem key={routeName} focused={focused} navigation={navigation} />
      }
    }),
    labeled: false,
    animationEnabled: false,
    height: 100,
    initialRouteName: SCREENS.Home,
    backBehavior: 'none',
    shifting: true,
    barStyle: commonStyle.gbMenu,
    activeColor: commonStyle.activeMenu.color
  })

  let AppNavigator = null
  if (appIntro || Platform.OS === 'ios') {
    AppNavigator = createStackNavigator(
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
          )
        },
        [SCREENS.TabGroup]: { screen: TabGroup }
      },
      {
        headerMode: 'none',
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
        transitionConfig,
        headerMode: 'none',
        initialRouteName: SCREENS.LoadingPage,
        defaultNavigationOptions: { gesturesEnabled: false }
      }
    )
  }

  return createAppContainer(AppNavigator)
}
