import request from '@/utils/request'
import type { UserInfo } from '@/types/user'
import { setUserInfo } from '@/store/user'

/**
 * 获取用户个人信息
 * 请求成功后自动更新全局 userInfo 对象
 * @returns Promise<UserInfo>
 */
export function getUserInfo() {
  return request<UserInfo>({
    url: '/api/user',
    method: 'get'
  }).then(res => {
    // 将返回的数据合并到响应式对象中
    setUserInfo(res)
    return res
  })
}
