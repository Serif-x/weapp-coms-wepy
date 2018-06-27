/*!
 * Error
 */

const STATUS = {
  0: '网络异常，请检查网络',
  400: '错误的请求',
  403: '您的访问被拒绝',
  404: '该内容不存在',
  405: '暂无权限访问',
  408: '请求超时',
  500: '服务器未知异常',
  503: '服务器繁忙，请稍后重试',
  parseerror: '服务器返回数据异常，请联系管理员'
}

export default class Error {
  static getResponseStatusDesc (statusCode) {
    return statusCode ? (STATUS[statusCode] || '') : '状态异常，请检查网络'
  }

  static getErrorMessage (errorObj) {
    if (errorObj) {
      return errorObj.msg || errorObj.message || errorObj.errMsg || ('' + errorObj)
    }
    return 'fail'
  }
}
