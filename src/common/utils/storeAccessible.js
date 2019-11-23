import redux from '../store'

function defaultDispatch () {
  console.log('Missing store')
}

class StoreAccessible {
  /**
   * @protected
   */
  getStates () {
    return (redux.store && redux.store.getState()) || {}
  }

  /**
   * @protected
   */
  getState (moduleName) {
    if (!moduleName) {
      return {}
    }
    const store = (redux.store && redux.store.getState()) || {}
    return store[moduleName] || {}
  }

  /**
   * @protected
   */
  get dispatch () {
    return (redux.store && redux.store.dispatch) || defaultDispatch
  }
}

export default new StoreAccessible()
