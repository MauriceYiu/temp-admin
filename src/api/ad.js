import request from '../utils/request'


//
// 广告列表ad/all
export function adList(params) {
  return request({
    url: '/ad/all',
    method: 'post',
    data: params
  });
}
// ad/detail
// 广告详情
export function adDetail(params) {
  return request({
    url: '/ad/detail',
    method: 'post',
    data: params
  });
}
// ad/edit
// 广告添加或编辑
export function adEdit(params) {
  return request({
    url: '/ad/edit',
    method: 'post',
    data: params
  });
}
// ad/del
// 广告删除
export function adDel(params) {
  return request({
    url: '/ad/del',
    method: 'post',
    data: params
  });
}
// ad/enable
// 广告禁用启用
export function adEnable(params) {
  return request({
    url: '/ad/enable',
    method: 'post',
    data: params
  });
}

// nbgc/edit
// 公告背景添加或编辑
export function nbgcEdit(params) {
  return request({
    url: '/nbgc/edit',
    method: 'post',
    data: params
  });
}

// nbgc/detail
// 公告背景详情
export function nbgcDetail(params) {
  return request({
    url: '/nbgc/detail',
    method: 'post',
    data: params
  });
}
// nbgc/all
// 公告背景列表
export function nbgcAll(params) {
  return request({
    url: '/nbgc/all',
    method: 'post',
    data: params
  });
}
// /nbgc/del
// 公告背景删除
export function nbgcDel(params) {
  return request({
    url: '/nbgc/del',
    method: 'post',
    data: params
  });
}
// 1/nbgc/enable
// 公告背景禁用启用
export function nbgcEnable(params) {
  return request({
    url: '/nbgc/enable',
    method: 'post',
    data: params
  });
}

// /api/v1/menu/list
// 菜单列表
export function menuList(params) {
  return request({
    url: '/menu/list',
    method: 'post',
    data: params
  });
}

// menu/edit
// 菜单添加或编辑
export function menuEdit(params) {
  return request({
    url: '/menu/edit',
    method: 'post',
    data: params
  });
}

// menu/detail
// 菜单详情
export function menuDetail(params) {
  return request({
    url: '/menu/detail',
    method: 'post',
    data: params
  });
}

// menu/del
// 菜单删除
export function menuDel(params) {
  return request({
    url: '/menu/del',
    method: 'post',
    data: params
  });
}
//
// /menu/enable
// 菜单禁用启用
export function menuEnable(params) {
  return request({
    url: '/menu/enable',
    method: 'post',
    data: params
  });
}
