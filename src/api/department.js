import request from '@/utils/request'
// department/all
// 员工部门列表
export function departmentAll(data) {
  return request({
    url: 'department/all',
    method: 'post',
    data
  })
}

// department/parents
// 层级ID线
export function departmentParents(data) {
  return request({
    url: 'department/parents',
    method: 'post',
    data
  })
}

// department/detail
// 员工部门详情
export function departmentDetail(data) {
  return request({
    url: 'department/detail',
    method: 'post',
    data
  })
}
// department/edit
// 员工部门编辑
export function departmentEdit(data) {
  return request({
    url: 'department/edit',
    method: 'post',
    data
  })
}
// department/positionEdit
// 员工职位编辑
export function departmentPositionEdit(data) {
  return request({
    url: 'department/positionEdit',
    method: 'post',
    data
  })
}
// department/copy
// 复制到
export function departmentCopy(data) {
  return request({
    url: 'department/copy',
    method: 'post',
    data
  })
}
// department/positionRemove
// 员工职位删除
export function departmentPositionRemove(data) {
  return request({
    url: 'department/positionRemove',
    method: 'post',
    data
  })
}
// department/del
// 员工部门删除
export function departmentDel(data) {
  return request({
    url: 'department/del',
    method: 'post',
    data
  })
}
// jp/all
// 职位列表
export function jpAll(data) {
  return request({
    url: 'jp/all',
    method: 'post',
    data
  })
}
// jp/copy
// 复制到
export function jpCopy(data) {
  return request({
    url: 'jp/copy',
    method: 'post',
    data
  })
}
// jp/del
// 职位删除
export function jpDel(data) {
  return request({
    url: 'jp/del',
    method: 'post',
    data
  })
}
// jp/detail
// 职位详情
export function jpDetail(data) {
  return request({
    url: 'jp/detail',
    method: 'post',
    data
  })
}
// jp/edit
// 职位编辑
export function jpEdit(data) {
  return request({
    url: 'jp/edit',
    method: 'post',
    data
  })
}
// jp/parents
// 层级ID线
export function jpParents(data) {
  return request({
    url: 'jp/parents',
    method: 'post',
    data
  })
}
