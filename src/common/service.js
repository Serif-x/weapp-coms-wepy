import API from '../api/api'
import wxTip from './utils/wxTip'
import wxAPI from './utils/wxAPI'
import error from './utils/error'

const getPaymentErrorMsg = (errMsg) => {
  if (errMsg === 'requestPayment:fail cancel') {
    return '取消支付'
  }
  if (/^requestPayment:fail/.test(errMsg)) {
    return errMsg.split(/^requestPayment:fail\s*/)[1]
  }
  return errMsg
}

const getUserInfo = (function () {
  let userInfo = null

  return async function (outUserInfo) {
    if (outUserInfo) {
      userInfo = outUserInfo
      return userInfo
    }

    if (userInfo) {
      return userInfo
    }

    userInfo = await wxAPI.getUserInfo()
      .then(res => res.userInfo)
      .catch(() => null)

    console.info('On Wx getUserInfo: %o', userInfo)

    return userInfo
  }
}())

const getAccountInfo = (function () {
  let accountInfo = null

  return async function (userInfo) {
    if (accountInfo) {
      return accountInfo
    }

    const _loginRes = await wxAPI.login().catch(() => null)

    if (!_loginRes) {
      return null
    }

    console.info('On Wx login: %o', _loginRes)
    const { code } = _loginRes

    if (!userInfo) {
      userInfo = await getUserInfo().catch(() => null)
    }

    accountInfo = await API.login({ code, userInfo })
      .then(res => res.data)
      .catch(() => null)

    return accountInfo
  }
}())

export default class Service {
  static wechatPay (params) {
    wxTip.loading('等待支付...')

    return API.getPayParams(params, {showLoading: false})
      .then((res) => {
        wxTip.hideLoading()
        const payParams = res.data
        return wxAPI.requestPayment(payParams)
          .then(() => (void 0))
          .catch((res) => {
            console.warn(`Pay error: %o`, res)

            if (!res.msg) {
              res.msg = getPaymentErrorMsg(error.getErrorMessage(res))
            }

            throw res
          })
      })
      .catch((res) => {
        wxTip.hideLoading()
        return res
      })
  }

  static getUserInfo = getUserInfo

  static getAccountInfo = getAccountInfo
}
