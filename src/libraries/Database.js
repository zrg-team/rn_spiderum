import SQLite from 'react-native-sqlite-storage'
import { DEBUG } from '../configs'

SQLite.DEBUG(DEBUG)
SQLite.enablePromise(true)

const SCHEMES = {
  transactions: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    txKey: 'TEXT NOT NULL',
    operator: 'TEXT NOT NULL',
    blockHash: 'TEXT',
    blockNumber: 'INTEGER',
    cumulativeGasUsed: 'TEXT',
    from: 'TEXT',
    gas: 'TEXT',
    gasPrice: 'TEXT',
    gasUsed: 'TEXT',
    hash: 'TEXT',
    input: 'TEXT',
    logs: 'TEXT',
    nonce: 'INTEGER',
    status: 'TEXT',
    timeStamp: 'INTEGER',
    to: 'TEXT',
    transactionIndex: 'INTEGER',
    value: 'TEXT',
    param_1: 'TEXT',
    param_2: 'TEXT',
    param_3: 'TEXT',
    param_4: 'TEXT',
    param_5: 'TEXT',
    param_6: 'TEXT',
    param_7: 'TEXT',
    param_8: 'TEXT',
    param_9: 'TEXT'
  }
}

class Database {
  constructor () {
    this.NAME = 'qvi'
    this.VERSION = '1.0'
    this.DISPLAY_NAME = 'qvi transaction'
    this.DATABASE_SIZE = 2000000

    this.database = null
  }

  createTables (instance) {
    return new Promise((resolve, reject) => {
      this.database.transaction(async (transaction) => {
        return Promise.all(
          Object.keys(SCHEMES).map(key => {
            const scheme = SCHEMES[key]
            const data = Object.keys(scheme).map(item => {
              return `"${item}" ${scheme[item]}`
            })
            return transaction.executeSql(`CREATE TABLE IF NOT EXISTS ${key} (${data.join(',')})`, [])
          })
        )
          .then(() => {
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }

  parseInsertQuery (table, params, valueOnly = false) {
    const values = []
    const scheme = SCHEMES[table]
    const fields = Object.keys(params).map(key => {
      if (scheme[key]) {
        values.push(params[key])
        return `"${key}"`
      }
      return null
    }).filter(item => item)
    if (!fields.length) {
      throw new Error('MISSING_FIELD')
    }

    let query = ''
    if (valueOnly) {
      query = `(${values.map(item => '?').join(',')})`
    } else {
      query = `INSERT INTO ${table} (${fields.join(',')}) VALUES(${values.map(item => '?').join(',')})`
    }

    console.log('insert', `${query};`, values)
    return { query, values }
  }

  parseSelectQuery (table, params) {
    const { where = [], orders = [], limit, groups = [], offset } = params
    let query = `SELECT * FROM ${table}`
    const values = []
    const conditions = where.map(item => {
      const field = item[0]
      let condition = '='
      if (item.length === 3) {
        condition = item[1]
        values.push(item[2])
      } else {
        values.push(item[1])
      }

      return ` "${field}" ${condition} ? `
    })
    const orderBy = orders.map(item => {
      let type = 'DESC'
      if (item.length === 2) {
        type = item[1]
      }

      return ` "${item[0]}" ${type} `
    })

    if (conditions.length) {
      query += ` WHERE ${conditions.join('&')} `
    }
    if (orderBy.length) {
      query += ` ORDER BY ${orderBy.join(',')} `
    }
    if (groups.length) {
      query += ` GROUP BY ${groups.join(',')} `
    }
    if (limit) {
      query += ` LIMIT ${limit} `
    }
    if (offset !== undefined) {
      query += ` OFFSET ${offset} `
    }
    console.log('query', `${query};`, values)
    return { query, values }
  }

  parseBulkInsert (table, items) {
    let parameters = []
    let allQuery = ''
    let count = 0
    const queries = []
    items.forEach((item, index) => {
      if (count === 0) {
        const result = this.parseInsertQuery(table, item)
        allQuery += result.query
        parameters.push(result.values)
      } else {
        const result = this.parseInsertQuery(table, item, false)
        allQuery += result.query
        parameters.push(result.values)
      }
      count++
      if (count > 300) {
        queries.push({ query: `${allQuery};`, params: parameters })
        parameters = []
        allQuery = ''
        count = 0
      } else {
        allQuery += ','
      }
    })
    if (count > 0) {
      queries.push({ query: `${allQuery.slice(0, -1)};`, params: parameters })
    }
    console.log('queries', queries)
    return queries
  }

  model (table) {
    return {
      insert: (params) => {
        const { query, values } = this.parseInsertQuery(table, params)
        return this.query(`${query};`, values)
      },
      bulkInsert: (items) => {
        const queries = this.parseBulkInsert(table, items)
        return this.transactionAll(queries)
      },
      get: (params) => {
        const { query, values } = this.parseSelectQuery(table, params)
        return this.query(`${query};`, values)
      }
    }
  }

  table (name) {
    if (!name || !SCHEMES[name]) {
      throw new Error('INVALID_TABLE')
    }
    return {
      ...this.model(name)
    }
  }

  query (sql, params) {
    return this.database.executeSql(sql, params)
  }

  transactionAll (queries) {
    return new Promise((resolve, reject) => {
      this.database.transaction(async (transaction) => {
        return Promise.all(
          queries.map(item => {
            return transaction.executeSql(item.query, item.params)
          })
        )
          .then((result) => {
            resolve(result)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }

  transaction (queries) {
    return new Promise((resolve, reject) => {
      this.database.transaction(async (transaction) => {
        try {
          let i = 0
          const length = queries.length
          const results = []
          for (i = 0; i < length; i++) {
            const item = queries[i]
            const result = await transaction.executeSql(item.query, item.params)
            results.push(result)
          }
          resolve(results)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  init () {
    return new Promise((resolve) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            this.NAME,
            this.VERSION,
            this.DISPLAY_NAME,
            this.DATABASE_SIZE
          )
            .then(async instance => {
              this.database = instance
              console.log('Database OPEN')
              await this.createTables()
              resolve(this.database)
            })
            .catch(error => {
              console.log(error)
              resolve(error)
            })
        })
        .catch(error => {
          console.log('init error', error)
          resolve(error)
        })
    })
  }

  close () {
    if (this.database) {
      this.database.close()
        .then(status => {
          console.log('Database CLOSED')
        })
        .catch(error => {
          this.errorCB(error)
        })
    } else {
      console.log('Database was not OPENED')
    }
  }
}

export default new Database()
