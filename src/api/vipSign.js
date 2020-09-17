import request from '@/utils/request'

// 添加修改
export function modifyVipSign(data) {
    return request({
        url: 'countersign/edit',
        method: 'post',
        data
    })
}

// 获取信息(用于编辑)
export function getSignInfo(data) {
    return request({
        url: 'countersign/detail',
        method: 'post',
        data
    })
}

export function exportSign(data) {
    return request({
        url: 'countersign/export',
        method: 'post',
        data
    })
}
// 导出
export function exportSignList(data) {
    return request({
        url: '/countersign/member/export',
        method: 'post',
        data
    })
}
// 手动添加会员
export function addHandleItem(data) {
    return request({
        url: 'countersign/member/edit',
        method: 'post',
        data
    })
}
// 获取会签成员列表
export function vipSignMemList(data) {
    return request({
        url: 'countersign/member/list',
        method: 'post',
        data
    })
}

// 获取列表
export function vipSignList(data) {
    return request({
        url: 'countersign/list',
        method: 'post',
        data
    })
}

// 获取列表
export function enableSign(data) {
    return request({
        url: 'countersign/enable',
        method: 'post',
        data
    })
}
// 删除
export function delSign(data) {
    return request({
        url: 'countersign/del',
        method: 'post',
        data
    })
}