
import {
  takeEvery,
  select
} from 'redux-saga/effects'
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  loadStart,
  loadEnd
} from '../actions/common'
import CommonLoading from '../components/Widgets/CommonLoading'
import ProgressBar from '../components/Widgets/ProgressBar'

function * onFetchStart ({ payload: { config } }) {
  yield ProgressBar.show(false)
  // console.log('Fetch Start', config)
}

function * onFetchSuccess ({ payload: { response, config } }) {
  yield ProgressBar.hide(false)
  // console.log('Fetch Success', config)
}

function * onFetchFailure ({ payload: { error, config } }) {
  yield ProgressBar.hide()
  // Notification.error(error.message)
  console.debug(error)
}

function * watchFetchStart () {
  yield takeEvery(fetchStart.toString(), onFetchStart)
}
function * watchFetchSuccess () {
  yield takeEvery(fetchSuccess.toString(), onFetchSuccess)
}
function * watchFetchFailure () {
  yield takeEvery(fetchFailure.toString(), onFetchFailure)
}

function * onLoadingChanged () {
  // TODO: Do something in redux when loading
  const isLoading = yield select(state => state.session.isLoading)
  const loadingCount = yield select(state => state.session.loadingCount)
  if (isLoading) {
    CommonLoading.show()
  } else if (loadingCount === 0) {
    CommonLoading.hide()
  }
}

function * watchLoadStart () {
  yield takeEvery(loadStart.toString(), onLoadingChanged)
}

function * watchLoadEnd () {
  yield takeEvery(loadEnd.toString(), onLoadingChanged)
}

export default [
  watchFetchStart(),
  watchFetchSuccess(),
  watchFetchFailure(),
  watchLoadStart(),
  watchLoadEnd()
]
