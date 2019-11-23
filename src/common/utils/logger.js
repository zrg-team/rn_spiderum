import moment from 'moment'
import stacktraceParser from 'stacktrace-parser'
import { setNativeExceptionHandler } from 'react-native-exception-handler'
import { Storage } from './storage'

export const logLevel = {
  FATAL: 5,
  ERROR: 4,
  WARNING: 3,
  INFO: 2,
  DEBUG: 1
}

export function getlogLevelLabel (level) {
  switch (level) {
    case logLevel.FATAL:
      return 'FATAL'
    case logLevel.ERROR:
      return 'ERROR'
    case logLevel.WARNING:
      return 'WARNING'
    case logLevel.INFO:
      return 'INFO'
    case logLevel.DEBUG:
      return 'DEBUG'
  }
  return '--'
}

class Logger {
  async fatal (message) {
    await this._log(logLevel.FATAL, message)
  }

  async error (message) {
    await this._log(logLevel.ERROR, message)
  }

  async warning (message) {
    await this._log(logLevel.WARNING, message)
  }

  async info (message) {
    await this._log(logLevel.INFO, message)
  }

  async debug (message) {
    await this._log(logLevel.DEBUG, message)
  }

  async _log (level, message) {
    if (level >= this._writablelogLevel) {
      const content = `${this.getTimestamp()} ${getlogLevelLabel(
        level
      )} ${message}`
      await this._writeLog(content)
    }
  }

  async init () {
    this.store = new Storage('logger')
    this._writablelogLevel = logLevel.DEBUG
    this.setupNotification()
    await this.store.init()
    this.initGlobalErrorLogging()
    setNativeExceptionHandler(
      this.exceptionhandler
    )
  }

  setupNotification () {
    console.log('%c ========================== 🗒️ USER-LOG ==========================', 'background: #F83437; color: white; display: block;')
    window.notification = {}
    // console.log = __DEV__ ? (message, ...options) => { // eslint-disable-line
    //   console.log(
    //     '%c [🗒️ USER] LOG ',
    //     'color: white; background-color: #2274A5',
    //     message,
    //     ...options
    //   )
    // } : () => {}
    console.info.info = __DEV__ ? (message, ...options) => { // eslint-disable-line
      console.log(
        '%c [🗒️ USER] INFORMATION ',
        'color: white; background-color: #95B46A',
        message,
        ...options
      )
    } : () => {}
    console.error = __DEV__ ? (message, ...options) => { // eslint-disable-line
      console.log(
        '%c [🗒️ USER] ERROR ',
        'color: white; background-color: #D33F49',
        message,
        ...options
      )
    } : () => {}
  }

  exceptionhandler (exceptionString) {
    console.log('exceptionString', exceptionString)
  }

  getTimestamp () {
    return moment(new Date())
      .utcOffset(true)
      .format('YYYY-MM-DD HH:mm:ssZZ')
  }

  generateFileKeyForNow () {
    return moment(new Date())
      .utcOffset(true)
      .format('YYYY-MM-DD')
  }

  async _writeLog (content) {
    // TODO: Write to file or something
    // this.store && this.store.set(moment().unix(), content)
  }

  async readLogFile () {
    // TODO: Read file
    return this.store && this.store.getCurrentStore()
  }

  parseErrorStack (error) {
    if (!error || !error.stack) {
      return []
    }
    return Array.isArray(error.stack)
      ? error.stack
      : stacktraceParser.parse(error.stack)
  }

  initGlobalErrorLogging () {
    if (ErrorUtils) { // eslint-disable-line
      const globalHandler =
        ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler() // eslint-disable-line
      if (globalHandler) {
        ErrorUtils.setGlobalHandler((error, isFatal) => { // eslint-disable-line
          this.writeGlobalLog(
            isFatal,
            error.message,
            this.parseErrorStack(error)
          )
        })
      }
    }
    // setJSExceptionHandler(async (error, isFatal) => {
    //   if (isFatal) {
    //     await this.fatal(error)
    //     Alert.alert(
    //       ' Unexpected error occurred',
    //       `
    //         Error: ${error}
    //         You can send us report in support page! Please close the app and start again!
    //       `,
    //       [{
    //         text: 'Close',
    //         onPress: () => {
    //         }
    //       }]
    //     )
    //   }
    // })
  }

  writeGlobalLog (fatal, message, stackTrace) {
    let errorString = `ERROR: ${message} \nSTACKSTRACE:\n` // eslint-disable-line
    if (stackTrace && Array.isArray(stackTrace)) {
      const stackMessages = stackTrace.map(stackTraceItem => {
        const file =
          stackTraceItem.file !== undefined ? stackTraceItem.file : '-'
        const methodName =
          stackTraceItem.methodName && stackTraceItem.methodName !== '<unknown>'
            ? stackTraceItem.methodName
            : '-'
        const lineNumber =
          stackTraceItem.lineNumber !== undefined
            ? stackTraceItem.lineNumber.toString()
            : '-'
        const column =
          stackTraceItem.column !== undefined
            ? stackTraceItem.column.toString()
            : '-'
        return `File: ${file}, Method: ${methodName}, LineNumber: ${lineNumber}, Column: ${column}`
      })
      errorString += stackMessages.join('\n')
    }

    if (fatal) {
      this._writeLog(`${this.getTimestamp()} RNFatal ${errorString}`)
    }
    this._writeLog(`${this.getTimestamp()} RNError ${errorString}`)
  }
}

const logger = new Logger()
export default logger
