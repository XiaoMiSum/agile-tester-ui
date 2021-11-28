import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user',
    method: 'delete',
    params: { id }
  })
}

export function updateUserStatus(id, enabled) {
  return request({
    url: '/user/status',
    method: 'post',
    data: { id, enabled }
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'post',
    data
  })
}

export function resetPassword(id) {
  return request({
    url: '/user/' + id,
    method: 'post'
  })
}
