import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import store from './common/store'
import Root from './common/hocs/Root'

// Disable message in the bottom
console.disableYellowBox = true
// Pure class no need Component
window.navigator.userAgent = 'react-native'
export default () => (
  <Provider store={store.store}>
    <PersistGate loading={null} persistor={store.persistor}>
      <Root />
    </PersistGate>
  </Provider>
)
