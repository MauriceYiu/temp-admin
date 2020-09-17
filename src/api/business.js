import request from '../utils/request'

// 2020.5.4 start
// service/area/all
// 业务领域列表
export function areaList({ enable }) {
    return request({
        url: '/service/area/all/' + enable,
        method: 'GET',
    });
}
// service/area/enable
// 业务启用或禁用
export function areaEnable(params) {
    return request({
        url: '/service/area/enable',
        method: 'post',
        data: params
    });
}
// service/area/edit
// 业务添加或编辑
export function areaEdit(params) {
    return request({
        url: '/service/area/edit',
        method: 'post',
        data: params
    });
}
// service/detail
// 业务详情
export function areaDetail(params) {
    return request({
        url: '/service/area/detail',
        method: 'post',
        data: params
    });
}
// service/area/del
// 业务删除
export function areaDel(params) {
    return request({
        url: '/service/area/del',
        method: 'post',
        data: params
    });
}
//2020.5.4 end

// service/list
// 业务列表
export function serviceList(params) {
    return request({
        url: '/service/list',
        method: 'post',
        data: params
    });
}
// service/detail
// 业务详情
export function serviceDetail(params) {
    return request({
        url: '/service/detail',
        method: 'post',
        data: params
    });
}
// service/edit
// 业务添加或编辑
export function serviceEdit(params) {
    return request({
        url: '/service/edit',
        method: 'post',
        data: params
    });
}
// service/del
// 业务删除
export function serviceDel(params) {
    return request({
        url: '/service/del',
        method: 'post',
        data: params
    });
}

// service/enable
// 业务启用或禁用
export function serviceEnable(params) {
    return request({
        url: '/service/enable',
        method: 'post',
        data: params
    });
}

// /news/list
// 资讯列表
export function newsList(params) {
    return request({
        url: '/news/list',
        method: 'post',
        data: params
    });
}

// news/enable
// 资讯禁用启用
export function newsEnable(params) {
    return request({
        url: '/news/enable',
        method: 'post',
        data: params
    });
}

// news/top
// 资讯推荐禁用启用
export function newsTop(params) {
    return request({
        url: '/news/top',
        method: 'post',
        data: params
    });
}

// news/edit
// 新建或修改资讯
export function newsEdit(params) {
    return request({
        url: '/news/edit',
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

// news/delete
//   删除资讯
export function newsDelete(params) {
    return request({
        url: '/news/delete',
        method: 'post',
        data: params
    });
}

// statistics/realTime
// 总概况统计
export function statisticsRealTime(params) {
    return request({
        url: '/statistics/realTime',
        method: 'post',
        data: params
    });
}

// statistics/histories
// 历史统计数据
export function statisticsHistories(params) {
    return request({
        url: '/statistics/histories',
        method: 'post',
        data: params
    });
}

// /statistics/ranking
// 业绩排行
export function statisticsRanking(params) {
    return request({
        url: '/statistics/ranking',
        method: 'post',
        data: params
    });
}

// statistics/departmentRanking
// 部门业绩排行
export function statisticsDepartmentRanking(params) {
    return request({
        url: '/statistics/departmentRanking',
        method: 'post',
        data: params
    });
}

// pk/list
// PK列表
export function pkList(params) {
    return request({
        url: '/pk/list',
        method: 'post',
        data: params
    });
}

// pk/edit
// PK的添加或修改
export function pkEdit(params) {
    return request({
        url: '/pk/edit',
        method: 'post',
        data: params
    });
}

// pk/win
// PK标记完成
export function pkWin(params) {
    return request({
        url: '/pk/win',
        method: 'post',
        data: params
    });
}

// pk/del
// PK删除
export function pkDel(params) {
    return request({
        url: '/pk/del',
        method: 'post',
        data: params
    });
}
// pk/detail
// PK详情
export function pkDetail(params) {
    return request({
        url: '/pk/detail',
        method: 'post',
        data: params
    });
}
// chat/csEvaluates
// 客服评价列表
export function chatCsEvaluates(params) {
    return request({
        url: '/chat/csEvaluates',
        method: 'post',
        data: params
    });
}