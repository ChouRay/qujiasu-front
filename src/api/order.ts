import request from '@/utils/request'
import type {
  PackageOrderRequest,
  PackageRenewOrderRequest,
  PackageOrdersResponse
} from '@/types/order'

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

/**
 * 获取订单列表
 * @param params 查询参数
 */
export function getPackageOrders(params: {
  pageNum?: number
  pageSize?: number
  orderType?: string
  channelPaymentStatus?: string
}): Promise<PackageOrdersResponse> {
  return request.get('/api/v2/user/package-orders', { params })
}

/**
 * 根据 tradeNo 创建支付
 * @param tradeNo 订单编号
 * @param data 支付数据
 */
export function createPackageOrderPayment(
  tradeNo: string,
  data: { paySource: string; tradeType: string }
) {
  return request.post(`/api/v2/user/package-orders/${tradeNo}/payments`, data)
}

/**
 * 关闭订单
 * @param tradeNo 订单编号
 */
export function closePackageOrder(tradeNo: string) {
  return request.post(`/api/v2/user/package-orders/${tradeNo}/close`)
}
