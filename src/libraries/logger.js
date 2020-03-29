import moment from 'moment'
import stacktraceParser from 'stacktrace-parser'
import { setNativeExceptionHandler, setJSExceptionHandler } from 'react-native-exception-handler'
import database from './Database'
import { LOG_LEVEL, LOG_TERMINAL } from '../configs'

export const logLevel = {
  fatal: 0,
  debug: 1,
  info: 4,
  time: 5,
  request: 6
}

async function writeLog (level, message, ...options) {
  try {
    await database.model('logs').insert({
      timestamp: Date.now(),
      module: level,
      data:
        `📢 ${message} 📢\n${options.map(item => {
          if (item instanceof Error && item.response) {
            return JSON.stringify({
              message: item.message,
              data: item.response.data,
              status: item.response.status,
              headers: item.response.headers,
              ...item.response
            }, null, 2)
          } if (item instanceof Error && item.request) {
            return JSON.stringify({
              message: item.message,
              ...item.request
            }, null, 2)
          } if (item instanceof Error) {
            return item.message
          } else if (typeof item === 'object' || Array.isArray(item)) {
            return JSON.stringify(item, null, 2)
          }
          return item
        }).join('\n')}`
    })
  } catch (err) {
  }
}

class Logger {
  constructor () {
    try {
      this.setupLog()
      this._writablelogLevel = logLevel.DEBUG
      this.initGlobalErrorLogging()
      setNativeExceptionHandler(
        this.exceptionhandler.bind(this)
      )
      console.info('[LOGGER] init')
    } catch (err) {
      console.debug('[LOGGER] init error', err)
    }
  }

  setupLog () {
    console.log(`
    ██████╗█████████╗   ██╗
    ██╔══████╔════██║   ██║
    ██║  ███████╗ ██║   ██║
    ██║  ████╔══╝ ╚██╗ ██╔╝
    ██████╔███████╗╚████╔╝
    ╚═════╝╚══════╝ ╚═══╝
`)
    if (!LOG_TERMINAL) {
      console.log = function () {}
    }
    if (!LOG_LEVEL) {
      console.info = function () {}
      console.debug = function () {}
      console.time = function () {}
      console.request = function () {}
      console.timeEnd = function () {}
    } else {
      console.info = function (message, ...options) { // eslint-disable-line
        if (logLevel[LOG_LEVEL] >= logLevel.info) {
          console.log(
            '\x1b[32m💬',
            message,
            ...options
          )
          writeLog('INFO', message, ...options)
        }
      }
      console.request = function (message, ...options) { // eslint-disable-line
        if (logLevel[LOG_LEVEL] >= logLevel.request) {
          console.log(
            '\x1b[35m📤',
            message,
            ...options
          )
          writeLog('REQUEST', message, ...options)
        }
      }
      console.debug = function (message, ...options) { // eslint-disable-line
        if (logLevel[LOG_LEVEL] >= logLevel.debug) {
          console.log(
            '\x1b[31m🚨',
            message,
            ...options
          )
          writeLog('DEBUG', message, ...options)
        }
      }
      const logTimes = {}
      console.time = function (label) { // eslint-disable-line
        if (logLevel[LOG_LEVEL] >= logLevel.time) {
          const start = Date.now()
          console.log(
            '\x1b[36m🚀',
            label,
            '🚀'
          )
          logTimes[label] = start
        }
      }
      console.timeEnd = function (label, ...args) { // eslint-disable-line
        if (logLevel[LOG_LEVEL] >= logLevel.time) {
          const end = Date.now()
          const work = (end - logTimes[label]) / 1000
          console.log(
            '\x1b[36m🚀',
            label,
            ' ====> ',
            `${work} seconds`,
            '🚀'
          )
          delete logTimes[label]
          writeLog('TIME', `🚀 ${label} ${work} seconds 🚀`, ...args)
          return work
        }
      }
    }
  }

  exceptionhandler (exceptionString) {
    console.debug(exceptionString)
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

  async readLogFile () {
    // TODO: Read file
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
    // if (ErrorUtils) { // eslint-disable-line
    //   const globalHandler =
    //     ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler() // eslint-disable-line
    //   if (globalHandler) {
    //     ErrorUtils.setGlobalHandler((error, isFatal) => { // eslint-disable-line
    //       this.writeGlobalLog(
    //         isFatal,
    //         error.message,
    //         this.parseErrorStack(error)
    //       )
    //     })
    //   }
    // }
    setJSExceptionHandler(async (error, isFatal) => {
      console.debug(error)
    })
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
      console.debug(`RNFatal ${errorString}`)
    }
    console.debug(`RNError ${errorString}`)
  }
}

export default new Logger()
