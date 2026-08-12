// 产品元数据 UI 配置视图对象
export interface ProductMetadataUiConfigVO {
  primaryColor?: string; // 主色调
  secondaryColor?: string; // 辅助色
}

// 产品目录项
export interface ProductMetadataItem {
  id?: number; // 产品 ID
  name?: string; // 产品名称
  description?: string; // 产品描述
  abilityTips?: string; // 能力提示
  status?: number; // 状态 0-禁用 1-启用
  gmtCreate?: string; // 创建时间
  gmtModified?: string; // 修改时间
  uiConfig?: ProductMetadataUiConfigVO; // UI 配置
}

// 产品项
export interface ProductItem {
  id?: number; // 产品 ID
  metadataId?: number; // 产品元数据 ID
  name?: string; // 产品名称
  price?: number; // 价格
  fullPrice?: number; // 原价
  duration?: number; // 时长 (天)
  channel?: string; // 渠道代码
  tag?: string; // 标签
  updateTime?: string; // 更新时间
  status?: 'DISABLED' | 'ENABLED'; // 状态
  ttips?: string; // 顶部提示
  btips?: string; // 底部提示
}
