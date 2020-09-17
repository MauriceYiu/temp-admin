import request from '@/utils/request'

//银行活动列表
export function list(data) {
  return request({
    url: 'promotion/list',
    method: 'post',
    data
  })
}

//银行活动添加或编辑
export function edit(data) {
  return request({
    url: 'promotion/edit',
    method: 'post',
    data
  })
}

//银行活动删除
export function del(data) {
  return request({
    url: 'promotion/del',
    method: 'post',
    data
  })
}

//银行活动详情
export function detail(data) {
  return request({
    url: 'promotion/detail',
    method: 'post',
    data
  })
}


