import request from '@/utils/request'

export function getTeamList(params) {
  return request({
    url: '/team',
    method: 'get',
    params
  })
}

export function addTeam(data) {
  return request({
    url: '/team',
    method: 'put',
    data
  })
}

export function updateTeam(data) {
  return request({
    url: '/team',
    method: 'post',
    data
  })
}

export function deleteTeam(id) {
  return request({
    url: '/team',
    method: 'delete',
    params: { id }
  })
}
