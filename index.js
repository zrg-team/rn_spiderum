import { AppRegistry, Platform } from 'react-native'
import { enableScreens } from 'react-native-screens'
import { name as appName } from './app.json'
import App from './src/App'
import './src/libraries/logger'

if (Platform.OS !== 'ios') {
  enableScreens()
}
console.time('[APPLICATION] Render')
AppRegistry.registerComponent(appName, () => App)
