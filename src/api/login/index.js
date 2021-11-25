import request from '@/utils/request'

export function signupCheck(email) {
  return request({
    url: '/signup-check',
    method: 'put',
    params: { email }
  })
}
export function signup(data) {
  return request({
    url: '/signup',
    method: 'post',
    data: data
  })
}

export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

export function signIn(data) {
  return request({
    url: '/sign-in',
    method: 'post',
    data: data
  })
}

export function signOut() {
  return request({
    url: '/sign-out',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user-info',
    method: 'get'
  })
}
