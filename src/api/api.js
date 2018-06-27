import request from '../common/utils/request'

const API_HOST = 'http://192.168.2.150:9005'

/**
 * APIs
 */
const API = {
  login: (params) => request(`${API_HOST}/api/passport/login`, params)
}

export default API
