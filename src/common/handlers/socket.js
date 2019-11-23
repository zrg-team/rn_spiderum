import { eventChannel } from 'redux-saga'
import io from 'socket.io-client'

let socketInstance = null
export default async (url, wallet, callbackConnected) => {
  return eventChannel(emitter => {
    if (socketInstance !== null) {
      socketInstance.close()
      socketInstance = null
    }
    socketInstance = io.connect(
      url,
      { transports: ['websocket'] }
    )
    console.log('socketHander SOCKET_CONNECT')
    socketInstance.on('connect', () => {
      // subscribe bitcoin address
      console.log('socketHander SOCKET_CONNECTED', url)
      // coinSocket.emit('', {})
      callbackConnected && callbackConnected(socketInstance)
      socketInstance.emit('subcribe_new', {
        address: wallet.default.address,
        events: ['confirmed_tx', 'balance_changed']
      })
      socketInstance.emit('subcribe_token', {
        events: [
          'erc20_balance_changed'
        ],
        token: '0xe3c530ec3619f3a08a7574d9e218412f687d2749'
      })
      socketInstance.on('confirmed_tx', function (msg) {
        console.log('socketHander ON TX', msg)
        return emitter({ type: 'CONFIRMED_TX', msg })
      })
      socketInstance.on('erc20_balance_changed', function (msg) {
        console.log('ERC20_CHANGE ON TX', msg)
        return emitter({ type: 'ERC20_CHANGE', msg })
      })
    })
    socketInstance.on('disconnect', function (reason) {
      // console.log(' DISCONNECT', reason)
    })
    socketInstance.on('reconnect', function () {
      // console.log('reconnected')
    })
    return () => {
      if (socketInstance !== null) {
        socketInstance.close()
        socketInstance = null
      }
    }
  })
}
