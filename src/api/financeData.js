import request from '@/utils/request'

// wealth/rechargeCardOrders
// 充值卡订单列表

export function wealthRechargeCardOrders(data) {
  return request({
    url: 'wealth/rechargeCardOrders',
    method: 'post',
    data
  })
}

// course/buys
// 课程购买列表
export function courseBuys(data) {
  return request({
    url: 'course/buys',
    method: 'post',
    data
  })
}

// service/buys
// 业务购买列表
export function serviceBuys(data) {
  return request({
    url: 'service/buys',
    method: 'post',
    data
  })
}

// service/abort
// 业务购买列表
export function serviceAbort(data) {
  return request({
    url: 'service/abort',
    method: 'post',
    data
  })
}

// service/orderStatusChange
// 更改订单状态
export function orderStatusChange(data) {
  return request({
    url: 'service/orderStatusChange',
    method: 'post',
    data
  })
}

// /live/buys
// 直播购买列表
export function liveBuys(data) {
  return request({
    url: 'live/buys',
    method: 'post',
    data
  })
}

// activity/buys
// 线下活动报名列表
export function activityBuys(data) {
  return request({
    url: 'activity/buys',
    method: 'post',
    data
  })
}
