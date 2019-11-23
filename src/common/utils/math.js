import { BigNumber } from 'bignumber.js'

export function addBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item) => {
      return all.plus(new BigNumber(`${item}`))
    }, new BigNumber(0))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function mulBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item, index) => {
      if (index === 0) {
        return all
      } else if (all.mul) {
        all = all.mul(new BigNumber(`${item}`))
      } else if (all.multipliedBy) {
        all = all.multipliedBy(new BigNumber(`${item}`))
      }
      return all
    }, new BigNumber(`${values[0]}`))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function divBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item, index) => {
      if (index === 0) {
        return all
      } else if (all.div) {
        all = all.div(new BigNumber(`${item}`))
      } else if (all.dividedBy) {
        all = all.dividedBy(new BigNumber(`${item}`))
      }
      return all
    }, new BigNumber(`${values[0]}`))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function minusBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item, index) => {
      if (index === 0) {
        return all
      }
      return all.minus(new BigNumber(`${item}`))
    }, new BigNumber(`${values[0]}`))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}
