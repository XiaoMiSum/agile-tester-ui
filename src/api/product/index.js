import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}

export function addProduct(data) {
  return request({
    url: '/product',
    method: 'put',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: '/product',
    method: 'delete',
    params: { id }
  })
}

export function updateProductStatus(id, enabled) {
  return request({
    url: '/product/status',
    method: 'post',
    data: { id, enabled }
  })
}
