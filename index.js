import './src/libraries/logger'
import 'react-native-gesture-handler'
import { AppRegistry, Platform } from 'react-native'
import { enableScreens } from 'react-native-screens'
import { getTimeSinceStartup } from 'react-native-startup-time'
import { name as appName } from './app.json'
import App from './src/App'

if (Platform.OS !== 'ios') {
  enableScreens()
}
console.time('[APPLICATION] Render')
getTimeSinceStartup().then((time) => {
  console.info(`Time since startup: ${time} ms`)
})
AppRegistry.registerComponent(appName, () => App)
