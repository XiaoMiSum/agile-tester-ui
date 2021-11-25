import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

export function updateUserStatus(id, enabled) {
  return request({
    url: '/user/status',
    method: 'post',
    data: {id, enabled}
  })
}
