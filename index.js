import { AppRegistry } from 'react-native'
import { useScreens } from 'react-native-screens'
import { name as appName } from './app.json'
import App from './src/App'
import './src/libraries/logger'

useScreens()
AppRegistry.registerComponent(appName, () => App)
