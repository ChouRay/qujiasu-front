import request from '@/utils/request'
import type { UserInfo } from '@/types/user'
import type { RechargeListResponse, RechargeListParams, CreateRechargeOrderParams } from '@/types/recharge'
import { setUserInfo } from '@/reactive/user'
import { getErrorMessage } from '@/utils/errorMessage'

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

/**
 * 用户注册接口
 * @param data - 注册信息
 * @param data.phoneNumber - 手机号
 * @param data.password - 密码
 * @param data.smsCode - 短信验证码
 * @param data.inviteCode - 邀请码
 * @param callback - 回调函数，成功时 callback(200)，业务错误时 callback(400, errorMsg)
 * @returns Promise<void>
 */
export function requestRegister(
  data: {
    phoneNumber: string
    password: string
    smsCode: string
    inviteCode: string
  },
  callback: (status: number, errorMsg?: string) => void
) {
  return request({
    url: '/api/user/registrations',
    method: 'POST',
    data
  })
    .then((res: any) => {
      if (res.status === 200) {
        callback(200)
      } else if (res.status === 400) {
        callback(400, getErrorMessage(res.msg, '注册失败'))
      }
    })
    .catch((error: any) => {
      console.error('注册失败:', error)
      callback(400, '注册失败，请稍后重试')
    })
}

/**
 * 重置密码接口
 * @param data - 重置密码信息
 * @param data.phoneNumber - 手机号
 * @param data.password - 新密码
 * @param data.smsCode - 短信验证码
 * @param callback - 回调函数，成功时 callback(200)，业务错误时 callback(400, errorMsg)
 * @returns Promise<void>
 */
export function requestResetPassword(
  data: {
    phoneNumber: string
    password: string
    smsCode: string
  },
  callback: (status: number, errorMsg?: string) => void
) {
  return request({
    url: '/api/user/password-resets',
    method: 'PUT',
    data
  })
    .then((res: any) => {
      if (res.status === 200) {
        callback(200)
      } else if (res.status === 400) {
        callback(400, getErrorMessage(res.msg, '重置密码失败'))
      }
    })
    .catch((error: any) => {
      console.error('重置密码失败:', error)
      callback(400, '重置密码失败，请稍后重试')
    })
}

/**
 * 生成充值订单接口
 * @param data - 充值订单信息
 * @param data.totalAmount - 充值金额，最小 0.01
 * @param data.paySource - 支付来源 (BALANCE_PAY, ALI_PAY, WECHAT_PAY, APPLE_PAY)
 * @param data.tradeType - 交易类型
 * @param onSuccess - 成功回调 (200)
 * @param onError - 错误回调 (400 业务错误，或 402 需要处理支付宝/微信数据)
 * @returns Promise<void>
 */
export function createRechargeOrder(
  data: CreateRechargeOrderParams,
  onSuccess: () => void,
  onError: (status: number, response?: any) => void
) {
  return request({
    url: '/api/user/recharges',
    method: 'POST',
    data
  })
    .then((res: any) => {
      if (res.status === 200) {
        onSuccess()
      } else if (res.status === 400) {
        onError(400, res)
      }
    })
    .catch((error: any) => {
      // 处理 402 状态码：支付宝或微信数据
      if (error.response && error.response.status === 402) {
        const paySource = data.paySource
        const responseData = error.response.data
        
        if (paySource === 'ALI_PAY') {
          // 支付宝：直接执行 document.write 跳转
          document.write(responseData)
          document.close()
        } else if (paySource === 'WECHAT_PAY') {
          // 微信：暂时不做处理，返回数据给调用方
          onError(402, responseData)
        } else {
          // 其他支付方式，返回数据给调用方
          onError(402, responseData)
        }
      } else if (error.response && error.response.status === 400) {
        // 400 业务错误
        onError(400, error.response)
      } else {
        // 其他错误
        console.error('生成充值订单失败:', error)
        onError(500, error)
      }
    })
}
