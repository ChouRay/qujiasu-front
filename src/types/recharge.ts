// 充值记录相关类型定义

export interface RechargeOrder {
  id: number;
  tradeNo: number;
  payNo: string;
  totalAmount: number;
  paySource: 'BALANCE_PAY' | 'ALI_PAY' | 'WECHAT_PAY' | 'APPLE_PAY';
  status: 'CREATED' | 'PAYING' | 'PAY_SUCCESS' | 'CREDITING' | 'SUCCESS' | 'FAILED' | 'REFUNDING' | 'REFUNDED' | 'EXCEPTION';
  creditedAt: string;
  gmtCreate: string;
  gmtModified: string;
}

export interface RechargeListResponse {
  pageNum: number;
  pageSize: number;
  totalNum: number;
  data: RechargeOrder[];
  timestamp: string;
}

export interface RechargeListParams {
  pageNum: number;
  pageSize: number;
}

// 支付来源枚举
export type PaySource = 'BALANCE_PAY' | 'ALI_PAY' | 'WECHAT_PAY' | 'APPLE_PAY';

// 交易状态枚举
export type TradeType = string;

// 生成充值订单请求参数
export interface CreateRechargeOrderParams {
  totalAmount: number; // 充值金额，最小 0.01
  paySource: PaySource; // 支付来源
  tradeType?: TradeType; // 交易类型
}

// 生成充值订单响应（402 时返回支付宝或微信数据）
export interface CreateRechargeOrderResponse {
  [key: string]: any;
}
