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

// UI 配置
export interface ProductUiConfig {
  tag?: string // 标签
  description?: string // 描述
  primaryColor?: string // 主颜色
  secondaryColor?: string // 第二颜色
}

// 产品响应对象
export interface ProductResponseVO extends ProductItem {
  uiConfig?: ProductUiConfig // UI 配置
}

// 产品目录元数据节点
export interface ProductCatalogMetadataVO {
  id?: number // 产品元数据 ID
  name?: string // 产品元数据名称
  categoryId?: number // 产品分类 ID
  categoryName?: string // 产品分类名称
  status?: 'DISABLED' | 'ENABLED' // 状态
  gmtCreate?: string // 创建时间
  gmtModified?: string // 修改时间
  uiConfig?: ProductUiConfig // UI 配置
  products?: ProductResponseVO[] // 该元数据下的可售产品列表
}

// 产品目录分类节点
export interface ProductCatalogVO {
  id?: number // 产品分类 ID
  name?: string // 产品分类名称
  status?: 'DISABLED' | 'ENABLED' // 状态
  gmtCreate?: string // 创建时间
  gmtModified?: string // 修改时间
  uiConfig?: ProductUiConfig // UI 配置
  metadataList?: ProductCatalogMetadataVO[] // 该分类下的产品元数据列表
}
