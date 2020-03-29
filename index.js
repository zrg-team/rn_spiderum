import { AppRegistry, Platform } from 'react-native'
import { useScreens } from 'react-native-screens'
import { name as appName } from './app.json'
import App from './src/App'
import './src/libraries/logger'

if (Platform.OS !== 'ios') {
  useScreens()
}
AppRegistry.registerComponent(appName, () => App)
