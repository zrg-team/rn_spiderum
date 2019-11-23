import { createAction } from 'redux-actions'

export const clearAll = createAction('CLEAR_ALL')

export const notification = createAction('NOTIFICATION')
export const setUserLanguage = createAction('SET_USER_LANGUAGE')
export const setSetting = createAction('SET_SETTING')
export const setNavigationPage = createAction('SET_NAVIGATION_PAGE')
export const setNetworkStatus = createAction('SET_NETWORK_STATUS')
export const setApplicationState = createAction('SET_APPLICATION_STATE')
export const updateAppIntro = createAction('UPDATE_APP_INTRO')

export const fetchStart = createAction('API_FETCH_START')
export const fetchSuccess = createAction('API_FETCH_SUCCESS')
export const fetchFailure = createAction('API_FETCH_FAILURE')

export const setSession = createAction('SET_SESSION')
export const addSession = createAction('ADD_SESSION')
export const clearSession = createAction('CLEAR_SESSION')
export const addSessionMessage = createAction('ADD_SESSION_MESSAGE')

export const loadStart = createAction('LOADING_START')
export const loadEnd = createAction('LOADING_END')

export const setSessionKey = createAction('SET_SESSION_KEY')
