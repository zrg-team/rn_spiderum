import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setFontSize = createAction(`${MODULE_NAME}/SET_FONT_SIZE`)
