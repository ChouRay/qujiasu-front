<template>
  <div class="package-page">
    <div class="page-header">
      <h1>多种套餐可供选择</h1>
      <p>根据您的需求和预算，选择最适合的套餐</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchProductMetadata" class="retry-btn">重试</button>
    </div>

    <!-- 产品目录 -->
    <div v-else class="catalog-container">
      <!-- 分类标题：左右两列（分类名 + 描述） -->
      <div class="catalog-headers">
        <div
          v-for="catalog in productMetadataList"
          :key="catalog.id"
          class="catalog-header"
        >
          <h3>{{ catalog.name }}</h3>
          <p class="catalog-header-desc">{{ getCategoryDescription(catalog) }}</p>
        </div>
      </div>

      <!-- 查看地区：独占一行，左右两个 -->
      <div class="view-regions-row">
        <div class="view-regions-link" @click="goRegion('普通版')">查看普通地区</div>
        <div class="view-regions-link" @click="goRegion('独享版')">查看独享地区</div>
      </div>

      <!-- 分类：左右两列，每列一个分类 -->
      <div class="catalog-columns">
        <div
          v-for="catalog in productMetadataList"
          :key="catalog.id"
          class="catalog-column"
        >
          <!-- 列表顶部：所属分类名 -->
          <div class="catalog-column-header">
            <h3 :style="{ color: getCategoryNameColor(catalog) }">{{ catalog.name }}</h3>
          </div>

          <!-- 元数据卡片：每个元数据节点一个卡片 -->
          <div
            v-for="metadata in catalog.metadataList"
            :key="metadata.id"
            class="metadata-card"
          >
            <!-- 套餐名 + 带宽 -->
            <div class="metadata-info">
              <span class="metadata-name">套餐：{{ metadata.name }}</span>
              <span class="metadata-bandwidth">带宽：{{ getBandwidthTag(metadata) }}</span>
            </div>

            <!-- 不同时长对应不同价格（上下结构，并列排列） -->
            <div class="product-options">
              <div
                v-for="product in metadata.products"
                :key="product.id"
                class="product-option"
              >
                <span class="option-duration">{{ product.duration }}天</span>
                <div class="option-price-wrap">
                  <span class="option-price">¥{{ product.price?.toFixed(2) }}</span>
                  <span v-if="product.fullPrice" class="option-original-price">¥{{ product.fullPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!(catalog.metadataList && catalog.metadataList.length > 0)" class="empty-products">
            <p>该分类暂无可用套餐</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 前往购买悬浮按钮 -->
    <button class="go-buy-btn" @click="handleGoBuy">前往购买</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductCatelog } from '@/api/product'
import { getToken } from '@/api/auth'
import type { ProductCatalogVO, ProductCatalogMetadataVO } from '@/types/product'

const router = useRouter()

// 状态
const loading = ref(false)
const error = ref<string>('')
const productMetadataList = ref<ProductCatalogVO[]>([])

// 获取套餐带宽标签（取第一个产品的 uiConfig.tag）
const getBandwidthTag = (metadata: ProductCatalogMetadataVO): string => {
  return metadata.products?.[0]?.uiConfig?.tag || ''
}

// 分类描述映射（按分类名称返回多行描述）
const categoryDescriptions: Record<string, string> = {
  普通版: '项目独享，同项目IP去重\n可固定线路，可随机分配\n网络稳定，网速快，地区多',
  独享版: '真独享，全网唯一，每次获取全新IP\n可固定地区，可随机分配，独享带宽\n网速快，地区极多，IP极多'
}

// 获取分类描述：按分类名称返回多行描述
const getCategoryDescription = (catalog: ProductCatalogVO): string => {
  return categoryDescriptions[catalog.name || ''] || ''
}

// 获取分类名字体颜色（uiConfig.primaryColor）
const getCategoryNameColor = (catalog: ProductCatalogVO): string => {
  return catalog.uiConfig?.primaryColor || '#667eea'
}

// 获取产品目录
const fetchProductMetadata = async () => {
  loading.value = true
  error.value = ''

  try {
    const catalogs = await getProductCatelog()
    productMetadataList.value = catalogs
  } catch (err) {
    error.value = '获取产品列表失败，请稍后重试'
    console.error('Failed to fetch catalog:', err)
  } finally {
    loading.value = false
  }
}

// 前往购买：未登录跳登录页，已登录跳购买页
const handleGoBuy = () => {
  if (getToken()) {
    router.push('/center/buy')
  } else {
    router.push('/login')
  }
}

// 根据分类名获取元数据 id（取第一个元数据节点）
const getMetadataIdByCatalogName = (name: string): number | null => {
  const catalog = productMetadataList.value.find(c => c.name === name)
  return catalog?.metadataList?.[0]?.id ?? null
}

// 查看地区：跳转到 /region，传入 metadataId
const goRegion = (catalogName: string) => {
  const metadataId = getMetadataIdByCatalogName(catalogName)
  if (metadataId) {
    router.push({ path: '/region', query: { metadataId } })
  }
}

// 生命周期
onMounted(() => {
  fetchProductMetadata()
})
</script>

<style scoped>
.package-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 16px;
  color: #7f8c8d;
}

/* 加载状态 */
.loading-container,
.products-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态 */
.error-container {
  text-align: center;
  padding: 100px 0;
  color: #e74c3c;
}

.retry-btn {
  margin-top: 20px;
  padding: 10px 30px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}

.retry-btn:hover {
  background-color: #2980b9;
}

/* 目录区域 */
.catalog-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 查看地区行 */
.view-regions-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.view-regions-link {
  display: block;
  width: fit-content;
  justify-self: end;
  padding: 6px 46px;
  color: #3498db;
  font-size: 14px;
  border: 1px solid #3498db;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.view-regions-link::after {
  content: '›';
  margin-left: 4px;
  font-size: 16px;
  line-height: 1;
  vertical-align: middle;
}

.view-regions-link:hover {
  background: #3498db;
  color: #fff;
}

/* 分类标题：左右两列（分类名 + 描述） */
.catalog-headers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.catalog-header {
  padding: 14px 10px;
  color: white;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
}

.catalog-header h2 {
  font-size: 24px;
  margin: 0 0 8px;
}

.catalog-header-desc {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
  line-height: 1.6;
}

/* 分类：左右两列 */
.catalog-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.catalog-column {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 列表顶部：所属分类名 */
.catalog-column-header {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.catalog-column-header h3 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
  font-weight: bold;
}

/* 元数据卡片（每个元数据节点一个卡片） */
.metadata-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.metadata-card:last-child {
  margin-bottom: 0;
}

/* 套餐名 */
.metadata-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #eee;
}

.metadata-name {
  font-size: 15px;
  font-weight: bold;
  color: #2c3e50;
}

.metadata-bandwidth {
  font-size: 13px;
  color: #667eea;
}

/* 不同时长对应不同价格（上下结构，并列排列） */
.product-options {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.product-option {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fafbfc;
}

.option-duration {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.option-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.option-price {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
}

.option-original-price {
  font-size: 12px;
  color: #95a5a6;
  text-decoration: line-through;
}

/* 空状态 */
.empty-products {
  width: 100%;
  text-align: center;
  padding: 30px;
  color: #95a5a6;
}

/* 前往购买悬浮按钮 */
.go-buy-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 108px;
  background: #ff475d;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 71, 93, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
}

.go-buy-btn:hover {
  opacity: 0.9;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 93, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .package-page {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .catalog-headers {
    grid-template-columns: 1fr;
  }

  .catalog-columns {
    grid-template-columns: 1fr;
  }
}
</style>
