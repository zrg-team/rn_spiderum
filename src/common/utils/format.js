import BigNumber from 'bignumber.js'

export function formatCurrency (value, digit = 2) {
  try {
    const result = new BigNumber(`${value}`)
    return new BigNumber(result.toFixed(digit)).toFormat()
  } catch (err) {
    return '0'
  }
}

export function formatCrypto (value, digit = 6) {
  try {
    const result = new BigNumber(`${value}`)
    return new BigNumber(result.toFixed(digit)).toFormat()
  } catch (err) {
    return '0'
  }
}
