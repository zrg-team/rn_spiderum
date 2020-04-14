import { register } from 'react-native-bundle-splitter'

export const PAGES = {
  OptionList: 'OptionList',
  Bookmark: 'Bookmark',
  Debug: 'Debug'
}

export default (customScreenOption = {}) => {
  return {
    [PAGES.OptionList]: { screen: register({ require: () => require('../../pages/OptionPage') }), ...customScreenOption },
    [PAGES.Bookmark]: { screen: register({ require: () => require('../../pages/BookmarkPage') }), ...customScreenOption },
    [PAGES.Debug]: { screen: register({ require: () => require('../../pages/DebugPage') }), ...customScreenOption }
  }
}
