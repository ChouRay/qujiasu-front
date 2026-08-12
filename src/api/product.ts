import request from '@/utils/request'
import type { ProductMetadataItem, ProductItem } from '@/types/product'

// 获取产品目录
export function getProductMetadata() {
  return request<any, ProductMetadataItem[]>({
    url: '/api/product-metadata',
    method: 'GET'
  })
}

// 根据产品目录 ID 获取对应产品列表
export function getProductsByMetadataId(metadataId: number) {
  return request<any, ProductItem[]>({
    url: '/api/products',
    method: 'GET',
    params: { metadataId }
  })
}
