import request from '../utils/request'

export function globalRuleGet() {
  return request({
    url: '/setting/ruleGet',
    method: 'post',
  });
}

export function globalRuleEdit(rules) {
  return request({
    url: '/setting/ruleEdit',
    method: 'post',
    data: rules
  });
}

export function typeList(params) {
  return request({
    url: '/type/list',
    method: 'post',
    data: params
  });
}
// type/detail
// 查看分类详情
export function typeDetail(params) {
  return request({
    url: '/type/detail',
    method: 'post',
    data: params
  });
}

export function typeEdit(params) {
  return request({
    url: '/type/edit',
    method: 'post',
    data: params
  });
}

export function types(params) {
  return request({
    url: '/type/types',
    method: 'post',
    data: params
  });
}

export function typeDel(params) {
  return request({
    url: '/type/del',
    method: 'post',
    data: params
  });
}

// vip/all
// VIP等级列表
export function vipAll(params) {
  return request({
    url: '/vip/all',
    method: 'post',
    data: params
  });
}

// vip/del  VIP等级删除
export function vipDel(params) {
  return request({
    url: '/vip/del',
    method: 'post',
    data: params
  });
}

// vip/detail  VIP等级详情
export function vipDetail(params) {
  return request({
    url: '/vip/detail',
    method: 'post',
    data: params
  });
}

// vip/edit VIP等级添加或编辑
export function vipEdit(params) {
  return request({
    url: '/vip/edit',
    method: 'post',
    data: params
  });
}

// cvrc/all
// 课程全局规则列表
export function cvrcAll(params) {
  return request({
    url: '/cvrc/all',
    method: 'post',
    data: params
  });
}

// cvrc/del
// 课程全局规则删除
export function cvrcDel(params) {
  return request({
    url: '/cvrc/del',
    method: 'post',
    data: params
  });
}

// cvrc/edit
// 课程全局规则添加或编辑
export function cvrcEdit(params) {
  return request({
    url: '/cvrc/edit',
    method: 'post',
    data: params
  });
}

// cvrc/detail
// 课程全局规则详情
export function cvrcDetail(params) {
  return request({
    url: '/cvrc/detail',
    method: 'post',
    data: params
  });
}

// wealth/rechargeCardList
// 充值卡列表
export function rechargeCardList(params) {
  return request({
    url: '/wealth/rechargeCardList',
    method: 'post',
    data: params
  });
}

// wealth/rechargeCardEdit
// 充值卡新建或编辑
export function rechargeCardEdit(params) {
  return request({
    url: '/wealth/rechargeCardEdit',
    method: 'post',
    data: params
  });
}

// wealth/rechargeCardDel
// 充值卡删除
export function rechargeCardDel(params) {
  return request({
    url: '/wealth/rechargeCardDel',
    method: 'post',
    data: params
  });
}

// gift/list
// 礼物列表
export function giftList(params) {
  return request({
    url: '/gift/list',
    method: 'post',
    data: params
  });
}

// gift/del
// 礼物删除
export function giftDel(params) {
  return request({
    url: '/gift/del',
    method: 'post',
    data: params
  });
}

// gift/edit
// 礼物添加或编辑
export function giftEdit(params) {
  return request({
    url: '/gift/edit',
    method: 'post',
    data: params
  });
}

// gift/detail
// 礼物详情
export function giftDetail(params) {
  return request({
    url: '/gift/detail',
    method: 'post',
    data: params
  });
}


// crc/list
// 优惠券奖励列表
export function crcList(params) {
  return request({
    url: '/crc/list',
    method: 'post',
    data: params
  });
}

// crc/del
// 优惠券奖励删除
export function crcDel(params) {
  return request({
    url: '/crc/del',
    method: 'post',
    data: params
  });
}

// crc/detail
// 优惠券奖励详情
export function crcDetail(params) {
  return request({
    url: '/crc/detail',
    method: 'post',
    data: params
  });
}

// crc/edit
// 优惠券奖励添加或编辑
export function crcEdit(params) {
  return request({
    url: '/crc/edit',
    method: 'post',
    data: params
  });
}

// role/allRoles
// 权限列表明细
export function allRoles(params) {
  return request({
    url: '/role/allRoles',
    method: 'post',
    data: params
  });
}
//
// role/detail
// 权限组详情
export function roleDetail(params) {
  return request({
    url: '/role/detail',
    method: 'post',
    data: params
  });
}
// role/edit
// 权限组添加或编辑
export function roleEdit(params) {
  return request({
    url: '/role/edit',
    method: 'post',
    data: params
  });
}

//
// role/groups
// 所有权限组列表
export function roleGroups(params) {
  return request({
    url: '/role/groups',
    method: 'post',
    data: params
  });
}
//role/del
// 权限组删除
export function roleDel(params) {
  return request({
    url: '/role/del',
    method: 'post',
    data: params
  });
}
//
// news/type
// 资讯类型详情(针对单条资讯查询，若没有编辑，data返回false)
export function newsType(params) {
  return request({
    url: '/news/type',
    method: 'post',
    data: params
  });
}
// news/detail
// 资讯详情
export function newsDetail(params) {
  return request({
    url: '/news/detail',
    method: 'post',
    data: params
  });
}
// setting/sysLogs
// 系统日志列表
export function settingSysLogs(params) {
  return request({
    url: '/setting/sysLogs',
    method: 'post',
    data: params
  });
}

// feedback/list
// 投诉建议列表
export function feedbackList(params) {
  return request({
    url: '/feedback/list',
    method: 'post',
    data: params
  });
}

// feedback/reply
// 投诉建议回复或标记处理
export function feedbackReply(params) {
  return request({
    url: '/feedback/reply',
    method: 'post',
    data: params
  });
}

// feedback/del
// 投诉建议删除
export function feedbackDel(params) {
  return request({
    url: '/feedback/del',
    method: 'post',
    data: params
  });
}

// tool/edit
// 辅助工具添加或编辑
export function toolEdit(params) {
  return request({
    url: '/tool/edit',
    method: 'post',
    data: params
  });
}

// tool/detail
// 辅助工具详情
export function toolDetail(params) {
  return request({
    url: '/tool/detail',
    method: 'post',
    data: params
  });
}

// /tool/list
// 辅助工具列表
export function toolList(params) {
  return request({
    url: '/tool/list',
    method: 'post',
    data: params
  });
}

// tool/top
// 工具置顶操作
export function toolTop(params) {
  return request({
    url: '/tool/top',
    method: 'post',
    data: params
  });
}

// tool/enable
// 工具禁用启用
export function toolEnable(params) {
  return request({
    url: '/tool/enable',
    method: 'post',
    data: params
  });
}

// tool/del
// 辅助工具删除
export function toolDel(params) {
  return request({
    url: '/tool/del',
    method: 'post',
    data: params
  });
}
// role/user
// 添加用户到权限组
export function roleUser(params) {
  return request({
    url: '/role/user',
    method: 'post',
    data: params
  });
}

// crm权限
export function getCrmRole(params) {
  return request({
    url: '/role/crmRoles',
    method: 'post',
    data: params
  });
}


// evaluate/type
// 评价设置详情
export function evaluateType(params) {
  return request({
    url: '/evaluate/type',
    method: 'post',
    data: params
  });
}
// evaluate/edit
// 修改评价文字
export function evaluateEdit(params) {
  return request({
    url: '/evaluate/edit',
    method: 'post',
    data: params
  });
}
// setting/ruleEdit
// 系统参数设置
export function settingRuleEdit(params) {
  return request({
    url: '/setting/ruleEdit',
    method: 'post',
    data: params
  });
}
// setting/ruleGet
// 系统参数获取
export function settingRuleGet(params) {
  return request({
    url: '/setting/ruleGet',
    method: 'post',
    data: params
  });
}
// app/versions
// 查询服务器app版本列表
export function appVersions(params) {
  return request({
    url: '/app/versions',
    method: 'post',
    data: params
  });
}

// app/version/add
// 添加App版本
export function appVersionAdd(params) {
  return request({
    url: '/app/version/add',
    method: 'post',
    data: params
  });
}

// app/version/del
// 删除App版本
export function appVersionDel(params) {
  return request({
    url: '/app/version/del',
    method: 'post',
    data: params
  });
}




