import { register } from 'react-native-bundle-splitter'

export const PAGES = {
  Categories: 'Categories',
  CategoryDetail: 'CategoryDetail'
}

export default (customScreenOption = {}) => {
  return {
    [PAGES.Categories]: { screen: register({ require: () => require('../../pages/CategoriesPage') }), ...customScreenOption },
    [PAGES.CategoryDetail]: { screen: register({ require: () => require('../../pages/CategoryDetailPage') }), ...customScreenOption }
  }
}
