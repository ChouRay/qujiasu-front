import request from '@/utils/request'
import type { PackageOrderRequest, PackageRenewOrderRequest } from '@/types/order'

/**
 * 创建订单请求
 * @param data 订单数据
 */
export function requestPackageOrders(data: PackageOrderRequest) {
  return request.post('/api/v2/user/package-orders', data)
}

/**
 * 检查套餐账号是否可用
 * @param username 账号名称
 */
export function checkUsernameAvilability(username: string) {
  return request.get('/api/user/package-orders/username-availability', {
    params: { username }
  })
}

/**
 * 创建续费订单请求
 * @param data 续费订单数据
 */
export function requestRenew(data: PackageRenewOrderRequest) {
  return request.post('/api/user/package-renew-orders', data)
}
