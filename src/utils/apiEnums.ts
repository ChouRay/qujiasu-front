// 支付来源常量
export const PAY_SOURCE = {
  BALANCE: 'BALANCE_PAY',
  ALIPAY: 'ALI_PAY',
  WECHAT: 'WECHAT_PAY',
  APPLE: 'APPLE_PAY',
} as const;

export type PaySource = typeof PAY_SOURCE[keyof typeof PAY_SOURCE];

// 支付交易类型
export const PAY_TRADE_TYPE = {
  NATIVE: 'NATIVE',
  APP: 'APP',
  JSAPI: 'JSAPI',
  MINI_PROGRAM: 'MINI_PROGRAM',
  H5: 'H5',
} as const;

export type PayTradeType = typeof PAY_TRADE_TYPE[keyof typeof PAY_TRADE_TYPE];

// 订单类型
export const ORDER_TYPE = {
  PACKAGE_ORDER: 'PACKAGE_ORDER',
  PACKAGE_RENEW_ORDER: 'PACKAGE_RENEW_ORDER',
  RECHARGE_ORDER: 'RECHARGE_ORDER',
  PPTP_ORDER: 'PPTP_ORDER',
} as const;

export type OrderType = typeof ORDER_TYPE[keyof typeof ORDER_TYPE];

// 支付状态
export const PAY_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;

export type PayStatus = typeof PAY_STATUS[keyof typeof PAY_STATUS];

// 提现目标
export const WITHDRAW_DESTINATION = {
  BALANCE: 'BALANCE',
  ALIPAY: 'ALIPAY',
} as const;

export type WithdrawDestination = typeof WITHDRAW_DESTINATION[keyof typeof WITHDRAW_DESTINATION];

// 设备类型
export const DEVICE_TYPE = {
  IOS: 'IOS',
  ANDROID: 'ANDROID',
  WINDOWS: 'WINDOWS',
  MAC: 'MAC',
  LINUX: 'LINUX',
  HARMONYOS: 'HARMONYOS',
} as const;

export type DeviceType = typeof DEVICE_TYPE[keyof typeof DEVICE_TYPE];

// 分红来源
export const DIVIDEND_SOURCE = {
  PACKAGE_CREATE: 'PACKAGE_ORDER',
  PACKAGE_RENEW: 'PACKAGE_RENEW_ORDER',
} as const;

export type DividendSource = typeof DIVIDEND_SOURCE[keyof typeof DIVIDEND_SOURCE];

// 分红状态
export const DIVIDEND_STATUS = {
  DEFAULT: 'DEFAULT',
  QUEUED: 'QUEUED',
  DONE: 'DONE',
  REFUNDED: 'REFUNDED',
} as const;

export type DividendStatus = typeof DIVIDEND_STATUS[keyof typeof DIVIDEND_STATUS];

// 订阅状态
export const WITHDRAWAL_STATUS = {
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  REFUSED: 'REFUSED',
  ROLLED_BACK: 'ROLLED_BACK'
} as const;

export type WithdrawalStatus = typeof WITHDRAWAL_STATUS[keyof typeof WITHDRAWAL_STATUS];

// 格式化提现目标
export function formatWithdrawDestination(value: WithdrawDestination): string {
  switch (value) {
    case WITHDRAW_DESTINATION.BALANCE:
      return '余额';
    case WITHDRAW_DESTINATION.ALIPAY:
      return '支付宝';
    default:
      return '其他';
  }
}

// 格式化分红来源
export function formatDividendSource(value: DividendSource): string {
  switch (value) {
    case DIVIDEND_SOURCE.PACKAGE_CREATE:
      return '购买';
    case DIVIDEND_SOURCE.PACKAGE_RENEW:
      return '续费';
    default:
      return '其他';
  }
}

// 格式化分红状态（返回 HTML 字符串）
export function formatDividendStatus(value: DividendStatus): string {
  switch (value) {
    case DIVIDEND_STATUS.DEFAULT:
      return "<span class='text-danger'>未分红</span>";
    case DIVIDEND_STATUS.QUEUED:
      return "<span class='text-primary'>已申请</span>";
    case DIVIDEND_STATUS.DONE:
      return "<span class='text-success'>已完成</span>";
    case DIVIDEND_STATUS.REFUNDED:
      return "<span class='text-danger'>已退款</span>";
    default:
      return '其他';
  }
}

// 判断是否为未支付状态
export function isUnpaidStatus(value: PayStatus): boolean {
  return value === PAY_STATUS.UNPAID;
}

// 格式化订阅状态
export function formatWithdrawalStatus(value: WithdrawalStatus): string {
  switch (value) {
    case WITHDRAWAL_STATUS.COMPLETED:
      return '正常';
    case WITHDRAWAL_STATUS.REFUSED:
      return '拒绝';
    case WITHDRAWAL_STATUS.ROLLED_BACK:
        return '回退'
    case WITHDRAWAL_STATUS.PENDING:
        return '申请中'
    default:
      return '其他';
  }  
}

// 格式化支付状态（参数为通用字符串，因为可能来自外部动态值）
export function formatPayStatus(status: string): string {
  switch (status) {
    case "CREATED":
      return '已创建';
    case "PAYING":
      return '支付中';
    case "PAY_SUCCESS":
      return '支付成功';
    case "CREDITING":
      return '入账中';
    case "SUCCESS":
      return '充值成功';
    case "FAILED":
      return '充值失败';
    case "REFUNDING":
      return '退款中';
    case "REFUNDED":
      return '已退款';
    case "EXCEPTION":
      return '异常';
    default:
      return '其他';
  }
}