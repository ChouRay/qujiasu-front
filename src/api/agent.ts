import request from '@/utils/request'
import type {
  CommissionRecordsResponse,
  WithdrawalRecordsResponse,
  InvitedUserRecordsResponse,
  InvitedUserRecordsParams,
  PageParams
} from '@/types/agent'

/**
 * 获取佣金记录
 * @param params - 分页参数
 * @returns Promise<CommissionRecordsResponse>
 */
export function getCommissionRecords(params: PageParams) {
  return request<any, CommissionRecordsResponse>({
    url: '/api/user/dividends',
    method: 'get',
    params
  })
}

/**
 * 获取提现记录
 * @param params - 分页参数
 * @returns Promise<WithdrawalRecordsResponse>
 */
export function getWithdrawalRecords(params: PageParams) {
  return request<any, WithdrawalRecordsResponse>({
    url: '/api/user/withdrawals',
    method: 'get',
    params
  })
}

/**
 * 获取推广用户记录
 * @param params - 分页参数和是否代理标识
 * @returns Promise<InvitedUserRecordsResponse>
 */
export function getInvitedUserRecords(params: InvitedUserRecordsParams) {
  return request<any, InvitedUserRecordsResponse>({
    url: '/api/user/invited-users',
    method: 'get',
    params
  })
}
