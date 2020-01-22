import { MODULE_NAME as MODULE_READING } from './reading/models'
import { MODULE_NAME as MODULE_HOME } from './home/models'
import { MODULE_NAME as MODULE_CATEGORY } from './category/models'
import { MODULE_NAME as MODULE_PROFILE } from './profile/models'
import { MODULE_NAME as MODULE_USER } from './user/models'
import { MODULE_NAME as MODULE_OPTION } from './option/models'
import reducerReading from './reading/reducers'
import reducerCategory from './category/reducers'
import reducerHome from './home/reducers'
import reducerProfile from './profile/reducers'
import reducerUser from './user/reducers'
import reducerOption from './option/reducers'

export const moduleReducers = {
  [MODULE_READING]: reducerReading,
  [MODULE_HOME]: reducerHome,
  [MODULE_CATEGORY]: reducerCategory,
  [MODULE_PROFILE]: reducerProfile,
  [MODULE_USER]: reducerUser,
  [MODULE_OPTION]: reducerOption
}

export const moduleSagas = [
]
