import { handleActions } from 'redux-actions'
import * as actions from './actions'
import { clearAll } from '../../common/actions/common'

const defaultState = {
  darkMode: true
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState }),
  [actions.toggleUIMode]: (state, action) => {
    return {
      ...state,
      darkMode: !state.darkMode
    }
  }
}

export default handleActions(handlers, defaultState)
