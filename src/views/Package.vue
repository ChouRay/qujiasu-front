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
      <button @click="fetchProducts" class="retry-btn">重试</button>
    </div>

    <!-- 产品目录 -->
    <div v-else class="catalog-container">
      <div 
        v-for="catalog in productMetadataList" 
        :key="catalog.id" 
        class="catalog-section"
      >
        <!-- 目录标题 -->
        <div class="catalog-header" :style="{ backgroundColor: catalog.uiConfig?.primaryColor }">
          <h2>{{ catalog.name }}</h2>
          <p>{{ catalog.description }}</p>
        </div>

        <!-- 产品列表 -->
        <div class="products-grid">
          <div 
            v-for="product in getProductDetails(catalog.id!)" 
            :key="product.id"
            class="product-card"
            :class="{ selected: selectedProduct?.id === product.id }"
            @click="selectProduct(product)"
          >
            <!-- 标签 -->
            <div 
              v-if="product.tag" 
              class="product-tag"
              :style="{ backgroundColor: catalog.uiConfig?.primaryColor }"
            >
              {{ product.tag }}
            </div>

            <!-- 产品信息 -->
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-ttips">{{ product.ttips }}</p>
              
              <!-- 价格 -->
              <div class="price-section">
                <span class="current-price" :style="{ color: catalog.uiConfig?.primaryColor }">
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
              <p v-if="product.btips" class="product-btips" :style="{ color: catalog.uiConfig?.secondaryColor }">
                {{ product.btips }}
              </p>
            </div>

            <!-- 选择按钮 -->
            <button 
              class="select-btn"
              :style="{ 
                backgroundColor: selectedProduct?.id === product.id ? catalog.uiConfig?.primaryColor : 'transparent',
                borderColor: catalog.uiConfig?.primaryColor,
                color: selectedProduct?.id === product.id ? '#fff' : catalog.uiConfig?.primaryColor
              }"
            >
              {{ selectedProduct?.id === product.id ? '已选择' : '选择' }}
            </button>
          </div>

          <!-- 空状态 -->
          <div v-if="getProductDetails(catalog.id!).length === 0" class="empty-products">
            <p>该分类暂无可用套餐</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购买栏 -->
    <div v-if="selectedProduct" class="purchase-bar">
      <div class="purchase-info">
        <span class="selected-name">{{ selectedProduct.name }}</span>
        <span class="selected-duration">{{ selectedProduct.duration }}天</span>
        <span class="selected-price">¥{{ selectedProduct.price?.toFixed(2) }}</span>
      </div>
      <button class="buy-btn" @click="handleBuy">立即购买</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProductMetadata, getProductsByMetadataId } from '@/api/product'
import type { ProductMetadataItem, ProductItem } from '@/types/product'

// 状态
const loading = ref(false)
const error = ref<string>('')
const productMetadataList = ref<ProductMetadataItem[]>([])
const productsMap = ref<Map<number, ProductItem[]>>(new Map())
const selectedProduct = ref<ProductItem | null>(null)

// 获取产品目录
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const productMetadata = await getProductMetadata()
    productMetadataList.value = productMetadata
    
    // 并行获取每个目录下的产品
    const promises = productMetadata.map(async (catalog) => {
      if (catalog.id) {
        const products = await getProductsByMetadataId(catalog.id)
        productsMap.value.set(catalog.id, products)
      }
    })
    
    await Promise.all(promises)
  } catch (err) {
    error.value = '获取产品列表失败，请稍后重试'
    console.error('Failed to fetch catalog:', err)
  } finally {
    loading.value = false
  }
}

// 根据 ID 获取产品详情
const getProductDetails = (id: number) => {
  return productsMap.value.get(id) || []
}

// 选择产品
const selectProduct = (product: ProductItem) => {
  if (selectedProduct.value?.id === product.id) {
    selectedProduct.value = null
  } else {
    selectedProduct.value = product
  }
}

// 购买处理
const handleBuy = () => {
  if (selectedProduct.value) {
    alert(`您选择了：${selectedProduct.value.name} - ¥${selectedProduct.value.price?.toFixed(2)}`)
    // TODO: 实现购买逻辑
  }
}

// 生命周期
onMounted(() => {
  fetchProducts()
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
.loading-container {
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

.catalog-section {
  margin-bottom: 50px;
}

.catalog-header {
  padding: 30px;
  border-radius: 15px 15px 0 0;
  color: white;
  text-align: center;
}

.catalog-header h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.catalog-header p {
  font-size: 14px;
  opacity: 0.9;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

/* 选择按钮 */
.select-btn {
  width: 100%;
  padding: 12px;
  border: 2px solid;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.select-btn:hover {
  opacity: 0.8;
}

/* 空状态 */
.empty-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

/* 底部购买栏 */
.purchase-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 18px;
}

.selected-name {
  font-weight: bold;
  color: #2c3e50;
}

.selected-duration {
  color: #7f8c8d;
}

.selected-price {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}

.buy-btn {
  padding: 15px 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .package-page {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .purchase-bar {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }

  .purchase-info {
    flex-wrap: wrap;
    justify-content: center;
  }

  .buy-btn {
    width: 100%;
  }
}
</style>
