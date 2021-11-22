import request from './request'

export function fetchList (data) {
  return request({
    url: '/factor/list',
    method: 'post',
    data
  })
}

export function getCategory () {
  return request({
    url: '/factor/category',
    method: 'get'
  })
}

export function createFactor (data) {
  return request({
    url: '/factor/create',
    method: 'post',
    data
  })
}

export function updateFactor (data) {
  return request({
    url: '/factor/update',
    method: 'post',
    data
  })
}

// eslint-disable-next-line camelcase
export function deleteFactor (factor_id) {
  return request({
    url: '/factor/delete',
    method: 'get',
    params: { factor_id }
  })
}
