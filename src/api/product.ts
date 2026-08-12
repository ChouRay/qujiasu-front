import request from '@/utils/request'

// 产品元数据 UI 配置视图对象
interface ProductMetadataUiConfigVO {
  primaryColor?: string // 主色
  secondaryColor?: string // 次色
}

// 产品目录项
export interface ProductCatalogItem {
  id?: number // 产品元数据ID
  name?: string // 产品名称
  description?: string // 产品描述
  abilityTips?: string // 能力提示
  status?: string // 状态
  gmtCreate?: string // 创建时间
  gmtModified?: string // 修改时间
  uiConfig?: ProductMetadataUiConfigVO // UI配置
}

// 获取产品目录
export function getProductCatalog() {
  return request<any, ProductCatalogItem[]>({
    url: '/api/product-catalog',
    method: 'GET'
  })
}
