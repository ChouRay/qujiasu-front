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
