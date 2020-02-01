import { handleActions } from 'redux-actions'
import { clearAll } from '../../common/actions/common'
import * as actions from './actions'

const defaultState = {
  news: {},
  top: {},
  hot: {},
  search: {}
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState }),
  [actions.setNews]: (state, action) => {
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
  },
  [actions.setHots]: (state, action) => {
    const { page, results } = action.payload
    if (page === 1) {
      return {
        ...state,
        hot: results
      }
    }
    const { hot } = state
    hot.data = [...hot.data, ...results.data]
    return {
      ...state,
      hot
    }
  },
  [actions.setTops]: (state, action) => {
    const { page, results } = action.payload
    if (page === 1) {
      return {
        ...state,
        top: results
      }
    }
    const { top } = state
    top.data = [...top.data, ...results.data]
    return {
      ...state,
      top
    }
  },
  [actions.setSearchResults]: (state, action) => {
    const { page, results } = action.payload
    if (page === 1) {
      return {
        ...state,
        search: results
      }
    }
    const { search } = state
    search.data = [...search.data, ...results.data]
    return {
      ...state,
      search
    }
  }
}

export default handleActions(handlers, defaultState)
