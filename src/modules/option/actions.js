import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const toggleUIMode = createAction(`${MODULE_NAME}/TOGGLE_UI_MODE`)
