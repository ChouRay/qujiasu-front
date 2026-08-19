import request from '@/utils/request'
import type { PackagesResponse } from '@/types/packages'

export function getPackagesList(params: { pageNum: number; pageSize: number }) {
  return request<PackagesResponse>({
    url: '/api/user/packages',
    method: 'get',
    params,
  })
}

export function getPackagesByUsername(
  username: string,
  params: { pageNum: number; pageSize: number }
) {
  return request<PackagesResponse>({
    url: '/api/user/packages',
    method: 'get',
    params: {
      ...params,
      username,
    },
  })
}

/**
 * 获取游戏列表
 * @returns Promise<any>
 */
export function requestGames() {
  return request({
    url: '/api/client/games',
    method: 'get',
  })
}

/**
 * 获取地区列表
 * @param params.metadataId - 元数据 ID（必需）
 * @param params.gameId - 游戏 ID（可选）
 * @returns Promise<any>
 */
export function requestLocations(params: { metadataId: number; gameId?: number }) {
  return request({
    url: '/api/locations',
    method: 'get',
    params,
  })
}
