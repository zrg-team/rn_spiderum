import { all } from 'redux-saga/effects'
import commonSagas from './sagas/common'
import sessionSagas from './sagas/session'
import { moduleSagas } from '../modules'

export default getState => {
  function * rootSaga () {
    yield all([
      ...commonSagas,
      ...moduleSagas,
      ...sessionSagas
    ])
  }
  return rootSaga
}
