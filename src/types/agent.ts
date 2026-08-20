// 代理相关类型定义

// 佣金记录项
export interface PortalDividendRecordVO {
  id: number;
  dividendOrderId: number;
  batchNo: number;
  buyerUserId: number;
  buyerUserName: string;
  tradeNo: number;
  orderType: string;
  itemIndex: number;
  amountToDividend: number;
  dividendRatio: number;
  finalObtainAmount: number;
  gmtCreate: string;
  gmtComplete: string;
  status: string;
  closeReason: string;
  finalObtainPoint: number;
}

// 佣金记录响应
export interface CommissionRecordsResponse {
  pageNum: number;
  pageSize: number;
  totalNum: number;
  data: PortalDividendRecordVO[];
  timestamp: string;
}

// 提现记录项
export interface PortalAccountWithdrawVO {
  id: number;
  totalAmount: number;
  destination: 'BALANCE' | 'ALIPAY';
  status: 'PENDING' | 'COMPLETED' | 'REFUSED' | 'ROLLED_BACK';
  gmtApply: string;
  gmtComplete: string;
}

// 提现记录响应
export interface WithdrawalRecordsResponse {
  pageNum: number;
  pageSize: number;
  totalNum: number;
  data: PortalAccountWithdrawVO[];
  timestamp: string;
}

// 推广用户项
export interface SoutaUserForLowerAgent {
  imgUrl: string;
  nickname: string;
  username: string;
  phoneNumber: string;
  agentLevel: number;
  inviteSource: number;
  gmtCreate: string;
  totalCost: number;
  agentUserCount: number;
  normalUserCount: number;
}

// 推广用户记录响应
export interface InvitedUserRecordsResponse {
  pageNum: number;
  pageSize: number;
  totalNum: number;
  data: SoutaUserForLowerAgent[];
  timestamp: string;
}

// 获取推广用户的请求参数
export interface InvitedUserRecordsParams {
  pageNum: number;
  pageSize: number;
  isAgent?: number; // 0：不是代理，1：是代理
}

// 通用的分页参数
export interface PageParams {
  pageNum: number;
  pageSize: number;
}
