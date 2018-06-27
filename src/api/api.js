import request, { sign } from '../common/utils/request'

export { sign }

export const API_HOST = 'http://192.168.2.150:9005'

const API = {
  // 登录
  login: (params, options = {}) => request(`${API_HOST}/api/passport/login`, params, options),

  // 支付
  getPayParams: (params, options = {}) => request(`${API_HOST}/Pay/GetPayRequestInfo`, params, options)
}

export default API
