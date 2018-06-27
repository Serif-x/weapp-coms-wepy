/**
 * Storage
 */

/**
 * Memory storage
 * @constructor
 */
class MemoryStorage {
  constructor (...args) {
    this.store = new Map(args)
  }

  get (...args) { return Map.prototype.get.apply(this.store, args) }
  set (...args) { return Map.prototype.set.apply(this.store, args) }
  clear (...args) { return Map.prototype.clear.apply(this.store, args) }
  keys (...args) { return Map.prototype.keys.apply(this.store, args) }
  has (...args) { return Map.prototype.has.apply(this.store, args) }
  delete (...args) { return Map.prototype.delete.apply(this.store, args) }

  /**
   * Get store Object literal
   * @returns {Object}
   */
  getObject () {
    let obj = {}
    this.store.forEach((val, key) => {
      if (typeof val === 'undefined' || val === null) {
        // Replace null or undefined value to empty String
        obj[key] = ''
      } else {
        obj[key] = val
      }
    })
    return obj
  }

  /**
   * Clear current store clone data from another Object
   * @param obj
   * @returns {Map}
   */
  resetStore (obj) {
    this.store.clear()

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.store.set(key, obj[key])
      }
    }

    return this.store
  }
}

class LocalStorage {
  // constructor () {}

  /**
   * Save storage
   * @param {Object|String} args
   * @param {String} [args]
   * @returns {*}
   */
  static set (...args) {
    if (args.length === 2) {
      return new Promise((resolve, reject) => {
        return wx.setStorage({
          key: args[0],
          data: args[1],
          success: resolve,
          fail: reject
        })
      })
    }

    const { obj } = args
    const promises = []

    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        ((key) => {
          promises.push(new Promise((resolve, reject) => {
            return wx.setStorage({
              key: key,
              data: obj[key],
              success: resolve,
              fail: reject
            })
          }))
        })(k)
      }
    }

    return Promise.all(promises)
      .then((res) => {
        console.log('Storage save success.')
        return res
      })
  }

  static get (key) {
    return new Promise((resolve, reject) => {
      return wx.getStorage({
        key: key,
        success: res => resolve(res.data),
        fail: reject
      })
    })
  }

  static remove (key) {
    return new Promise((resolve, reject) => {
      return wx.removeStorage({
        key: key,
        success: res => resolve(res.data),
        fail: reject
      })
    })
  }

  static clear () {
    return new Promise((resolve, reject) => {
      return wx.clearStorage({
        success: res => resolve(res.data),
        fail: reject
      })
    })
  }
}

export default {
  LocalStorage,
  MemoryStorage
}
