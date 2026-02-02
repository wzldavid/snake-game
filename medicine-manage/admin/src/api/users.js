import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(params) {
  return request({
    url: '/cloudapi/getUsers',
    method: 'get',
    params
  })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id) {
  return request({
    url: '/cloudapi/getUserDetail',
    method: 'get',
    params: { id }
  })
}
