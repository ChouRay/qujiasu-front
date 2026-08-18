import request from '@/utils/request'
import type { UserInfo } from '@/types/user'
import type { RechargeListResponse, RechargeListParams } from '@/types/recharge'
import { setUserInfo } from '@/reactive/user'

/**
 * 获取用户个人信息
 * 请求成功后自动更新全局 userInfo 对象
 * @returns Promise<UserInfo>
 */
export function getUserInfo() {
  return request<any, UserInfo>({
    url: '/api/user',
    method: 'get'
  }).then(res => {
    // 将返回的数据合并到响应式对象中
    setUserInfo(res as any)
    return res as any
  })
}

/**
 * 获取充值记录列表
 * @param params - 分页参数
 * @returns Promise<RechargeListResponse>
 */
export function getRechargeList(params: RechargeListParams) {
  return request<any, RechargeListResponse>({
    url: '/api/user/recharges',
    method: 'get',
    params
  })
}

/**
 * 获取注册短信验证码
 * @param data - 请求参数
 * @param data.phoneNumber - 手机号
 * @param data.ticket - 验证码 ticket
 * @param data.randstr - 验证码 randstr
 * @returns Promise<any>
 */
export function getRegisterSmsCode(data: {
  phoneNumber: string
  ticket: string
  randstr: string
}) {
  return request({
    url: '/api/user/registrations/captchas',
    method: 'POST',
    data
  })
}

/**
 * 获取修改密码短信验证码
 * @param data - 请求参数
 * @param data.phoneNumber - 手机号
 * @param data.ticket - 验证码 ticket
 * @param data.randstr - 验证码 randstr
 * @returns Promise<any>
 */
export function getUpdatePsdSmsCode(data: {
  phoneNumber: string
  ticket: string
  randstr: string
}) {
  return request({
    url: '/api/user/password-resets/captchas',
    method: 'POST',
    data
  })
}
