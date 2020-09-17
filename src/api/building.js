import request from '@/utils/request'

//楼盘列表
export function list(data) {
  return request({
    url: 'building/list',
    method: 'post',
    data
  })
}

//楼盘详情
export function detail(data) {
  return request({
    url: 'building/detail',
    method: 'post',
    data
  })
}
//楼盘添加或编辑
export function edit(data) {
  return request({
    url: 'building/edit',
    method: 'post',
    data
  })
}
//更新楼盘相册
export function updateAlbums(data) {
  return request({
    url: 'building/updateAlbums',
    method: 'post',
    data
  })
}

//楼盘审核
export function check(data) {
  return request({
    url: '/building/check',
    method: 'post',
    data
  })
}
//看房预定列表
export function preordains(data) {
  return request({
    url: '/building/preordains',
    method: 'post',
    data
  })
}
//看房预定标记处理
export function preordainHandle(data) {
  return request({
    url: '/building/preordainHandle',
    method: 'post',
    data
  })
}


