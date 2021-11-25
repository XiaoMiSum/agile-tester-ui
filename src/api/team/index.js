import request from '@/utils/request'

export function getTeamOptions() {
  return request({
    url: '/team/options',
    method: 'get'
  })
}

export function getTeamList() {
  return request({
    url: '/team',
    method: 'get'
  })
}
