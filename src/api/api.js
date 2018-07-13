import request, { requestSign } from '../common/utils/request'

export { requestSign }

export const HOST = 'http://192.168.2.150:8086'

export const API_HOST = `${HOST}/api`

const API = {
  // 登录
  login: (params, options = {}) => request(`${API_HOST}/api/passport/login`, params, options),

  // 支付
  getPayParams: (params, options = {}) => request(`${API_HOST}/Pay/GetPayRequestInfo`, params, options)
}

export default API
