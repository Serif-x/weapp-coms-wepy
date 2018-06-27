import wepy from 'wepy'

const SIGN = 'SERIFX' // TODO: Encrypt sign or use server token

const API_CODE_SUCCESS = 1000

export default async (url, params = {}) => {
  const returnData = {
    statusCode: 0,
    code: null,
    data: null,
    msg: '请求异常'
  }

  let _reqId = 'req_' + Date.now()
  console.log('==> Req data [%s]: %o', _reqId, params)
  return wepy.request({
    url: url,
    method: params.method || 'GET',
    data: params,
    header: {
      'Content-Type': 'application/json',
      'token': SIGN
    }
  })
    .then((res) => {
      console.log('==> Res success [%s]: %o', _reqId, res)

      returnData.statusCode = res.statusCode
      returnData.msg = res.errMsg

      if (res.statusCode === 200) {
        const resData = res.data || {}

        // Map properties from server
        returnData.code = resData.code
        returnData.data = resData.data
        returnData.msg = resData.msg

        if (resData.code === API_CODE_SUCCESS) {
          return returnData
        }

        throw returnData
      }

      throw returnData
    })
    .catch((res) => {
      console.warn('==> Res fail [%s]: %o', _reqId, res)
      returnData.statusCode = res.statusCode
      returnData.code = res.code
      returnData.data = res.data
      returnData.msg = res.msg || res.errMsg

      throw returnData
    })
    // .finally(() => {
    //
    // })
}
