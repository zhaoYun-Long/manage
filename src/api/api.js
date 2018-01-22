import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  let token = localStorage.getItem('long')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

export const login = (params) => {
  return axios.post('login', params).then(res => {
    return res.data
  })
}

// 请求用户信息

export const userInfo = (params) => {
  return axios.get('users', {params: params}).then(res => {
    return res.data
  })
}

// 改变用户状态
export const toggleUserState = (params) => {
  return axios.put('users/' + params.uId + '/state/' + params.state).then(res => {
    return res.data
  })
}

// 添加用户

export const addUser = (params) => {
  return axios.post('users', params).then(res => {
    return res.data
  })
}
