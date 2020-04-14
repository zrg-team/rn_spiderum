import { register } from 'react-native-bundle-splitter'
import ReadingPage from '../../pages/ReadingPage'

export const PAGES = {
  Reading: 'Reading',
  Profile: 'Profile'
}

export default (customScreenOption = {}) => {
  return {
    [PAGES.Reading]: { screen: ReadingPage },
    [PAGES.Profile]: { screen: register({ require: () => require('../../pages/ProfilePage') }) }
  }
}
