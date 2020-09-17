import request from '@/utils/request'

//已缴存的诚意金列表
export function list(data) {
  return request({
    url: 'bank/holds',
    method: 'post',
    data
  })
}

