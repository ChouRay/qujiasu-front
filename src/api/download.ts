import request from '@/utils/request'

export interface ClientVersion {
  id: number
  deviceType: 'IOS' | 'ANDROID' | 'WINDOWS' | 'MAC' | 'LINUX' | 'HARMONYOS'
  versionCode: number
  tips: string
  downloadUrl: string
  version: string
  gmtCreate: string
  channelCode: string
  status: 'AVAILABLE' | 'DEPRECATED' | 'FORBIDDEN' | 'BETA'
}

/**
 * 获取客户端最新版本信息
 * @returns 返回 ClientVersion 数组
 */
export function getLatestClientVersion() {
  return request<any, ClientVersion[]>({
    url: '/api/client-versions/latest',
    method: 'GET'
  })
}
