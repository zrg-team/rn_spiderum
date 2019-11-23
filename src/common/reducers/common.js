import { handleActions } from 'redux-actions'
import * as actions from '../actions/common'
import i18n from 'i18n-js'
import moment from 'moment'

const defaultState = {
  notifications: {},
  language: 'en',
  currentPage: '',
  previousPage: '',
  appIntro: false,
  copilot: false
}

const handlers = {
  [actions.clearAll]: (state, action) => {
    return {
      ...defaultState
    }
  },
  [actions.notification]: (state, action) => ({
    ...state,
    ...{
      notifications: {
        ...state.notification,
        ...{
          [action.payload.key]: action.payload
        }
      }
    }
  }),
  [actions.setUserLanguage]: (state, action) => {
    try {
      i18n.locale = action.payload
      moment.locale(action.payload)
    } catch (err) {
    }
    return {
      ...state,
      language: action.payload
    }
  },
  [actions.setNavigationPage]: (state, action) => {
    return {
      ...state,
      currentPage: action.payload.currentPage,
      previousPage: action.payload.previousPage
    }
  },
  [actions.updateAppIntro]: (state, action) => {
    return {
      ...state,
      appIntro: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)
