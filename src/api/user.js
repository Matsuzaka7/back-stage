import request from '@/utils/request'

const host = process.env.VUE_APP_BASE_API
export function login(data) {
  return request({
    url:host+ '/admin/acl/index/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url:host+ '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url:host+ '/admin/acl/index/logout',
    method: 'post'
  })
}
