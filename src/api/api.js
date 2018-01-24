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

// 根据id查询用户信息

export const selectWithId = (params) => {
  return axios.get('users/' + params).then(res => {
    return res.data
  })
}

// 编辑用户提交

export const updataUser = (params) => {
  return axios.put('users/' + params.id, params).then(res => {
    return res.data
  })
}

// 删除单个用户

export const deleteSingle = (params) => {
  return axios.delete('users/' + params).then(res => {
    return res.data
  })
}

// 权限 请求用户列表
export const rightUserList = () => {
  return axios.get('roles').then(res => {
    return res.data
  })
}

// 添加用户

export const addRightUser = (params) => {
  return axios.post('roles', params).then(res => {
    return res.data
  })
}

// 删除角色单挑权限

export const deleteSingleRight = (params) => {
  return axios.delete('roles/' + params.roleId + '/rights/' + params.rightId).then(res => {
    return res.data
  })
}

// 获取所有权限

export const allRights = (params) => {
  return axios.get('rights/' + params.type).then(res => {
    return res.data
  })
}

// 角色授权

export const giveRights = (params) => {
  return axios.post('roles/' + params.roleId + '/rights', {rids: params.rids}).then(res => {
    return res.data
  })
}
