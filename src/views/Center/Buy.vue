<template>
  <div class="buy-container">
    <div class="buy-header">
      <h2>选择您的套餐</h2>
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
      <!-- 分类列表 -->
      <div class="category-tabs">
        <div 
          v-for="catalog in productMetadataList" 
          :key="catalog.id"
          class="category-tab"
          :class="{ active: selectedCatalogId === catalog.id }"
          :style="{ 
            borderColor: selectedCatalogId === catalog.id ? catalog.uiConfig?.primaryColor : 'transparent',
            backgroundColor: selectedCatalogId === catalog.id ? catalog.uiConfig?.primaryColor + '15' : '#f5f7fa'
          }"
          @click="selectCategory(catalog)"
        >
          <h3 :style="{ color: catalog.uiConfig?.primaryColor || '#2c3e50' }">
            {{ catalog.name }}
          </h3>
          <p>{{ catalog.description }}</p>
        </div>
      </div>

      <!-- 当前选中的分类详情 -->
      <div v-if="currentCatalog" class="catalog-detail">
        <!-- 目录标题 -->
        <div class="catalog-header" :style="{ backgroundColor: currentCatalog.uiConfig?.primaryColor }">
          <h2>{{ currentCatalog.name }}</h2>
        </div>

        <!-- 产品列表加载状态 -->
        <div v-if="productsLoading" class="products-loading">
          <div class="loading-spinner"></div>
          <p>加载产品中...</p>
        </div>

        <!-- 产品列表 -->
        <div v-else class="products-grid">
          <div 
            v-for="product in currentProducts" 
            :key="product.id"
            class="product-card"
            :class="{ selected: selectedProduct?.id === product.id }"
            @click="selectProduct(product)"
          >
            <!-- 标签 -->
            <div 
              v-if="product.tag" 
              class="product-tag"
              :style="{ backgroundColor: currentCatalog.uiConfig?.primaryColor }"
            >
              {{ product.tag }}
            </div>

            <!-- 产品信息 -->
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-ttips">{{ product.ttips }}</p>
              
              <!-- 价格 -->
              <div class="price-section">
                <span class="current-price" :style="{ color: currentCatalog.uiConfig?.primaryColor }">
                  ¥{{ product.price?.toFixed(2) }}
                </span>
                <span v-if="product.fullPrice" class="original-price">
                  ¥{{ product.fullPrice.toFixed(2) }}
                </span>
              </div>

              <!-- 时长 -->
              <div class="duration-badge">
                {{ product.duration }}天
              </div>

              <!-- 底部提示 -->
              <p v-if="product.btips" class="product-btips" :style="{ color: currentCatalog.uiConfig?.secondaryColor }">
                {{ product.btips }}
              </p>
            </div>

            <!-- 立即购买按钮 -->
            <button 
              class="buy-btn"
              :style="{ 
                backgroundColor: currentCatalog.uiConfig?.primaryColor,
                color: 'white'
              }"
              @click.stop="handleBuy(product)"
            >
              立即购买
            </button>
          </div>

          <!-- 空状态 -->
          <div v-if="currentProducts.length === 0" class="empty-products">
            <p>该分类暂无可用套餐</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 购买详情弹窗 -->
    <el-dialog 
      v-model="showPaymentDialog" 
      title="确认订单"
      width="90%"
      :max-width="'500px'"
      destroy-on-close
    >
      <div v-if="selectedProduct" class="dialog-content">
        <div class="product-summary">
          <h3>{{ selectedProduct.name }}</h3>
          <p class="product-duration">{{ selectedProduct.duration }}天</p>
          
          <div class="price-info">
            <div class="current-price-row">
              <span class="label">应付金额：</span>
              <span class="current-price" :style="{ color: currentCatalog?.uiConfig?.primaryColor }">
                ¥{{ selectedProduct.price?.toFixed(2) }}
              </span>
            </div>
            <div v-if="selectedProduct.fullPrice" class="original-price-row">
              <span class="label">原价：</span>
              <span class="original-price">¥{{ selectedProduct.fullPrice.toFixed(2) }}</span>
            </div>
          </div>
          
          <p v-if="selectedProduct.btips" class="tips" :style="{ color: currentCatalog?.uiConfig?.secondaryColor }">
            {{ selectedProduct.btips }}
          </p>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <button @click="showPaymentDialog = false" class="cancel-btn">取消</button>
          <button 
            @click="handleConfirmPayment" 
            class="confirm-btn"
            :style="{ backgroundColor: currentCatalog?.uiConfig?.primaryColor }"
          >
            确认支付
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductMetadata, getProductsByMetadataId } from '@/api/product'
import type { ProductMetadataItem, ProductItem } from '@/types/product'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const productsLoading = ref(false)
const error = ref<string>('')
const productMetadataList = ref<ProductMetadataItem[]>([])
const selectedCatalogId = ref<number | null>(null)
const currentProducts = ref<ProductItem[]>([])
const selectedProduct = ref<ProductItem | null>(null)
const showPaymentDialog = ref(false)

// 当前选中的分类
const currentCatalog = computed(() => {
  return productMetadataList.value.find(c => c.id === selectedCatalogId.value) || null
})

// 获取 URL 参数
const urlProductId = computed(() => {
  const pid = route.query.productId
  return pid ? Number(pid) : null
})

// 获取产品目录
const fetchProductMetadata = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const productMetadata = await getProductMetadata()
    productMetadataList.value = productMetadata
    
    // 默认选中第一个分类
    if (productMetadata.length > 0 && productMetadata[0].id) {
      await selectCategory(productMetadata[0])
    }
  } catch (err) {
    error.value = '获取产品列表失败，请稍后重试'
    console.error('Failed to fetch catalog:', err)
  } finally {
    loading.value = false
  }
}

// 选择分类并加载产品
const selectCategory = async (catalog: ProductMetadataItem) => {
  if (!catalog.id) return
  
  selectedCatalogId.value = catalog.id
  productsLoading.value = true
  
  try {
    const products = await getProductsByMetadataId(catalog.id)
    currentProducts.value = products
    
    // 如果有 URL 参数 productId，自动选中对应产品
    if (urlProductId.value) {
      const found = products.find(p => p.id === urlProductId.value)
      if (found) {
        selectedProduct.value = found
      }
    }
  } catch (err) {
    console.error('Failed to fetch products for catalog:', catalog.id, err)
    currentProducts.value = []
  } finally {
    productsLoading.value = false
  }
}

// 选择产品（用于弹窗展示）
const selectProduct = (product: ProductItem) => {
  selectedProduct.value = product
}

// 立即购买
const handleBuy = (product: ProductItem) => {
  selectedProduct.value = product
  showPaymentDialog.value = true
}

// 确认支付
const handleConfirmPayment = () => {
  if (!selectedProduct.value) return
  
  // TODO: 调用支付接口
  console.log('发起支付', {
    productId: selectedProduct.value.id,
    metadataId: selectedProduct.value.metadataId,
    price: selectedProduct.value.price
  })
  
  alert(`正在发起支付：${selectedProduct.value.name}`)
  showPaymentDialog.value = false
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
  margin-bottom: 30px;
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
  border-left: 4px solid transparent;
  text-align: center;
}

.category-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-tab.active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-tab h3 {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: bold;
}

.category-tab p {
  font-size: 13px;
  color: #7f8c8d;
}

/* 目录详情 */
.catalog-detail {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.catalog-header {
  padding: 20px;
  color: white;
  text-align: center;
}

.catalog-header h2 {
  font-size: 24px;
  margin: 0;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* 产品卡片 */
.product-card {
  position: relative;
  padding: 25px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-card.selected {
  border-color: currentColor;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 产品标签 */
.product-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* 产品信息 */
.product-info h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.product-ttips {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
}

/* 价格区域 */
.price-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
}

.current-price {
  font-size: 28px;
  font-weight: bold;
}

.original-price {
  font-size: 16px;
  color: #95a5a6;
  text-decoration: line-through;
}

/* 时长徽章 */
.duration-badge {
  display: inline-block;
  padding: 5px 15px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

/* 底部提示 */
.product-btips {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 立即购买按钮 */
.buy-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-btn:hover {
  opacity: 0.8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 购买详情弹窗 */
.dialog-content {
  padding: 10px 0;
}

.product-summary h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.product-duration {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.price-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.current-price-row,
.original-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.current-price-row:last-child,
.original-price-row:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
}

.original-price {
  font-size: 16px;
  color: #95a5a6;
  text-decoration: line-through;
}

.tips {
  font-size: 13px;
  color: #e67e22;
  margin-top: 15px;
  padding: 10px;
  background: #fff3cd;
  border-radius: 6px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 24px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #c0c4cc;
  color: #303133;
}

.confirm-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  opacity: 0.8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 空状态 */
.empty-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
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

  .products-grid {
    grid-template-columns: 1fr;
  }
  
  /* 移动端弹窗样式 */
  .dialog-footer {
    flex-direction: column;
  }
  
  .cancel-btn,
  .confirm-btn {
    width: 100%;
  }
}
</style>
