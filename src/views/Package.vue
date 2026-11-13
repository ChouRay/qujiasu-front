<template>
  <div class="package-page">
    <div class="page-header">
      <h1>选择您的套餐</h1>
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
          <h2>{{ catalog.categoryName }}</h2>
          <p class="catalog-header-desc">{{ getCategoryDescription(catalog) }}</p>
        </div>
      </div>

      <!-- 查看地区：独占一行 -->
      <div class="view-regions-link">查看地区</div>

      <!-- 分类：左右两列，每列顶部标明分类名 -->
      <div class="catalog-columns">
        <div
          v-for="catalog in productMetadataList"
          :key="catalog.id"
          class="catalog-column"
        >
          <!-- 列表顶部：所属分类名 -->
          <div class="catalog-column-header">
            <h3>{{ catalog.categoryName }}</h3>
          </div>

          <!-- 套餐：横向列表 -->
          <div class="product-list">
            <div
              v-for="product in catalog.products"
              :key="product.id"
              class="product-item"
              :class="{ selected: selectedProduct?.id === product.id }"
              @click="selectProduct(product)"
            >
              <span class="product-duration">{{ product.duration }}天</span>
              <span class="product-name">{{ product.name }}</span>
              <div class="product-price-wrap">
                <span class="product-price">¥{{ product.price?.toFixed(2) }}</span>
                <span v-if="product.fullPrice" class="product-original-price">¥{{ product.fullPrice.toFixed(2) }}</span>
              </div>
              <button
                class="buy-btn"
                @click.stop="handleBuy(product)"
              >
                立即购买
              </button>
            </div>

            <div v-if="!catalog.products || catalog.products.length === 0" class="empty-products">
              <p>该分类暂无可用套餐</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductCatelog } from '@/api/product'
import type { ProductCatalogVO, ProductItem } from '@/types/product'

const router = useRouter()

// 状态
const loading = ref(false)
const error = ref<string>('')
const productMetadataList = ref<ProductCatalogVO[]>([])
const selectedProduct = ref<ProductItem | null>(null)

// 选择产品
const selectProduct = (product: ProductItem) => {
  selectedProduct.value = product
}

// 分类描述映射（按 categoryName 返回多行描述）
const categoryDescriptions: Record<string, string> = {
  普通版: '项目独享，同项目IP去重\n可固定线路，可随机分配\n网络稳定，网速快，地区多',
  独享版: '真独享，全网唯一，每次获取全新IP\n可固定地区，可随机分配，独享带宽\n网速快，地区极多，IP极多'
}

// 获取分类描述：优先使用映射，否则回退到后端返回的 description
const getCategoryDescription = (catalog: ProductCatalogVO): string => {
  const mapped = categoryDescriptions[catalog.categoryName || '']
  if (mapped) return mapped
  return catalog.description || ''
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

// 购买处理 - 检查登录状态并跳转
const handleBuy = (product: ProductItem) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    // 未登录，跳转登录页
    router.push('/login')
    return
  }

  // 已登录，跳转购买页，传递 metadataId 和 productId
  router.push({
    path: '/center/buy',
    query: {
      mid: product.metadataId,
      pid: product.id
    }
  })
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

/* 查看地区链接 */
.view-regions-link {
  display: block;
  width: fit-content;
  margin-left: auto;
  margin-bottom: 20px;
  padding: 6px 16px;
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
  padding: 24px 20px;
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

/* 套餐：横向列表 */
.product-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 产品条目（横向卡片） */
.product-item {
  flex: 1 1 120px;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
  text-align: center;
}

.product-item:hover {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.product-item.selected {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.product-duration {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.product-name {
  font-size: 12px;
  color: #7f8c8d;
}

.product-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
}

.product-original-price {
  font-size: 12px;
  color: #95a5a6;
  text-decoration: line-through;
}

/* 立即购买按钮 */
.buy-btn {
  width: 100%;
  padding: 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.buy-btn:hover {
  opacity: 0.85;
}

/* 空状态 */
.empty-products {
  width: 100%;
  text-align: center;
  padding: 30px;
  color: #95a5a6;
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
