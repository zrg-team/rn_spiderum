import { CommonActions, StackActions } from '@react-navigation/native'
import { PAGES } from '../routes'

let navigator
export function setTopLevelNavigator (navigatorRef) {
  navigator = navigatorRef
}

export function pages () {
  return PAGES
}

export function getRootState () {
  return navigator && navigator.current
    ? navigator.current.getRootState()
    : null
}

export function navigationReset (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = CommonActions.reset({
    index: 0,
    params,
    actions: [CommonActions.navigate({ routeName: page })]
  })
  navigation.dispatch(resetAction)
}

export function navigationReplace (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = StackActions.replace(page, params)
  navigation.dispatch(resetAction)
}

export function navigationPush (navigation = navigator, page, params = {}, key) {
  const navigateAction = CommonActions.navigate(page, params)

  navigation.dispatch(navigateAction)
}

export function navigationPop (navigation = navigator, number = 1) {
  const popAction = StackActions.pop(number)
  navigation.dispatch(popAction)
}

export function navigationPopToTop (navigation = navigator, options = {}) {
  navigation.dispatch(StackActions.popToTop(options))
}

export function navigate (navigation, page) {
  navigation.navigate(page)
}

export function getRouteParams (key, props, defaultValue = undefined) {
  const { route } = props
  return route && route.params
    ? route.params[key] || defaultValue
    : defaultValue
}

// gets the current screen from navigation state
export function getActiveRouteName (state) {
  try {
    const route = state.routes[state.index]
    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state)
    }
    return route.name
  } catch (err) {
    return null
  }
}
