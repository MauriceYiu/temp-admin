import request from '../utils/request'


// coupon/list
// 优惠券列表
export function couponList(params) {
  return request({
    url: '/coupon/list',
    method: 'post',
    data: params
  });
}
// coupon/detail
// 优惠券详情
export function couponDetail(params) {
  return request({
    url: '/coupon/detail',
    method: 'post',
    data: params
  });
}
// coupon/edit
// 优惠券添加或编辑
export function couponEdit(params) {
  return request({
    url: '/coupon/edit',
    method: 'post',
    data: params
  });
}
// coupon/del
// 优惠券删除
export function couponDel(params) {
  return request({
    url: '/coupon/del',
    method: 'post',
    data: params
  });
}

// coupon/enable
// 优惠券禁用启用
export function courseEnable(params) {
  return request({
    url: '/coupon/enable',
    method: 'post',
    data: params
  });
}

// cgc/list
// 优惠券发送列表
export function cgcList(params) {
  return request({
    url: '/cgc/list',
    method: 'post',
    data: params
  });
}

// cgc/detail
// 优惠券发送详情
export function cgcDetail(params) {
  return request({
    url: '/cgc/detail',
    method: 'post',
    data: params
  });
}

// 优惠券发送删除
export function cgcDel(params) {
  return request({
    url: '/cgc/del',
    method: 'post',
    data: params
  });
}

// coupon/all
// 所有优惠券列表
export function couponAll(params) {
  return request({
    url: '/coupon/all',
    method: 'post',
    data: params
  });
}

// cgc/add
// 添加优惠券发送列表
export function cgcAdd(params) {
  return request({
    url: '/cgc/add',
    method: 'post',
    data: params
  });
}
