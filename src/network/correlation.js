import request from './request'

export function fetchList (data) {
  return request({
    url: '/correlation/list',
    method: 'post',
    data
  })
}

export function fetchTimeList () {
  return request({
    url: '/correlation/timelist',
    method: 'get'
  })
}
