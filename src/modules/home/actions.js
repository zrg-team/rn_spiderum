import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setNews = createAction(`${MODULE_NAME}/SET_NEWS`)
export const setHots = createAction(`${MODULE_NAME}/SET_HOTS`)
export const setTops = createAction(`${MODULE_NAME}/SET_TOPS`)
export const setSearchResults = createAction(`${MODULE_NAME}/SET_SEARCH_RESULTS`)
