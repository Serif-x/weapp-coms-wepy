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
}
