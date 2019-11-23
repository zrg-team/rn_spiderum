import { handleActions } from 'redux-actions'
import { clearAll } from '../../common/actions/common'
import * as actions from './actions'

const defaultState = {
  bookmark: []
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState }),
  [actions.saveNews]: (state, action) => {
    return {
      ...state,
      bookmark: [action.payload, ...state.bookmark]
    }
  }
}

export default handleActions(handlers, defaultState)
