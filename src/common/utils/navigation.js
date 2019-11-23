import { NavigationActions, StackActions, DrawerActions } from 'react-navigation'
import { SCREENS } from '../routes'

let navigator
export function setTopLevelNavigator (navigatorRef) {
  navigator = navigatorRef
}

export function screens () {
  return SCREENS
}

export function navigationReset (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = StackActions.reset({
    index: 0,
    params,
    actions: [NavigationActions.navigate({ routeName: page })]
  })
  navigation.dispatch(resetAction)
}

export function navigationReplace (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = StackActions.replace({
    params,
    routeName: page,
    newKey: key || page
  })
  navigation.dispatch(resetAction)
}

export function navigationPush (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = StackActions.push({
    params,
    routeName: page,
    newKey: key || page
  })
  navigation.dispatch(resetAction)
}

export function navigationPop (navigation = navigator, number = 1) {
  const popAction = StackActions.pop({
    n: number
  })
  navigation.dispatch(popAction)
}

export function navigationPopToTop (navigation = navigator, options = {}) {
  navigation.dispatch(StackActions.popToTop(options))
}

export function navigationToggleDrawer (navigation = navigator) {
  navigation.dispatch(DrawerActions.toggleDrawer())
}

export function navigate (navigation = navigator, page) {
  navigation.navigate(page)
}
