import request from '../utils/request'
// course/list
// 课程列表
export function courseList(params) {
  return request({
    url: '/course/list',
    method: 'post',
    data: params
  });
}

// course/edit
// 课程添加或编辑
export function courseEdit(params) {
  return request({
    url: '/course/edit',
    method: 'post',
    data: params
  });
}

// course/del
// 课程删除
export function courseDel(params) {
  return request({
    url: '/course/del',
    method: 'post',
    data: params
  });
}

// course/detail
// 课程详情
export function courseDetail(params) {
  return request({
    url: '/course/detail',
    method: 'post',
    data: params
  });
}

// course/enable
// 课程禁用启用
export function courseEnable(params) {
  return request({
    url: '/course/enable',
    method: 'post',
    data: params
  });
}

// course/check
// 课程审核
export function courseCheck(params) {
  return request({
    url: '/course/check',
    method: 'post',
    data: params
  });
}


// push/list
// 推送消息列表
export function pushList(params) {
  return request({
    url: '/push/list',
    method: 'post',
    data: params
  });
}

// push/edit
// 推送消息添加或编辑
export function pushEdit(params) {
  return request({
    url: '/push/edit',
    method: 'post',
    data: params
  });
}

// push/del
// 推送消息删除
export function pushDel(params) {
  return request({
    url: '/push/del',
    method: 'post',
    data: params
  });
}

// push/detail
// 推送消息详情
export function pushDetail(params) {
  return request({
    url: '/push/detail',
    method: 'post',
    data: params
  });
}

// live/list
// 直播列表
export function liveList(params) {
  return request({
    url: '/live/list',
    method: 'post',
    data: params
  });
}

// live/edit
// 直播添加或编辑
export function liveEdit(params) {
  return request({
    url: '/live/edit',
    method: 'post',
    data: params
  });
}

// live/del
// 直播删除
export function liveDel(params) {
  return request({
    url: '/live/del',
    method: 'post',
    data: params
  });
}

// live/detail
// 直播详情
export function liveDetail(params) {
  return request({
    url: '/live/detail',
    method: 'post',
    data: params
  });
}

// live/check
// 直播审核
export function liveCheck(params) {
  return request({
    url: '/live/check',
    method: 'post',
    data: params
  });
}

// live/dating
// 直播预约切换
export function liveDating(params) {
  return request({
    url: '/live/dating',
    method: 'post',
    data: params
  });
}

// live/finish
// 直播开始
export function liveStart(params) {
  return request({
    url: '/live/start',
    method: 'post',
    data: params
  });
}

// live/finished
// 直播结束
export function liveFinished(params) {
  return request({
    url: '/live/finished',
    method: 'post',
    data: params
  });
}

// activity/list
// 线下活动列表
export function activityList(params) {
  return request({
    url: '/activity/list',
    method: 'post',
    data: params
  });
}

// activity/edit
// 线下活动添加或编辑
export function activityEdit(params) {
  return request({
    url: '/activity/edit',
    method: 'post',
    data: params
  });
}

// activity/del
// 线下活动删除
export function activityDel(params) {
  return request({
    url: '/activity/del',
    method: 'post',
    data: params
  });
}

// activity/cancel
// 线下活动取消
export function activityCancel(params) {
  return request({
    url: '/activity/cancel',
    method: 'post',
    data: params
  });
}

// activity/detail
// 线下活动详情
export function activityDetail(params) {
  return request({
    url: '/activity/detail',
    method: 'post',
    data: params
  });
}

// activity/check
// 线下活动审核
export function activityCheck(params) {
  return request({
    url: '/activity/check',
    method: 'post',
    data: params
  });
}

// dynamic/list
// 动态列表
export function dynamicList(params) {
  return request({
    url: '/dynamic/list',
    method: 'post',
    data: params
  });
}

// /dynamic/edit
// 动态添加或编辑
export function dynamicEdit(params) {
  return request({
    url: '/dynamic/edit',
    method: 'post',
    data: params
  });
}

// dynamic/del
// 动态删除
export function dynamicDel(params) {
  return request({
    url: '/dynamic/del',
    method: 'post',
    data: params
  });
}

// dynamic/enable
// 动态禁用启用
export function dynamicEnable(params) {
  return request({
    url: '/dynamic/enable',
    method: 'post',
    data: params
  });
}

// dynamic/detail
// 动态详情
export function dynamicDetail(params) {
  return request({
    url: '/dynamic/detail',
    method: 'post',
    data: params
  });
}

// dynamic/check
// 动态审核
export function dynamicCheck(params) {
  return request({
    url: '/dynamic/check',
    method: 'post',
    data: params
  });
}

// qa/questions
// 问题列表
export function questions(params) {
  return request({
    url: '/qa/questions',
    method: 'post',
    data: params
  });
}

// qa/answers
// 问题回答列表
export function qaAnswers(params) {
  return request({
    url: '/qa/answers',
    method: 'post',
    data: params
  });
}

// qa/questionEdit
// 问题添加或编辑
export function questionEdit(params) {
  return request({
    url: '/qa/questionEdit',
    method: 'post',
    data: params
  });
}

// /api/v1/qa/question
// 问题详情
export function questionDetail(params) {
  return request({
    url: '/qa/question',
    method: 'post',
    data: params
  });
}

// /api/v1/qa/del
// 问题删除
export function questionDel(params) {
  return request({
    url: '/qa/questionDel',
    method: 'post',
    data: params
  });
}

// qa/answerDel
// 答案删除
export function qaAnswerDel(params) {
  return request({
    url: '/qa/answerDel',
    method: 'post',
    data: params
  });
}

// qa/answerReplyDel
// 答案回复删除
export function qaAnswerReplyDel(params) {
  return request({
    url: '/qa/answerReplyDel',
    method: 'post',
    data: params
  });
}

// qa/answerReply
// 答案回复
export function qaAnswerReply(params) {
  return request({
    url: '/qa/answerReply',
    method: 'post',
    data: params
  });
}

// /api/v1/qa/answers
// 问题回答列表
export function answersList(params) {
  return request({
    url: '/qa/answers',
    method: 'post',
    data: params
  });
}

// qa/questionCheck
// 问题审核
export function questionCheck(params) {
  return request({
    url: '/qa/questionCheck',
    method: 'post',
    data: params
  });
}

// qa/dynamics
// 提问动态
export function qaDynamics(params) {
  return request({
    url: '/qa/dynamics',
    method: 'post',
    data: params
  });
}


export function qaAwesome(params) {
  return request({
    url: 'qa/awesome',
    method: 'post',
    data: params
  });
}

// dynamic/awesome
// 动态点赞
export function dynamicAwesome(params) {
  return request({
    url: 'dynamic/awesome',
    method: 'post',
    data: params
  });
}

// atc/edit
// 嘉宾添加或编辑
export function atcEdit(params) {
  return request({
    url: 'atc/edit',
    method: 'post',
    data: params
  });
}


// atc/detail
// 嘉宾详情
export function atcDetail(params) {
  return request({
    url: 'atc/detail',
    method: 'post',
    data: params
  });
}

// /atc/all
// 嘉宾列表
export function atcAll(params) {
  return request({
    url: 'atc/all',
    method: 'post',
    data: params
  });
}

// atc/enable
// 嘉宾禁用启用
export function atcEnable(params) {
  return request({
    url: 'atc/enable',
    method: 'post',
    data: params
  });
}
// atc/del
// 嘉宾删除
export function atcDel(params) {
  return request({
    url: 'atc/del',
    method: 'post',
    data: params
  });
}

// activity/dating
// 预约开启
export function activityDating(params) {
  return request({
    url: 'activity/dating',
    method: 'post',
    data: params
  });
}


// activity/buys
// 线下活动报名列表
export function activityBuys(params) {
  return request({
    url: 'activity/buys',
    method: 'post',
    data: params
  });
}


// wcc/list
// 工作圈列表
export function wccList(params) {
  return request({
    url: 'wcc/list',
    method: 'post',
    data: params
  });
}

// wcc/del
// 工作圈删除
export function wccDel(params) {
  return request({
    url: 'wcc/del',
    method: 'post',
    data: params
  });
}

// wcc/detail
// 工作圈详情
export function wccDetail(params) {
  return request({
    url: 'wcc/detail',
    method: 'post',
    data: params
  });
}

// wcc/awesome
// 工作圈点赞
export function wccAwesome(params) {
  return request({
    url: 'wcc/awesome',
    method: 'post',
    data: params
  });
}

// wcc/reply
// 工作圈回复
export function wccReply(params) {
  return request({
    url: 'wcc/reply',
    method: 'post',
    data: params
  });
}

// wcc/edit
// 工作圈添加或编辑
export function wccEdit(params) {
  return request({
    url: 'wcc/edit',
    method: 'post',
    data: params
  });
}

// wcc/enable
// 工作圈置顶禁用启用
export function wccEnable(params) {
  return request({
    url: 'wcc/enable',
    method: 'post',
    data: params
  });
}
// wcc/dynamics
// 工作圈动态
export function wccDynamics(params) {
  return request({
    url: 'wcc/dynamics',
    method: 'post',
    data: params
  });
}

// marquee/edit
// 跑马灯添加或编辑
export function marqueeEdit(params) {
  return request({
    url: 'marquee/edit',
    method: 'post',
    data: params
  });
}
// marquee/list
// 跑马灯列表
export function marqueeList(params) {
  return request({
    url: 'marquee/list',
    method: 'post',
    data: params
  });
}
// marquee/del
// 跑马灯删除
export function marqueeDel(params) {
  return request({
    url: 'marquee/del',
    method: 'post',
    data: params
  });
}


// marquee/show
// 跑马隐藏显示
export function marqueeShow(params) {
  return request({
    url: 'marquee/show',
    method: 'post',
    data: params
  });
}
// qa/answer
// 问题回答
export function qaAnswer(params) {
  return request({
    url: 'qa/answer',
    method: 'post',
    data: params
  });
}

