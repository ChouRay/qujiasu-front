/**
 * 游戏绑定信息
 */
export interface GameBindDTO {
  username: string
  gameId: number
  locationIdList: number[]
}

/**
 * 订单类型枚举
 */
export enum OrderType {
  PACKAGE_ORDER = 'PACKAGE_ORDER',
  PACKAGE_RENEW_ORDER = 'PACKAGE_RENEW_ORDER'
}

/**
 * 支付来源枚举
 */
export enum PaySource {
  ALI_PAY = 'ALI_PAY',
  WECHAT_PAY = 'WECHAT_PAY',
  APPLE_PAY = 'APPLE_PAY'
}

/**
 * 创建订单请求参数
 */
export interface PackageOrderRequest {
  orderType: OrderType
  username: string
  password: string
  usageCount: number
  productId: number
  gameBind: GameBindDTO
  paySource: PaySource
  tradeType: string
}

/**
 * 续费订单请求参数
 */
export interface PackageRenewOrderRequest {
  orderType: OrderType
  username: string
  usageCount: number
  productId: number
  paySource: PaySource
  tradeType: string
}
