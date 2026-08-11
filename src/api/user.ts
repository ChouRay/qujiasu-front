import request from '@/utils/request'
import type { UserInfo } from '@/types/user'

/**
 * 获取用户个人信息
 * @returns Promise<UserInfo>
 */
export function getUserInfo() {
  return request<UserInfo>({
    url: '/api/user',
    method: 'get'
  })
}
