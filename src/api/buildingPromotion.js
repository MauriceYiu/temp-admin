import request from '@/utils/request'

//楼盘活动列表
export function list(data) {
  return request({
    url: 'buildPromotion/list',
    method: 'post',
    data
  })
}

//楼盘活动添加或编辑
export function edit(data) {
  return request({
    url: 'buildPromotion/edit',
    method: 'post',
    data
  })
}

//楼盘活动删除
export function del(data) {
  return request({
    url: 'buildPromotion/del',
    method: 'post',
    data
  })
}

//楼盘活动详情
export function detail(data) {
  return request({
    url: 'buildPromotion/detail',
    method: 'post',
    data
  })
}


//楼盘审核
export function check(data) {
  return request({
    url: 'buildPromotion/check',
    method: 'post',
    data
  })
}
