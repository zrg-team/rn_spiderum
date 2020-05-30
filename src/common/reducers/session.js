import { handleActions } from 'redux-actions'
import * as actions from '../actions/common'

const updateFetching = (fetching, payload, upDown) => {
  const { config } = payload
  const key = config.key || config.url
  if (upDown < 0 && fetching[key] + upDown === 0) {
    delete fetching[key]
  } else {
    fetching[key] = (fetching[key] || 0) + upDown
  }
  return fetching
}

const defaultState = {
  network: true,
  fetching: {},
  loadingCount: 0,
  isLoading: false,
  message: null,
  data: {},
  appState: 'active',
  key: '',
  currentPage: '',
  previousPage: ''
}

const handlers = {
  [actions.clearAll]: (state, action) => {
    return {
      ...defaultState
    }
  },
  [actions.setNavigationPage]: (state, action) => {
    return {
      ...state,
      currentPage: action.payload.currentPage,
      previousPage: action.payload.previousPage
    }
  },
  [actions.setSessionKey]: (state, action) => ({
    ...state,
    key: action.payload
  }),
  [actions.addSessionMessage]: (state, action) => ({
    ...state,
    message: action.payload
  }),
  [actions.setNetworkStatus]: (state, action) => ({
    ...state,
    network: action.payload
  }),
  [actions.setApplicationState]: (state, action) => ({
    ...state,
    appState: action.payload
  }),
  [actions.setSession]: (state, action) => ({
    ...state,
    data: { ...action.payload }
  }),
  [actions.addSession]: (state, action) => ({
    ...state,
    data: { ...state.data, ...action.payload }
  }),
  [actions.clearSession]: (state, action) => ({
    ...state,
    data: {}
  }),
  [actions.fetchStart]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, 1) }
  }),
  [actions.fetchSuccess]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, -1) }
  }),
  [actions.fetchFailure]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, -1) }
  }),
  [actions.loadStart]: (state, action) => ({
    ...state,
    ...{
      loadingCount: state.loadingCount + 1,
      isLoading: true
    }
  }),
  [actions.loadEnd]: (state, action) => ({
    ...state,
    ...{
      loadingCount: state.loadingCount - 1 < 0
        ? 0 : state.loadingCount - 1,
      isLoading: state.loadingCount > 1
    }
  })
}

export default handleActions(handlers, defaultState)
