import { reactive } from 'vue'
import type { UserInfo } from '@/types/user'

// 创建响应式用户信息对象，初始为空
export const userInfo = reactive<Partial<UserInfo>>({})

/**
 * 设置用户信息
 * @param data 用户数据
 */
export function setUserInfo(data: UserInfo) {
  Object.assign(userInfo, data)
}

/**
 * 清除用户信息（退出登录时调用）
 */
export function clearUserInfo() {
  // 清空所有属性
  Object.keys(userInfo).forEach(key => {
    delete (userInfo as any)[key]
  })
}
