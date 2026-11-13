// 产品项
export interface ProductItem {
  id?: number; // 产品 ID
  metadataId?: number; // 产品元数据 ID
  name?: string; // 产品名称
  price?: number; // 价格
  fullPrice?: number; // 原价
  duration?: number; // 时长 (天)
  channel?: string; // 渠道代码
  updateTime?: string; // 更新时间
  status?: 'DISABLED' | 'ENABLED'; // 状态
}

// 产品目录分类（含产品列表）
export interface ProductCatalogVO {
  id?: number // 分类 ID
  name?: string // 分类名称
  description?: string // 分类描述
  categoryId?: number // 产品类型 ID
  categoryName?: string // 产品类型名称
  status?: 'DISABLED' | 'ENABLED' // 状态
  gmtCreate?: string // 创建时间
  gmtModified?: string // 修改时间
  products?: ProductItem[] // 产品列表
}
