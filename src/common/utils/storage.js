// @flow
import AsyncStorage from '@react-native-community/async-storage'

const getState = async (store = 'state') => {
  try {
    const savedState = await AsyncStorage.getItem(`_${store}_`)
    if (savedState) {
      return JSON.parse(savedState)
    }
    return {}
  } catch (error) {
    return {}
  }
}

const saveState = (state, store = 'state') => {
  return AsyncStorage.setItem(store, JSON.stringify(state))
}

export class Storage {
  constructor (store = 'state') {
    this.cache = {}
    this.store = store
  }

  async init () {
    try {
      this.cache = await getState(this.store)
      return this.cache
    } catch (err) {
      return false
    }
  }

  getStoreName () {
    return this.store
  }

  async changeStore (store) {
    if (store !== this.store) {
      this.store = store
      try {
        this.cache = await getState(store)
        return this.cache
      } catch (error) {
        return false
      }
    }
  }

  getCurrentStore () {
    return this.cache || {}
  }

  get (property) {
    return this.cache[property] || undefined
  }

  async set (property, value) {
    if (this.cache[property] === value) {
      return
    }
    this.cache[property] = value
    await saveState(this.cache, this.store)
    return true
  }

  async setAll (values) {
    this.cache = { ...this.cache, ...values }
    await saveState(this.cache, this.store)
    return this.cache
  }

  async remove (property) {
    delete this.cache[property]
    await saveState(this.cache, this.store)
    return true
  }
}

export default new Storage()
