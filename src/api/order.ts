import request from '../utils/request'
import { getErrorMessage } from '../utils/errorMessage'
import { PAY_TRADE_TYPE } from '../utils/apiEnums'
import type { PackageOrderRequest } from '../types/order'

/**
 * 创建订单请求
 * @param data 订单数据
 * @param callback 回调函数 (status, data?, errorMsg?)
 */
export function requestPackageOrders(
  data: PackageOrderRequest,
  callback: (status: number, data?: any, errorMsg?: string) => void
) {
  const requestData = {
    ...data,
    tradeType: PAY_TRADE_TYPE.NATIVE
  }

  request({
    url: '/api/v2/user/package-orders',
    method: 'post',
    data: requestData
  })
    .then((res) => {
      if (res.status === 200) {
        callback(200, res.data)
      } else if (res.status === 400) {
        const errorMsg = getErrorMessage(res.data?.msg || '请求失败')
        callback(400, null, errorMsg)
      } else {
        callback(res.status, null, '未知错误')
      }
    })
    .catch((error) => {
      console.error('创建订单失败:', error)
      callback(500, null, '网络错误，请稍后重试')
    })
}

/**
 * 检查套餐账号是否可用
 * @param username 账号名称
 * @param callback 回调函数 (status, data?, errorMsg?)
 */
export function checkUsernameAvilability(
  username: string,
  callback: (status: number, data?: any, errorMsg?: string) => void
) {
  request({
    url: '/api/user/package-orders/username-availability',
    method: 'get',
    params: { username }
  })
    .then((res) => {
      if (res.status === 200) {
        callback(200, res.data)
      } else if (res.status === 400) {
        const errorMsg = getErrorMessage(res.data?.msg || '检查失败')
        callback(400, null, errorMsg)
      } else {
        callback(res.status, null, '未知错误')
      }
    })
    .catch((error) => {
      console.error('检查账号可用性失败:', error)
      callback(500, null, '网络错误，请稍后重试')
    })
}
