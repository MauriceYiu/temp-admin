import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'user/list',
    method: 'post',
    data
  })
}

export function idList(data) {
  return request({
    url: 'user/id/list',
    method: 'post',
    data
  })
}

export function userMy(data) {
  return request({
    url: 'user/my',
    method: 'post',
    data
  })
}

// user/statistics
// 用户数据统计
export function userStatistics(data) {
  return request({
    url: 'user/statistics',
    method: 'post',
    data
  })
}

// /user/notes
// 用户笔记列表
export function userNotes(data) {
  return request({
    url: 'user/notes',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

// user/enable
// 用户启用或禁用
export function userEnable(data) {
  return request({
    url: 'user/enable',
    method: 'post',
    data
  })
}

// user/enable
// 员工服务启用或禁用
export function userAvailable(data) {
  return request({
    url: 'user/available',
    method: 'post',
    data
  })
}

// user/jobLeave
// 离职启用或禁用
export function userJobLeave(data) {
  return request({
    url: 'user/jobLeave',
    method: 'post',
    data
  })
}

// user/customerPools
// 客户池
export function userCustomerPools(data) {
  return request({
    url: 'user/customerPools',
    method: 'post',
    data
  })
}

export function loginInfo(data) {
  return request({
    url: 'user/loginInfo',
    method: 'post',
    data
  })
}

// user/pwdUpdate
// 更新密码
export function changePwd(data) {
  return request({
    url: 'user/pwdUpdate',
    method: 'post',
    data
  })
}

// user/detail
// 用户详情(编辑用)
export function userDetail(data) {
  return request({
    url: 'user/detail',
    method: 'post',
    data
  })
}

// salary/list
// 薪资列表
export function salaryList(data) {
  return request({
    url: 'salary/list',
    method: 'post',
    data
  })
}

// salary/edit
// 编辑用户薪资
export function salaryEdit(data) {
  return request({
    url: 'salary/edit',
    method: 'post',
    data
  })
}

// gift/gives
// 礼物赠送列表
export function giftGives(data) {
  return request({
    url: 'gift/gives',
    method: 'post',
    data
  })
}

export function vipUser(data) {
  return request({
    url: 'vip/user',
    method: 'post',
    data
  })
}

// user/edit
// 用户添加或编辑(后台管理员用)
export function userEdit(data) {
  return request({
    url: 'user/edit',
    method: 'post',
    data
  })
}

// role/edit
// 权限组添加或编辑
export function roleEdit(data) {
  return request({
    url: 'role/edit',
    method: 'post',
    data
  })
}

// role/groups
// 所有权限组列表
export function roleGroups(data) {
  return request({
    url: 'role/groups',
    method: 'post',
    data
  })
}

// user/staffs
// 所有的员工列表
export function userStaffs(data) {
  return request({
    url: 'user/staffs',
    method: 'post',
    data
  })
}

// friend/followed
//判断是否关注
export function friendFollowed(data) {
  return request({
    url: 'friend/followed',
    method: 'post',
    data
  })
}

// friend/follow
// 关注某用户
export function friendFollow(data) {
  return request({
    url: 'friend/follow',
    method: 'post',
    data
  })
}

// qa/questions
// 问题列表
export function qaQuestions(data) {
  return request({
    url: 'qa/questions',
    method: 'post',
    data
  })
}

//   fav/list
// 收藏列表
export function favList(data) {
  return request({
    url: 'fav/list',
    method: 'post',
    data
  })
}

// friend/follows
// 我关注的好友
export function friendFollows(data) {
  return request({
    url: 'friend/follows',
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

// wealth/flows
// 用户资产流水
export function wealthFlows(data) {
  return request({
    url: 'wealth/flows',
    method: 'post',
    data
  })
}

//
// activity/buys
// 线下活动报名列表
export function activityBuys(data) {
  return request({
    url: 'activity/buys',
    method: 'post',
    data
  })
}

// coupon/users
// 用户优惠券列表
export function couponUsers(data) {
  return request({
    url: 'coupon/users',
    method: 'post',
    data
  })
}

// salary/deal
// 薪资标记发放状态
export function salaryDeal(data) {
  return request({
    url: 'salary/deal',
    method: 'post',
    data
  })
}

// wealth/offlineRecharge
// 创建线下充值订单
export function wealthOfflineRecharge(data) {
  return request({
    url: 'wealth/offlineRecharge',
    method: 'post',
    data
  })
}

// friend/followMes
// 关注我的好友
export function friendFollowMes(data) {
  return request({
    url: 'friend/followMes',
    method: 'post',
    data
  })
}

// user/updateRoleInfo
// 更新角色信息
export function userUpdateRoleInfo(data) {
  return request({
    url: 'user/updateRoleInfo',
    method: 'post',
    data
  })
}

// user/teacher
// 老师用户详情
export function userTeacher(data) {
  return request({
    url: 'user/teacher',
    method: 'post',
    data
  })
}

// staff/customers/dynamics
// 客户动态（薪资或打赏明细）
export function staffCustomersDynamics(data) {
  return request({
    url: 'staff/customers/dynamics',
    method: 'post',
    data
  })
}

// staff/count
// 内容统计
export function staffCount(data) {
  return request({
    url: 'staff/count',
    method: 'post',
    data
  })
}

// chat/csEvaluates
// 客服评价列表
export function chatCsEvaluates(data) {
  return request({
    url: 'chat/csEvaluates',
    method: 'post',
    data
  })
}

// service/evaluates
// 客户评价列表
export function serviceEvaluates(data) {
  return request({
    url: 'service/evaluates',
    method: 'post',
    data
  })
}

// service/requireAfterSale
// 售后同意
export function serviceRequireAfterSale(data) {
  return request({
    url: 'service/requireAfterSale',
    method: 'post',
    data
  })
}

// service/acceptAfterSale
// 售后同意
export function serviceAcceptAfterSale(data) {
  return request({
    url: 'service/acceptAfterSale',
    method: 'post',
    data
  })
}

// service/rejectAfterSale
// 售后拒绝
export function serviceRejectAfterSale(data) {
  return request({
    url: 'service/rejectAfterSale',
    method: 'post',
    data
  })
}

// service/buyDetail
// 服务订单详情
export function serviceBuyDetail(data) {
  return request({
    url: 'service/buyDetail',
    method: 'post',
    data
  })
}

// chat/historyMessages
// 历史消息记录，每次最多返回100条
export function chatHistoryMessages(data) {
  return request({
    url: 'chat/historyMessages',
    method: 'post',
    data
  })
}

// chat/afterSale
// 售后标记
export function chatAfterSale(data) {
  return request({
    url: 'chat/afterSale',
    method: 'post',
    data
  })
}

// staff/customers/dynamics
// 客户动态（薪资或打赏明细）
export function staffDynamics(data) {
  return request({
    url: 'staff/customers/dynamics',
    method: 'post',
    data
  })
}

// user/pwdReset
// 重置密码
export function pwdReset(data) {
  return request({
    url: 'user/pwdReset',
    method: 'post',
    data
  })
}
