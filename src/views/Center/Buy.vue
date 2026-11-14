<template>
  <div class="buy-container">
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
      <!-- 上：查看地区 -->
      <div class="view-regions-link">查看地区</div>

      <!-- 总体左右布局 -->
      <div class="buy-page-layout">
        <!-- 左列：分类标签 + 套餐列表 -->
        <div class="buy-left-column">
          <!-- 分类标签 -->
          <div class="category-tabs">
            <div
              v-for="catalog in productMetadataList"
              :key="catalog.id"
              class="category-tab"
              :class="{ active: selectedCatalogId === catalog.id }"
              @click="selectCategory(catalog)"
            >
              <h3 :style="{ color: getCategoryNameColor(catalog) }">{{ catalog.name }}</h3>
              <p v-if="getCategoryDescription(catalog)" class="category-tab-desc">{{ getCategoryDescription(catalog) }}</p>
            </div>
          </div>

          <!-- 套餐元数据列表 -->
          <div v-if="currentCatalog" class="metadata-list">
            <div class="catalog-column-header">
              <h3 :style="{ color: getCategoryNameColor(currentCatalog) }">{{ currentCatalog.name }}-套餐</h3>
            </div>

            <div
              v-for="metadata in currentCatalog.metadataList"
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
                  :class="{ selected: selectedProduct?.id === product.id }"
                  @click="handleBuy(product)"
                >
                  <span class="option-duration">{{ product.duration }}天</span>
                  <div class="option-price-wrap">
                    <span class="option-price">¥{{ product.price?.toFixed(2) }}</span>
                    <span v-if="product.fullPrice" class="option-original-price">¥{{ product.fullPrice.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!(currentCatalog.metadataList && currentCatalog.metadataList.length > 0)" class="empty-products">
              <p>该分类暂无可用套餐</p>
            </div>
          </div>
        </div>

        <!-- 右列：购买表单 -->
        <div class="buy-right-column">
          <!-- 购买操作表单 -->
          <div class="buy-operation-panel">
            <div v-if="!buyFormVisible" class="buy-operation-placeholder">
              <p>请选择左侧的套餐</p>
            </div>
            <BuyOperation
              ref="buyOperationRef"
              :title="buyFormTitle"
              :title-color="buyFormTitleColor"
              @close="handleBuyClose"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getProductCatelog } from '@/api/product'
import type { ProductCatalogVO, ProductCatalogMetadataVO, ProductItem } from '@/types/product'
import BuyOperation from '@/components/BuyOperation.vue'

const route = useRoute()

// 状态
const loading = ref(false)
const error = ref<string>('')
const productMetadataList = ref<ProductCatalogVO[]>([])
const selectedCatalogId = ref<number | null>(null)
const currentProducts = ref<ProductItem[]>([])
const selectedProduct = ref<ProductItem | null>(null)

// 购买表单是否展开
const buyFormVisible = ref(false)

// 购买操作组件引用
const buyOperationRef = ref<InstanceType<typeof BuyOperation>>()

// 当前选中的分类
const currentCatalog = computed(() => {
  return productMetadataList.value.find(c => c.id === selectedCatalogId.value) || null
})

// 获取 URL 参数
const urlProductId = computed(() => {
  const pid = route.query.pid
  return pid ? Number(pid) : null
})

const urlMetadataId = computed(() => {
  const mid = route.query.mid
  return mid ? Number(mid) : null
})

// 获取套餐带宽标签（取第一个产品的 uiConfig.tag）
const getBandwidthTag = (metadata: ProductCatalogMetadataVO): string => {
  return metadata.products?.[0]?.uiConfig?.tag || ''
}

// 分类描述映射（与 Package.vue 一致）
const categoryDescriptions: Record<string, string> = {
  普通版: '项目独享，同项目IP去重\n可固定线路，可随机分配\n网络稳定，网速快，地区多',
  独享版: '真独享，全网唯一，每次获取全新IP\n可固定地区，可随机分配，独享带宽\n网速快，地区极多，IP极多'
}

// 获取分类描述
const getCategoryDescription = (catalog: ProductCatalogVO): string => {
  return categoryDescriptions[catalog.name || ''] || ''
}

// 获取分类名字体颜色（uiConfig.primaryColor）
const getCategoryNameColor = (catalog: ProductCatalogVO): string => {
  return catalog.uiConfig?.primaryColor || '#667eea'
}

// 购买表单标题：当前分类名
const buyFormTitle = computed(() => currentCatalog.value?.name || '套餐购买')

// 购买表单标题颜色：当前分类主色
const buyFormTitleColor = computed(() => {
  const catalog = currentCatalog.value
  return catalog ? getCategoryNameColor(catalog) : '#667eea'
})

// 获取产品目录
const fetchProductMetadata = async () => {
  loading.value = true
  error.value = ''
  let defaultProduct: ProductItem | null = null

  try {
    const catalogs = await getProductCatelog()
    productMetadataList.value = catalogs

    // 如果存在 url 参数（mid 对应元数据节点 ID）
    if (urlMetadataId.value) {
      const found = catalogs.find(c => (c.metadataList || []).some(m => m.id === urlMetadataId.value))
      if (found) {
        selectCategory(found)
      }
    } else if (catalogs.length > 0 && catalogs[0].id) {
      // 默认选中第一个分类
      selectCategory(catalogs[0])
      // 默认选中第一个分类的第一个产品
      if (currentProducts.value.length > 0) {
        defaultProduct = currentProducts.value[0]
        selectedProduct.value = defaultProduct
      }
    }
  } catch (err) {
    error.value = '获取产品列表失败，请稍后重试'
    console.error('Failed to fetch catalog:', err)
  } finally {
    loading.value = false
  }

  // 默认展开第一个产品的购买表单（等组件挂载后再调用 open）
  if (defaultProduct) {
    buyFormVisible.value = true
    await nextTick()
    buyOperationRef.value?.open(defaultProduct)
  }
}

// 选择分类并切换产品列表
const selectCategory = (catalog: ProductCatalogVO) => {
  if (!catalog.id) return

  selectedCatalogId.value = catalog.id
  currentProducts.value = catalog.metadataList?.flatMap(m => m.products || []) || []

  // 如果有 URL 参数 productId，自动选中对应产品
  if (urlProductId.value) {
    const found = currentProducts.value.find(p => p.id === urlProductId.value)
    if (found) {
      selectedProduct.value = found
    }
  }
}

// 立即购买：选中产品并展开右侧购买表单
const handleBuy = (product: ProductItem) => {
  selectedProduct.value = product
  buyFormVisible.value = true
  buyOperationRef.value?.open(product)
}

// 关闭购买表单（由 BuyOperation 发出 close 时重置选中态）
const handleBuyClose = () => {
  buyFormVisible.value = false
  selectedProduct.value = null
}

// 生命周期
onMounted(() => {
  fetchProductMetadata()
})
</script>

<style scoped>
.buy-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 60px);
}

.buy-header {
  text-align: center;
  margin-bottom: 30px;
}

.buy-header h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.buy-header p {
  color: #7f8c8d;
  font-size: 14px;
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

/* 分类标签页 */
.category-tabs {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
}

.category-tab {
  flex: 1;
  min-width: 200px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: #fff;
  border: 2px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.category-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-tab.active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.category-tab h3 {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: bold;
}

.category-tab-desc {
  margin: 0;
  font-size: 13px;
  color: #7f8c8d;
  white-space: pre-line;
  line-height: 1.5;
}

/* 总体左右布局 */
.buy-page-layout {
  display: grid;
  grid-template-columns: 1fr 460px;
  gap: 20px;
  align-items: start;
}

/* 左列 */
.buy-left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 右列 */
.buy-right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px;
  padding: 10px 0;
  align-self: start;
}

/* 查看地区链接 */
.view-regions-link {
  display: block;
  width: fit-content;
  margin-bottom: 20px;
  padding: 6px 56px;
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

/* 左侧：元数据列表 */
.metadata-list {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

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

/* 套餐名 + 带宽 */
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-option:hover {
  border-color: #667eea;
  background: #f0f3ff;
}

.product-option.selected {
  border-color: #667eea;
  background: #f0f3ff;
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

/* 右侧：购买操作面板 */
.buy-operation-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  padding: 40px 20px;
  background: white;
  border: 2px dashed #dcdfe6;
  border-radius: 15px;
  color: #909399;
  font-size: 15px;
  text-align: center;
}

.buy-operation-placeholder p {
  margin: 0;
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
  .buy-container {
    padding: 20px 15px;
  }

  .buy-header h2 {
    font-size: 24px;
  }

  .category-tabs {
    flex-direction: column;
  }

  .category-tab {
    min-width: 100%;
  }

  .buy-page-layout {
    grid-template-columns: 1fr;
  }

  .buy-right-column {
    position: static;
  }
}
</style>
