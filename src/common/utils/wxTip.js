/**
 * wxTip
 */

const trimContent = (content, replacer = '...', maxLength = 250) => {
  content = (typeof content === 'string') ? content : ('' + content)
  return content.length <= maxLength ? content : (content.substring(0, maxLength - 1) + replacer)
}

export default class WxTip {
  // constructor () {}

  /* region Toast */
  /**
   * Toast basic
   * @param title
   * @param [icon]
   * @param [image]
   * @param [duration]
   * @param [mask]
   */
  static toast (title, {icon = 'none', image, duration = 1e3, mask = true} = {}) {
    if (!title) {
      return
    }

    wx.showToast({
      title: '' + title,
      icon,
      image,
      duration,
      mask
    })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, duration)
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
   * @returns {Promise}
   */
  static success (title, duration = 1e3) {
    return WxTip.toast(title, {icon: 'success', duration})
  }

  /**
   * Toast info
   * @param title
   * @param duration
   * @returns {Promise}
   */
  static info (title, duration = 1e3) {
    return WxTip.toast(title, {icon: 'none', duration})
  }
  /* endregion Toast */

  /* region Loading */
  /**
   * Toast loading
   * @param title
   */
  static loading (title = '请稍候...') {
    return wx.showLoading({
      title: title,
      mask: true
    })
  }

  /**
   * Toast hideLoading
   * @returns {Promise}
   */
  static hideLoading () {
    return wx.hideLoading()
  }
  /* endregion Loading */

  /* region Modal */
  /**
   * Modal confirm
   * @param content
   * @param [title]
   * @param [confirmText]
   * @param [cancelText]
   * @param [confirmColor]
   * @param [cancelColor]
   * @returns {Promise}
   */
  static confirm (content, {
    title = '温馨提醒',
    confirmText = '确定',
    cancelText = '取消',
    confirmColor = '#222',
    cancelColor = '#A3A1A5'
  } = {}) {
    return new Promise((resolve, reject) => {
      return wx.showModal({
        title: title,
        content: trimContent(content),

        confirmText: trimContent(confirmText, ''),
        confirmColor: confirmColor,

        showCancel: true,
        cancelText: trimContent(cancelText),
        cancelColor: cancelColor,

        success (res) {
          if (res.confirm) {
            return resolve(true)
          } else if (res.cancel) {
            return reject(Boolean(false))
          }
        },
        fail: () => reject(Boolean(false))
      })
    })
  }

  /**
   * Modal alert
   * @param content
   * @param [title]
   * @param [confirmText]
   * @param [confirmColor]
   * @returns {Promise}
   */
  static alert (content, {
    title = '温馨提醒',
    confirmText = '确定',
    confirmColor = '#222'
  } = {}) {
    return new Promise((resolve, reject) => {
      if (!content) {
        return resolve()
      }

      return wx.showModal({
        title: '' + title,
        content: trimContent(content),

        confirmText: trimContent(confirmText),
        confirmColor: confirmColor,

        showCancel: false,

        success: () => resolve(),
        fail: () => resolve()
      })
    })
  }

  /**
   * Modal withdraw
   * @param {String} content
   * @returns {Promise}
   */
  static withdraw (content) {
    return WxTip.alert(content)
      .then(() => wx.navigateBack())
      .catch(() => wx.navigateBack())
  }
  /* endregion Modal */

  /* region Action */
  /**
   * Modal action list
   * @param {Object} options
   * @returns {Promise}
   */
  static showActionSheet = (options = {}) => {
    options = options || {}
    let actionList = options.actionList || []

    // let itemList = actionList.map((item) => item.text);

    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: actionList.map((item) => item.text),
        itemColor: options.itemColor || '#222',
        success(res) {
          let action = actionList[res.tapIndex || 0]

          if (typeof action.handler === 'function') {
            action.handler(res, action)
          }

          if (typeof options.success === 'function') {
            options.success(res, action)
          }

          res.action = action
          return resolve(res)
        },
        fail(res) {
          if (typeof options.fail === 'function') {
            options.fail(res)
          }
          return reject(res)
        },
        complete: options.complete
      })
    })
  }
  /* endregion Action */

  // External

  /**
   * Toast warn
   * @param {String} title
   * @param {Number} [duration]
   * @returns {Promise}
   */
  static warn (title, duration) {
    return WxTip.toast(title, {
      duration,
      image: '/static/assets/img/i/warn.png'
    })
  }
}
