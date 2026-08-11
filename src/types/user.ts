// src/types/user.ts

/**
 * VIP 信息接口
 */
export interface VipInfo {
  uid: number
  level: 'NONE' | 'VIP_LEVEL_1' | 'VIP_LEVEL_2' | 'VIP_LEVEL_3'
  expireTimestamp: number
}

/**
 * 用户详细信息接口
 */
export interface UserInfo {
  id: number
  username: string
  phoneNumber: string
  isAgent: number
  isVip: number
  agentLevel: number
  imgUrl: string
  gmtCreate: string
  userBalance: number
  userReward: number
  totalAgentIncome: number
  userPoint: number
  invitationCode: string
  invitationLink: string
  idAli: string
  usernameAli: string
  gmtModified: string
  isNew: number
  totalWithdraw: number
  lastLoginIp: string
  totalRecharge: number
  agentIncome: number
  unionId: string
  agent: string
  totalInviteCount: number
  onWithdraw: number
  totalCost: number
  dividendRatio: number
  vipInfo: VipInfo
}
