import { handleActions } from 'redux-actions'
import { clearAll } from '../../common/actions/common'
import * as actions from './actions'

const defaultState = {
  fontSize: 14
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState }),
  [actions.setFontSize]: (state, action) => {
    return {
      ...state,
      fontSize: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)
