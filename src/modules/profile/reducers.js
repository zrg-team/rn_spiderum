import { handleActions } from 'redux-actions'
import { clearAll } from '../../common/actions/common'
import * as actions from './actions'

const defaultState = {
  news: {}
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState }),
  [actions.setProfileNews]: (state, action) => {
    const { page, results } = action.payload
    if (page === 1) {
      return {
        ...state,
        news: results
      }
    }
    const { news } = state
    news.data = [...news.data, ...results.data]
    return {
      ...state,
      news
    }
  }
}

export default handleActions(handlers, defaultState)
