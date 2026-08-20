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
      title="套餐购买"
      class="buy-dialog"
      destroy-on-close
      @opened="handleDialogOpen"
    >
      <div v-if="selectedProduct" class="dialog-content">
        <!-- 产品信息摘要 -->
        <div class="product-summary">
          <h3>{{ selectedProduct.name }}</h3>
          <p class="product-duration">套餐时长：{{ selectedProduct.duration }}天</p>
        </div>

        <el-form :model="formData" label-width="100px" size="default">
          <!-- 1. 账号 -->
          <el-form-item label="账号">
            <div style="display: flex; gap: 10px;">
              <el-input v-model="formData.username" placeholder="请输入账号" />
              <el-button @click="generateRandomUsername">随机生成</el-button>
            </div>
          </el-form-item>

          <!-- 2. 密码 -->
          <el-form-item label="密码">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>

          <!-- 3. 连接数 -->
          <el-form-item label="连接数">
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-input-number v-model="formData.usageCount" :min="1" :max="100" />
              <el-popover placement="right" :width="200" trigger="hover" content="多开需要多买连接数">
                <template #reference>
                  <el-icon style="cursor: pointer; color: #909399;"><Question-Filled /></el-icon>
                </template>
              </el-popover>
            </div>
          </el-form-item>

          <!-- 4. 绑定项目 -->
          <el-form-item label="绑定项目">
            <el-select
              v-model="formData.gameId"
              filterable
              placeholder="--输入首字母查询---"
              style="width: 100%;"
            >
              <el-option
                v-for="game in gameList"
                :key="game.id"
                :label="game.name"
                :value="game.id"
              />
            </el-select>
          </el-form-item>

          <!-- 5. 绑定地区 -->
          <el-form-item label="绑定地区">
            <el-select
              v-model="formData.locationIds"
              multiple
              placeholder="请选择地区"
              style="width: 100%;"
              :value-format="Number"
            >
              <el-option-group
                v-for="province in locationOptions"
                :key="province.id"
                :label="province.pname"
              >
                <el-option
                  v-for="city in province.cityList"
                  :key="city.id"
                  :label="city.cname"
                  :value="city.id"
                />
              </el-option-group>
            </el-select>
            <div v-if="formData.locationIds.length > 0" class="selected-locations">
              已选择：{{ getLocationDisplay() }}
            </div>
          </el-form-item>

          <!-- 6. 账单合计 -->
          <el-form-item label="账单合计">
            <div class="price-detail">
              <div class="total-price-row">
                <span class="label">实际总价：</span>
                <span class="total-price" :style="{ color: currentCatalog?.uiConfig?.primaryColor }">
                  ¥{{ totalPrice.toFixed(2) }}元
                </span>
              </div>
              <div v-if="userInfo.dividendRatio && userInfo.dividendRatio > 0" class="discount-price-row">
                <span class="label">实际应付：</span>
                <span class="discount-price" :style="{ color: currentCatalog?.uiConfig?.primaryColor }">
                  ¥{{ actualPayPrice.toFixed(2) }}元
                </span>
                <span class="discount-tag">（享{{ (1 - userInfo.dividendRatio) * 100 }}折优惠）</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <button @click="showPaymentDialog = false" class="cancel-btn">取消</button>
          <button 
            @click="handleConfirmOrder" 
            class="confirm-btn"
            :style="{ backgroundColor: currentCatalog?.uiConfig?.primaryColor }"
          >
            确认
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProductMetadata, getProductsByMetadataId } from '@/api/product'
import { requestGames } from '@/api/packages'
import type { ProductMetadataItem, ProductItem } from '@/types/product'
import type { Province, City } from '@/types/region'
import type { GameDTO } from '@/types/packages'
import { userInfo } from '@/reactive/user'

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

// 游戏列表和地区数据
const gameList = ref<GameDTO[]>([])
const locationOptions = ref<Province[]>([])
const allCitiesMap = ref<Map<number, City>>(new Map())

// 表单数据
const formData = ref({
  username: '',
  password: '',
  usageCount: 1,
  gameId: undefined as number | undefined,
  locationIds: [] as number[]
})

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

// 获取产品目录
const fetchProductMetadata = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const productMetadata = await getProductMetadata()
    productMetadataList.value = productMetadata
      // 如果存在url参数
    if (urlMetadataId.value) {      
      const found = productMetadataList.value.find(p => p.id === urlMetadataId.value);
      if (found) {
        await selectCategory(found);
      }
    } else if (productMetadata.length > 0 && productMetadata[0].id) {
      // 默认选中第一个分类
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

// 弹窗打开时加载游戏列表
const handleDialogOpen = async () => {
  if (gameList.value.length === 0) {
    try {
      const gameData = await requestGames()
      if (Array.isArray(gameData)) {
        gameList.value = gameData.sort((a, b) => 
          (a.name || '').localeCompare(b.name || '', 'zh-CN')
        )
      }
    } catch (err) {
      console.error('获取游戏列表失败:', err)
    }
  }
}

// 随机生成账号（预留实现）
const generateRandomUsername = () => {
  // TODO: 实现随机账号生成逻辑
  console.log('生成随机账号')
}

// 获取地区显示文本
const getLocationDisplay = () => {
  const selectedIds = formData.value.locationIds
  if (selectedIds.length === 0) return ''
  
  const firstCity = allCitiesMap.value.get(selectedIds[0])
  if (selectedIds.length === 1) {
    return firstCity?.cname || ''
  }
  return `${firstCity?.cname || ''}+${selectedIds.length - 1}个`
}

// 计算实际总价 = 连接数 * 单价
const totalPrice = computed(() => {
  if (!selectedProduct.value || !selectedProduct.value.price) return 0
  return formData.value.usageCount * selectedProduct.value.price
})

// 计算实际应付 = 连接数 * 单价 * (1 - 折扣比率)
const actualPayPrice = computed(() => {
  if (!selectedProduct.value || !selectedProduct.value.price) return 0
  const ratio = userInfo.dividendRatio || 0
  return formData.value.usageCount * selectedProduct.value.price * (1 - ratio)
})

// 确认订单
const handleConfirmOrder = () => {
  if (!selectedProduct.value) return
  
  // TODO: 调用创建订单接口
  console.log('确认订单', {
    productId: selectedProduct.value.id,
    metadataId: selectedProduct.value.metadataId,
    ...formData.value
  })
  
  alert('订单确认功能待实现')
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
.buy-dialog {
  /* 响应式宽度：移动端 90%，大屏幕最大 540px */
  width: 90%;
  max-width: 540px;
}

.dialog-content {
  padding: 10px 0;
}

.product-summary {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
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

/* 价格明细样式 */
.price-detail {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.total-price-row,
.discount-price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.total-price-row:last-child,
.discount-price-row:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
}

.discount-price {
  font-size: 20px;
  font-weight: bold;
}

.discount-tag {
  font-size: 12px;
  color: #67c23a;
  background: #f0f9eb;
  padding: 2px 8px;
  border-radius: 10px;
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

.selected-locations {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
}
