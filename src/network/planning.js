import request from './request'

export function fetchPlanning () {
  return request({
    url: '/planning/list',
    method: 'get'
  })
}
