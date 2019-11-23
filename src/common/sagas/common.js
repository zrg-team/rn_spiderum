
import {
  takeLatest
} from 'redux-saga/effects'
import {
  setNavigationPage
} from '../actions/common'
import { SCREENS } from '../routes'

function * onPageChanged ({ payload }) {
  try {
    switch (payload.currentPage) {
      case SCREENS.Home:
        break
    }
  } catch (err) {
  }
}

function * watchPageChange () {
  yield takeLatest(setNavigationPage.toString(), onPageChanged)
}

export default [
  watchPageChange()
]
