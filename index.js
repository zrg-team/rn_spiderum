import { AppRegistry } from 'react-native'
import { useScreens } from 'react-native-screens'
import { name as appName } from './app.json'
import App from './src/App'
import logger from './src/libraries/logger'

useScreens()
logger.init()
AppRegistry.registerComponent(appName, () => App)
