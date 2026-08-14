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
