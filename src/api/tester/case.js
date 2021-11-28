import request from '@/utils/request'

export function getTestcase(params) {
  return request({
    url: '/testcase',
    method: 'get',
    params
  })
}

export function addTestcase(data) {
  return request({
    url: '/testcase',
    method: 'put',
    data
  })
}

export function updateTestcase(data) {
  return request({
    url: '/testcase',
    method: 'post',
    data
  })
}
