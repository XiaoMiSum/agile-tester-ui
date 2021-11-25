import request from '@/utils/request'

export function getTeamList() {
  return request({
    url: '/team',
    method: 'get'
  })
}
