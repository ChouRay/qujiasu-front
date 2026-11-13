import request from '@/utils/request'
import type { ProductCatalogVO } from '@/types/product'

// 获取产品目录分类（含产品列表）
export function getProductCatelog() {
  return request<any, ProductCatalogVO[]>({
    url: '/api/product-catalog',
    method: 'GET'
  })
}
