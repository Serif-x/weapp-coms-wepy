import wepy from 'wepy'
import wxTip from './wxTip'
import error from './error'

const API_CODE_SUCCESS = 1000
const SIGN_DATA = {}

/**
 * Sign default data to request body
 * @param {Object} data
 * @returns {Object}
 */
export function sign (data) {
  return Object.assign(SIGN_DATA, data)
}

function generateToken () {
  return Math.floor(Math.random() * 1e13)
}

function serializeParams (params) {
  if (!params || typeof params !== 'object') {
    return params
  }

  const obj = {}

  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      obj[p] = (typeof params[p] === 'object') ? JSON.stringify(params[p]) : params[p]
    }
  }

  return obj
}

/**
 * Send request
 * @param url
 * @param {Object} [payload]
 * @param {Object} [options]
 * @returns {Promise}
 */
function send (url, payload = {}, options = {}) {
  const {
    method = 'GET',
    showLoading = true,
    requestType = 'application/x-www-form-urlencoded; charset=utf-8'
  } = options

  const returnData = {
    statusCode: 0,
    code: null,
    data: null,
    msg: '请求异常'
  }

  if (showLoading) {
    wxTip.loading()
  }

  const _reqId = Date.now()
  const _reqObj = { url, payload }
  console.log(`==> Request [${_reqId}]: %o`, _reqObj)

  if (method.toUpperCase() === 'POST') {
    payload = serializeParams(payload)
  }

  return wepy.request({
    url: url,
    method: method,
    data: {
      ...SIGN_DATA,
      ...payload
    },
    // dataType: 'json',
    header: {
      'Content-Type': requestType,
      'Token': generateToken()
    }
  })
    .then((res) => {
      returnData.statusCode = res.statusCode
      returnData.msg = res.errMsg

      if (res.statusCode === 200) {
        const resData = res.data || {}

        // Map properties from server
        returnData.code = resData.code
        returnData.data = resData.data
        returnData.msg = resData.msg

        if (resData.code === API_CODE_SUCCESS) {
          console.log(`<== Response [${_reqId}]: %o`, {
            refRequest: _reqObj,
            response: res
          })
          return returnData
        }

        throw returnData
      }

      throw returnData
    })
    .catch((res) => {
      console.warn(`<== Response [${_reqId}]: %o`, {
        refRequest: _reqObj,
        response: res
      })

      returnData.statusCode = res.statusCode
      returnData.code = res.code
      returnData.data = res.data
      returnData.msg = error.getResponseStatusDesc(res.statusCode) || error.getErrorMessage(res)

      throw returnData
    })
    .finally(() => {
      if (showLoading) {
        wxTip.hideLoading()
      }
    })
}

export default send
