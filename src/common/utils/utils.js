/**
 * Utils
 */

export default class Utils {
  // constructor () {}

  static deSerialize (url) {
    const query = {}

    if (!url) {
      return query
    }

    let str
    if (url.indexOf('?') === -1) {
      str = url
    } else {
      str = url.split('?')[1]
    }

    str = str.split('#')[0] // remove hash

    const queries = str.split('&')
    for (let i = 0; i < queries.length; i++) {
      let q = queries[i]
      const qArr = q.split('=')
      query[qArr[0]] = qArr[1]
    }

    return query
  }

  static serialize (obj) {
    let _str = ''

    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        _str += ('&' + k + '=' + (obj[k] || ''))
      }
    }

    _str = _str.length >= 1 ? _str.substr(1) : _str

    return _str
  }

  static extendUrl (url, params) {
    if (!url) {
      return ''
    }
    const _url = url.split('?')
    const rawPath = _url[0]
    const rawQuery = _url[1]

    const query = Object.assign({}, Utils.deSerialize(rawQuery), params)
    const queryStr = Utils.serialize(query)
    return rawPath + (queryStr ? ('?' + queryStr) : '')
  }

  static throttle (fn, delay, atLeast, processBefore) {
    let _timer = null
    let _previous = null

    return function (...args) {
      let _that = this
      let _now = +new Date()

      if (!_previous) _previous = _now

      processBefore && processBefore()
      clearTimeout(_timer)

      if (atLeast && _now - _previous >= atLeast) {
        fn.apply(_that, args)
        _previous = _now
      }

      _timer = setTimeout(() => {
        fn.apply(_that, args)
      }, delay || 1000)
    }
  }

  static sleep (duration = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, duration)
    })
  }
}
