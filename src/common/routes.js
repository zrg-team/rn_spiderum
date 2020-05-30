import React, { memo } from 'react'
import { Platform } from 'react-native'
import { register } from 'react-native-bundle-splitter'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'
// import { icons } from '../assets/elements'
import commonStyle from '../styles/common'
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

const tabStackProps = {
  headerMode: 'none'
}
const tabStackScreenProps = {
  sharedElements: (route, otherRoute, showing) => {
    const { article } = route.params
    if (!article) {
      return []
    }
    return [article.og_image_url, `${article._id}_${article.avatar}_avatar`]
  }
}

const optionPages = createOptionFlow(customScreenOption)
const readingPages = createReadingFlow(customScreenOption)
const categogyPages = {
  ...createCategoryFlow(customScreenOption),
  ...readingPages
}
const homeFlowPages = {
  [PAGES.HotList]: { screen: register({ require: () => require('../pages/HomePage') }) },
  ...readingPages
}
const newFlowPages = {
  [PAGES.NewsList]: { screen: register({ require: () => require('../pages/NewsPage') }) },
  ...readingPages
}
const topFlowPages = {
  [PAGES.TopList]: { screen: register({ require: () => require('../pages/TopPage') }) },
  ...readingPages
}

// Flow for option tab
const OptionStack = createStackNavigator()
const OptionNavigation = memo(({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false })
  } else {
    navigation.setOptions({ tabBarVisible: true })
  }
  return (
    <OptionStack.Navigator
      {...tabStackProps}
    >
      {Object.keys(optionPages).map((key, index) => {
        const item = optionPages[key]
        return (
          <OptionStack.Screen key={key} name={key} component={item.screen} {...tabStackScreenProps} />
        )
      })}
    </OptionStack.Navigator>
  )
})

// Flow for home tab
const HomeStack = createSharedElementStackNavigator()
const HomeNavigation = memo(({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false })
  } else {
    navigation.setOptions({ tabBarVisible: true })
  }
  return (
    <HomeStack.Navigator
      {...tabStackProps}
    >
      {Object.keys(homeFlowPages).map((key, index) => {
        const item = homeFlowPages[key]
        return (
          <HomeStack.Screen key={key} name={key} component={item.screen} {...tabStackScreenProps} />
        )
      })}
    </HomeStack.Navigator>
  )
})

// Flow for news tab
const NewsStack = createSharedElementStackNavigator()
const NewsNavigation = memo(({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false })
  } else {
    navigation.setOptions({ tabBarVisible: true })
  }
  return (
    <NewsStack.Navigator
      {...tabStackProps}
    >
      {Object.keys(newFlowPages).map((key, index) => {
        const item = newFlowPages[key]
        return (
          <NewsStack.Screen key={key} name={key} component={item.screen} {...tabStackScreenProps} />
        )
      })}
    </NewsStack.Navigator>
  )
})

// Flow for top tab
const TopStack = createSharedElementStackNavigator()
const TopNavigation = memo(({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false })
  } else {
    navigation.setOptions({ tabBarVisible: true })
  }
  return (
    <TopStack.Navigator
      {...tabStackProps}
    >
      {Object.keys(topFlowPages).map((key, index) => {
        const item = topFlowPages[key]
        return (
          <TopStack.Screen key={key} name={key} component={item.screen} {...tabStackScreenProps} />
        )
      })}
    </TopStack.Navigator>
  )
})

// Flow for categories tab
const CategoriesStack = createStackNavigator()
const CategoriesNavigation = memo(({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false })
  } else {
    navigation.setOptions({ tabBarVisible: true })
  }
  return (
    <CategoriesStack.Navigator
      {...tabStackProps}
    >
      {Object.keys(categogyPages).map((key, index) => {
        const item = categogyPages[key]
        return (
          <CategoriesStack.Screen key={key} name={key} component={item.screen} {...tabStackScreenProps} />
        )
      })}
    </CategoriesStack.Navigator>
  )
})

export default ({
  persistor = undefined,
  dispatch = null,
  appIntro,
  themedStyle,
  setTopLevelNavigator,
  handleNavigationStateChange,
  ...navigationProps
}) => {
  let appNavigators = {}
  let appNavigatorProps = {}

  const Tab = createBottomTabNavigator()
  const BottomTabBarWithStyle = memo((props) => {
    return (
      <BottomTabBar
        {...props}
        style={[
          themedStyle.barStyle,
          commonStyle.bottom_bar_container,
          commonStyle.shadow
        ]}
      />
    )
  })
  const TabGroup = memo((mainProps) => (
    <Tab.Navigator
      // shifting
      animationEnabled={false}
      backBehavior='none'
      initialRouteName={PAGES.Home}
      tabBar={(props) => <BottomTabBarWithStyle {...props} />}
      tabBarOptions={{
        showLabel: false
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          return (
            <TabarItem
              route={route}
              key={route.name}
              focused={focused}
              style={themedStyle.tabBarStyle}
            />
          )
        }
      })}
    >
      <Tab.Screen name={PAGES.Home} component={HomeNavigation} />
      <Tab.Screen name={PAGES.News} component={NewsNavigation} />
      <Tab.Screen name={PAGES.Top} component={TopNavigation} />
      <Tab.Screen name={PAGES.Category} component={CategoriesNavigation} />
      <Tab.Screen name={PAGES.Option} component={OptionNavigation} />
    </Tab.Navigator>
  ))

  if (appIntro || Platform.OS === 'ios') {
    appNavigators = {
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
      [PAGES.TabGroup]: { screen: TabGroup }
    }
    appNavigatorProps = {
      headerMode: 'none',
      cardShadowEnabled: false,
      initialRouteName: PAGES.Loading
    }
  } else {
    appNavigators = {
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
    }
    appNavigatorProps = {
      headerMode: 'none',
      cardShadowEnabled: false,
      initialRouteName: PAGES.Loading
    }
  }
  const MainStack = createStackNavigator()
  return (
    <NavigationContainer
      ref={setTopLevelNavigator}
      onStateChange={handleNavigationStateChange}
      {...navigationProps}
    >
      <MainStack.Navigator {...appNavigatorProps}>
        {Object.keys(appNavigators).map((key, index) => {
          const item = appNavigators[key]
          if (item.function) {
            return (
              <MainStack.Screen key={key} name={key}>
                {item.function}
              </MainStack.Screen>
            )
          }
          return (
            <MainStack.Screen key={key} name={key} component={item.screen} />
          )
        })}
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
