import operators from '../../configs/operators.json'
import { COMMON_SOCKET_URL } from '../../configs'
import createChannel from './socket'

export function getEndpointByOperator (operator, method, information) {
  try {
    let enpoints = {}
    let baseUrl = ''

    switch (operator) {
      case 'qntu':
      case 'ethereum':
        baseUrl = operators[operator].DEFAULT_URL
        enpoints = operators[operator].ENDPOINTS
        return `${baseUrl}${enpoints[method]}`
      default:
        baseUrl = information.DEFAULT_URL || operators.default.DEFAULT_URL
        enpoints = information || operators.default.ENDPOINTS
        if (method === 'seed' || method === 'login') { return `${operators.default.ROUTING_SECURITY_URL}${enpoints[method]}` }
        return `${baseUrl}${enpoints[method]}`
    }
  } catch (err) {
    return undefined
  }
}

export function getSocketChannel (operator, wallet) {
  // TODO: Handle each operator
  if (operator === 'common') {
    return createChannel(COMMON_SOCKET_URL, wallet)
  }
  throw new Error('OPERATOR_NOT_EXIST')
}

export function getQueueName (operator) {
  switch (operator) {
    case 'qntu':
    case 'ethereum':
      return 'ethereum'
    default:
      return operator
  }
}
