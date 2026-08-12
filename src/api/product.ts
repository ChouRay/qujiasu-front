import request from '@/utils/request'
import type { ProductCatalogItem, ProductItem } from '@/types/product'

// 获取产品目录
export function getProductCatalog() {
  return request<any, ProductCatalogItem[]>({
    url: '/api/product-catalog',
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
