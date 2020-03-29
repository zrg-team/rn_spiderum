import AsyncStorage from '@react-native-community/async-storage'

const getState = async (store = 'state') => {
  try {
    console.info('[STORAGE] Get state ', store)
    const savedState = await AsyncStorage.getItem(`_${store}_`)
    if (savedState) {
      return JSON.parse(savedState)
    }
    return {}
  } catch (error) {
    console.debug('[STORAGE] getState', error)
    return {}
  }
}

const saveState = (state, store = 'state') => {
  return AsyncStorage.setItem(`_${store}_`, JSON.stringify(state))
}

const removeState = (store = 'state') => {
  return AsyncStorage.removeItem(`_${store}_`)
}

export class Storage {
  constructor () {
    this.cache = {}
  }

  async init (stores) {
    try {
      const results = await Promise.all(
        stores.map(name => {
          return getState(name)
            .then(result => {
              return { [name]: result }
            })
            .catch(error => {
              console.debug('[STORAGE] init ', error)
              return {}
            })
        })
      )
      this.cache = results.reduce((all, item) => {
        return { ...all, ...item }
      }, {})
      return true
    } catch (err) {
      return false
    }
  }

  getAllKeys () {
    return AsyncStorage.getAllKeys()
  }

  multiGet (arr) {
    return AsyncStorage.multiGet(arr)
  }

  removeDirectItem (key) {
    return AsyncStorage.removeItem(`_${key}_`)
  }

  setDirectItem (key, value) {
    return AsyncStorage.setItem(`_${key}_`, value)
  }

  getDirectItem (key) {
    return AsyncStorage.getItem(`_${key}_`)
  }

  getCurrentStore (store) {
    return this.cache[store] || null
  }

  get (store, property) {
    return this.cache[store]
      ? this.cache[store][property] : undefined
  }

  async set (store, property, value) {
    if (!this.cache || !this.cache[store] || (this.cache[store][property] === value)) {
      return
    }
    this.cache[store][property] = value
    await saveState(this.cache[store], store)
    return true
  }

  async setAll (store, values) {
    this.cache[store] = { ...this.cache[store], ...values }
    await saveState(this.cache[store], store)
    return this.cache
  }

  async remove (store, property) {
    if (!this.cache || !this.cache[store]) {
      return
    }
    delete this.cache[store][property]
    await saveState(this.cache[store], store)
    return true
  }

  async removeAll (store) {
    try {
      delete this.cache[store]
      await removeState(store)
      return true
    } catch (err) {
      return false
    }
  }
}

export default new Storage()
