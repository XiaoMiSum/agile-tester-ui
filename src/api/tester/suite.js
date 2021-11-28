import request from '@/utils/request'

export function getSuiteList(params) {
  return request({
    url: '/testsuite',
    method: 'get',
    params
  })
}

export function updateSuite(data) {
  return request({
    url: '/testsuite',
    method: 'post',
    data
  })
}
