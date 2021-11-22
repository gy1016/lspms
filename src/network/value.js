import request from './request'

export function fetchValue (data) {
  return request({
    url: '/value/list',
    method: 'post',
    data
  })
}
