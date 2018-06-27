/**
 * Toast
 */

const _trimContent = (content, maxLength = 250) => {
  content = (typeof content === 'string') ? content : ('' + content)
  return content.length <= maxLength ? content : (content.substring(0, maxLength - 1) + '...')
}

export default class WxTip {
  // constructor () {}

  /**
   * Toast basic
   * @param title
   * @param icon
   * @param duration
   */
  static toast (title, {icon = 'success', duration = 1500} = {}) {
    if (!title) {
      return
    }

    wx.showToast({
      title: '' + title,
      icon: 'success',
      mask: true,
      duration: duration
    })
  }

  /**
   * Toast hide
   * @returns {*}
   */
  static hideToast () {
    return wx.hideToast()
  }

  /**
   * Toast success
   * @param title
   * @param duration
   * @returns {Promise<any>}
   */
  static success (title, duration = 1500) {
    WxTip.toast(title, {duration})

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, ~~duration)
    })
  }

  /**
   * Toast loading
   * @param title
   */
  static loading (title = '加载中') {
    return wx.showLoading({
      title: title,
      mask: true
    })
  }

  /**
   * Toast hideLoading
   * @param [title]
   * @returns {Promise<any>}
   */
  static hideLoading () {
    return wx.hideLoading()
  }

  /**
   * Modal confirm
   * @param content
   * @param [title]
   * @param [confirmText]
   * @param [cancelText]
   * @returns {Promise<any>}
   */
  static confirm (content, {title = '提示', confirmText = '确定', cancelText = '取消'} = {}) {
    return new Promise((resolve, reject) => {
      return wx.showModal({
        title: title,
        content: _trimContent(content),

        confirmText: confirmText,
        confirmColor: '#8F73F7',

        showCancel: true,
        cancelText: cancelText,
        cancelColor: '#A3A1A5',

        success (res) {
          if (res.confirm) {
            return resolve()
          } else if (res.cancel) {
            return reject(res)
          }
        },
        fail: reject
      })
    })
  }

  /**
   * Modal alert
   * @param content
   * @param [title]
   * @param [confirmText]
   * @returns {Promise<any>}
   */
  static alert (content, {title = '提示', confirmText = '确定'} = {}) {
    return new Promise((resolve, reject) => {
      if (!content) {
        return resolve()
      }

      return wx.showModal({
        title: '' + title,
        content: _trimContent(content),

        confirmText: confirmText,
        confirmColor: '#8F73F7',

        showCancel: false,
        cancelColor: '#A3A1A5',

        success: resolve,
        fail: resolve
      })
    })
  }

  /**
   * Modal withdraw
   * @param {String} content
   * @returns {Promise<any>}
   */
  static withdraw (content) {
    return WxTip.alert(content)
      .then(() => wx.navigateBack())
      .catch(() => wx.navigateBack())
  }
}
