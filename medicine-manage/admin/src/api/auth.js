import request from '@/utils/request'

/**
 * 管理员登录
 */
export function login(data) {
  return request({
    url: '/cloudapi/login',
    method: 'post',
    data
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/cloudapi/logout',
    method: 'post'
  })
}
