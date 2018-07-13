import wepy from 'wepy'
import utils from './utils'
import wxTip from './wxTip'

const promisify = (nativeAPI) => (options) => (
  new Promise((resolve, reject) => {
    const opts = Object.assign({}, options || {})

    const _success = opts.success
    const _fail = opts.fail

    delete opts.success
    delete opts.fail

    if (typeof nativeAPI !== 'function') {
      return reject(Object.create(null, { errMsg: { value: 'Not a function' } }))
    }

    nativeAPI({
      ...opts,
      success (res) {
        _success && _success(res)
        resolve(res)
      },
      fail (res) {
        _fail && _fail(res)
        reject(res)
      }
    })
  })
)

export default class WxAPI {
  /* region APP/页面 */
  static getPageUrl (page) {
    const query = utils.serialize(page.options)
    return page.route + (query ? ('?' + query) : '')
  }

  static getPage ($com) {
    if (!$com) {
      return null
    }
    if ($com instanceof wepy.page) {
      return $com
    }
    return WxAPI.getPage($com.$parent)
  }

  static getApp ($com) {
    const $page = WxAPI.getPage($com)

    if (!$page) {
      return null
    }

    return $page.$parent
  }
  /* endregion APP/页面 */

  /* region 设备 */
  static getNetworkType () {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success (res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          resolve(res.networkType)
        },
        fail: reject
      })
    })
  }

  static getSystemInfo () {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success (res) {
          delete res.errMsg
          return resolve(res)
        },
        fail: reject
      })
    })
  }
  /* endregion 设备 */

  /* region 文件 */
  static downloadFile (url, header) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        header,
        success (res) {
          if (res.statusCode !== 200) {
            return reject(res)
          }

          resolve(res.tempFilePath)
        },
        fail: reject
      })
    })
  }

  static saveFile (tempPath) {
    return new Promise((resolve, reject) => {
      wx.saveFile({
        tempFilePath: tempPath,
        success (res) {
          resolve(res.savedFilePath)
        },
        fail: reject
      })
    })
  }

  static saveImageToAlbum (savedPath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: savedPath,
        success () {
          resolve({
            filePath: savedPath
          })
        },
        fail: reject
      })
    })
  }
  /* endregion 文件 */

  /* region 媒体 */
  static createAudio (options = {}) {
    const opt = Object.assign({}, options || {})

    if (!wx.canIUse('createInnerAudioContext')) {
      console.warn('CreateInnerAudioContext is not supported')
      return null
    }

    const iac = wx.createInnerAudioContext()

    // Props
    iac.src = opt.src
    iac.startTime = opt.startTime || 0 // s
    iac.autoplay = opt.autoplay || false
    iac.loop = opt.loop || false
    iac.obeyMuteSwitch = opt.obeyMuteSwitch || true

    if (wx.canIUse('innerAudioContext.volume')) {
      iac.volume = opt.volume || 0.8 // 0~1
    }

    // Events
    iac.onPlay(() => {
      console.info('Audio start playing...')
    })
    iac.onStop(() => {
      console.info('Audio stopped')
    })
    iac.onEnded(() => {
      console.info('Audio ended')
    })
    iac.onError((res) => {
      console.warn(`Audio error: %o`, res)
    })

    return iac
  }
  /* endregion 媒体 */

  /* region 转发 */
  static getShareInfo (shareTicket) {
    return new Promise((resolve, reject) => {
      wx.getShareInfo({
        shareTicket,
        success (res) {
          const { iv, encryptedData } = res || {}
          resolve({ iv, encryptedData })
        },
        fail: reject
      })
    })
  }
  /* endregion 转发 */

  /* region WXML节点 */
  static querySelectFields (selector, fields = {}) {
    const query = wx.createSelectorQuery()

    return new Promise((resolve, reject) => {
      query.select(selector).fields(fields, (rect) => {
        resolve(rect)
      }).exec()
    })
  }
  /* endregion 组件 */

  /* region 开放接口 */
  static checkSession () {
    return new Promise((resolve) => {
      wx.checkSession({
        success () {
          resolve(true)
        },
        fail () {
          resolve(false)
        }
      })
    })
  }

  static login = promisify(wx.login)

  static getUserInfo = promisify(wx.getUserInfo)

  static requestPayment (options = {}) {
    return new Promise((resolve, reject) => {
      let isPaySuccess = false

      wxTip.loading('正在支付...')
      return wx.requestPayment({
        timeStamp: options.timeStamp,
        nonceStr: options.nonceStr,
        package: options.package,
        signType: options.signType || 'MD5',
        paySign: options.paySign,
        success (res) {
          isPaySuccess = true

          options.success && options.success(res)
          return resolve()
        },
        fail (res) {
          // options.failed && options.failed(res);
          // return reject(res);
        },
        complete (res) {
          wxTip.hideLoading()

          if (!isPaySuccess) {
            options.failed && options.failed(res)
            options.complete && options.complete(res)
            return reject(res)
          } else {
            options.complete && options.complete(res)
          }
        }
      })
    })
  }
  /* endregion 开放接口 */
}
