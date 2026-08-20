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
      :width="dialogWidth"      
      destroy-on-close
      @opened="handleDialogOpen"
    >
      <div v-if="selectedProduct" class="dialog-content">
        <!-- 产品信息摘要 -->
        <div class="product-summary">
          <h3>{{ selectedProduct.name }}</h3>
          <p class="product-duration">套餐时长：{{ selectedProduct.duration }}天</p>
        </div>

        <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" size="default">
          <!-- 1. 账号 -->
          <el-form-item label="设置账号" prop="username">
            <div style="display: flex; gap: 10px;">
              <el-input v-model="formData.username" placeholder="请输入 6-20 位的账号" @blur="handleUsernameBlur" />
              <el-button @click="generateRandomUsername" :loading="generatingUsername">随机生成</el-button>
            </div>
            <div v-if="usernameAvailabilityError" class="username-error-tip">{{ usernameAvailabilityError }}</div>
          </el-form-item>

          <!-- 2. 密码 -->
          <el-form-item label="设置密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholder="请输入6-18位密码"/>
          </el-form-item>

          <!-- 3. 授权数量 -->
          <el-form-item label="授权数量">
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
          <el-form-item label="绑定项目" prop="gameId">
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
              placeholder="请选择地区(可不选)"
              style="width: 100%;"
              :value-format="Number"
            >
              <el-option-group
                v-for="province in locationOptions"
                :key="province.id"
                :label="province.pname"
              >
                <el-option
                  v-for="city in province.cities"
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
                <span v-if="userInfo.dividendRatio && userInfo.dividendRatio > 0" class="original-total-price">
                  ¥{{ totalPrice.toFixed(2) }}元
                </span>
                <span v-else class="total-price" style="color: red">
                  ¥{{ totalPrice.toFixed(2) }}元
                </span>
                <span v-if="userInfo.dividendRatio && userInfo.dividendRatio > 0" class="actual-pay-info">
                  （实际应付：<span class="discount-price" style="color: red">¥{{ actualPayPrice.toFixed(2) }}元</span>）
                </span>
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
            style="backgroundColor: #409eff"
          >
            确认
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- 订单详情及支付确认弹窗 -->
    <el-dialog
      v-model="showPaymentConfirmDialog"
      title="订单详情"
      :width="dialogWidth"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="payment-confirm-content">
        <!-- 订单信息 -->
        <div class="order-info-section">
          <div class="info-row">
            <span class="info-label">账号：</span>
            <span class="info-value">{{ formData.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">密码：</span>
            <span class="info-value">{{ formData.password }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">名称：</span>
            <span class="info-value">{{ selectedProduct?.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">数量：</span>
            <span class="info-value">{{ formData.usageCount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">时长：</span>
            <span class="info-value">{{ selectedProduct?.duration }}天</span>
          </div>
          <div class="info-row">
            <span class="info-label">订单总价：</span>
            <span class="info-value price-highlight">{{ actualPayPrice.toFixed(2) }}元</span>
          </div>
        </div>

        <!-- 余额和抵用券 -->
        <div class="balance-section">
          <div class="balance-item">
            余额：<span style="color:rgb(225, 37, 27); font-weight: bold;">{{ userInfo.userBalance?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="balance-item">
            抵用券：<span style="color:rgb(225, 37, 27); font-weight: bold;">{{ userInfo.userReward?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>

        <!-- 在线支付金额计算 -->
        <div class="online-pay-section">
          <div class="pay-calculation">
            <span>在线支付金额 = 订单总价 - (抵用券 + 余额)</span>
            <span class="pay-amount-display">
              = {{ actualPayPrice.toFixed(2) }} - ({{ (userInfo.userReward || 0).toFixed(2) }} + {{ (userInfo.userBalance || 0).toFixed(2) }})
              = <span :class="{'pay-amount-zero': onlinePayAmount <= 0}">{{ onlinePayAmountDisplay }}</span>
            </span>
          </div>
        </div>

        <!-- 支付方式选择 -->
        <div class="payment-methods-section">
          <div class="section-title-small">在线支付</div>
          <div class="payment-methods">
            <div
              class="method-item"
              :class="{ active: payMethod === 'ALI_PAY', disabled: onlinePayAmount <= 0 }"
              @click="selectPayMethod('ALI_PAY')"
            >
              <img src="@/assets/images/alipay-ico.png" alt="支付宝" class="method-icon" />
              <span class="method-name">支付宝</span>
              <el-icon v-if="payMethod === 'ALI_PAY'" class="check-icon"><CircleCheckFilled /></el-icon>
            </div>

            <div
              class="method-item"
              :class="{ active: payMethod === 'WECHAT_PAY', disabled: onlinePayAmount <= 0 }"
              @click="selectPayMethod('WECHAT_PAY')"
            >
              <img src="@/assets/images/wxpay-ico.png" alt="微信" class="method-icon" />
              <span class="method-name">微信</span>
              <el-icon v-if="payMethod === 'WECHAT_PAY'" class="check-icon"><CircleCheckFilled /></el-icon>
            </div>
          </div>
          <div v-if="wechatPayDisabled" class="wechat-limit-tip">
            <el-icon><WarningFilled /></el-icon>
            微信支付限额 200 元，请改用支付宝或减少支付金额
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button @click="showPaymentConfirmDialog = false" class="cancel-btn">取消</button>
          <button 
            @click="handleFinalConfirm" 
            class="confirm-btn payment-confirm-btn"
            :disabled="onlinePayAmount <= 0 || wechatPayDisabled"
          >
            确认支付
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProductMetadata, getProductsByMetadataId } from '@/api/product'
import { requestGames, requestLocations } from '@/api/packages'
import type { ProductMetadataItem, ProductItem } from '@/types/product'
import type { Province, City } from '@/types/region'
import type { GameDTO } from '@/types/packages'
import { userInfo } from '@/reactive/user'
import { isMobile } from '@/utils/util'
import { checkUsernameAvilability, requestPackageOrders } from '@/api/order'
import type { PackageOrderRequest, PaySource } from '@/types/order'
import { OrderType } from '@/types/order'
import { ElMessage, FormRules } from 'element-plus'
import { getErrorMessage } from '@/utils/errorMessage'
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
const showPaymentConfirmDialog = ref(false)
const dialogWidth = ref(isMobile(navigator.userAgent) ? '90%' : 560)

// 游戏列表和地区数据
const gameList = ref<GameDTO[]>([])
const locationOptions = ref<Province[]>([])
const allCitiesMap = ref<Map<number, City>>(new Map())

// 表单引用
const formRef = ref<any>(null)

// 表单数据
const formData = ref({
  username: '',
  password: '',
  usageCount: 1,
  gameId: undefined as number | undefined,
  locationIds: [] as number[]
})

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '账号应为 6-20 位字母和数字组合', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '密码仅限数字和字母', trigger: 'blur' }
  ],
  gameId: [
    { required: true, message: '请选择绑定项目', trigger: 'change' }
  ]
}

// 随机生成账号状态
const generatingUsername = ref(false)
const usernameAvailabilityError = ref('')
const checkingUsername = ref(false)

// 检查账号可用性的处理函数（在失去焦点时调用）
const handleUsernameBlur = async () => {
  const username = formData.value.username.trim()
  
  // 如果账号为空，不进行检查
  if (!username) {
    usernameAvailabilityError.value = ''
    return
  }
  
  // 验证账号格式
  const usernameRegex = /^[a-zA-Z0-9]{6,20}$/
  if (!usernameRegex.test(username)) {
    usernameAvailabilityError.value = '账号应为 6-20 位字母和数字组合'
    return
  }
  
  checkingUsername.value = true
  usernameAvailabilityError.value = ''
  
  try {
    const response = await checkUsernameAvilability(username)
    
    // 如果返回了数据，说明账号不可用
    if (response && response.data !== null) {
      usernameAvailabilityError.value = '该账号已被使用，请更换其他账号'
    }
  } catch (error: any) {
    // 400 错误表示账号不可用
    if (error.response?.status === 400) {
      usernameAvailabilityError.value = '该账号已被使用，请更换其他账号'
    } else {
      // 其他错误显示错误信息
      const errorMsg = error.response?.data?.msg || error.message || '检查失败'
      usernameAvailabilityError.value = getErrorMessage(errorMsg, '检查失败')
    }
  } finally {
    checkingUsername.value = false
  }
}

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
  // 重置表单数据
  formData.value = {
    username: '',
    password: '',
    usageCount: 1,
    gameId: undefined,
    locationIds: []
  }
  // 重置验证状态
  usernameAvailabilityError.value = ''
  // 重置支付状态
  payMethod.value = 'ALI_PAY'
  wechatPayDisabled.value = false
  
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

// 监听 gameId 和 metadataId 变化，动态加载地区列表
watch(
  [() => formData.value.gameId, () => selectedProduct.value?.metadataId],
  async ([gameId, metadataId]) => {
    // 清空旧选项和选中值
    locationOptions.value = []
    formData.value.locationIds = []
    
    // 必须同时有 gameId 和 metadataId 才请求
    if (!gameId || !metadataId) {
      return
    }
    
    try {
      const locations = await requestLocations({ gameId, metadataId })
      if (Array.isArray(locations)) {
        locationOptions.value = locations
        // 可选：如果有默认选中的地区，可以在这里设置
        // formData.value.locationIds = [locations[0]?.id].filter(Boolean)
      }
    } catch (err) {
      console.error('获取地区列表失败:', err)
    }
  },
  { immediate: false }
)

// 随机生成账号并检查可用性
const generateRandomUsername = async () => {
  generatingUsername.value = true
  usernameAvailabilityError.value = ''
  
  try {
    // 生成随机账号：前 3 个为 a-z 字符，后 8 个为 0-9 数字
    const generate = () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      const digits = '0123456789'
      let result = ''
      // 前 3 个字母
      for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      // 后 8 个数字
      for (let i = 0; i < 8; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length))
      }
      return result
    }
    
    // 最多尝试 10 次
    const username = generate()      
    try {
      const response = await checkUsernameAvilability(username)
      
      // 状态码 200 且 response.data 为 null 表示可用
      if (!response || response.data === null) {
        formData.value.username = username
        generatingUsername.value = false
        return
      }
    } catch (error: any) {
      // 如果是 400 错误，继续尝试下一个
      if (error.response?.status === 400) {         
      }
      // 其他错误抛出
      throw error
    }
    
    // 尝试 10 次后仍未找到可用账号
    usernameAvailabilityError.value = '生成失败，请手动输入或重试'
    ElMessage.warning('未能生成可用账号，请手动输入')
  } catch (error: any) {
    console.error('生成随机账号失败:', error)
    const errorMsg = error.response?.data?.msg || error.message || '生成失败'
    usernameAvailabilityError.value = getErrorMessage(errorMsg, '生成失败')
    ElMessage.error('生成账号失败：' + getErrorMessage(errorMsg, '生成失败'))
  } finally {
    generatingUsername.value = false
  }
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

// 在线支付金额 = 订单总价 - (抵用券 + 余额)
const onlinePayAmount = computed(() => {
  const balance = userInfo.userBalance || 0
  const reward = userInfo.userReward || 0
  const amount = actualPayPrice.value - (balance + reward)
  return Math.max(0, amount)
})

// 在线支付金额显示
const onlinePayAmountDisplay = computed(() => {
  if (onlinePayAmount.value <= 0) {
    return '0.00 元（全额抵扣）'
  }
  return onlinePayAmount.value.toFixed(2) + '元'
})

// 支付方式
const payMethod = ref<'ALI_PAY' | 'WECHAT_PAY'>('ALI_PAY')

// 微信支付是否被禁用（超过 200 元限额）
const wechatPayDisabled = ref(false)

// 选择支付方式
const selectPayMethod = (method: 'ALI_PAY' | 'WECHAT_PAY') => {
  if (onlinePayAmount.value <= 0) {
    return // 金额为 0 时不能选择支付方式
  }
  
  if (method === 'WECHAT_PAY' && onlinePayAmount.value >= 200) {
    wechatPayDisabled.value = true
    ElMessage.warning('微信支付限额 200 元，请改用支付宝支付')
    return
  }
  
  wechatPayDisabled.value = false
  payMethod.value = method
}

// 确认订单 - 弹出支付详情对话框
const handleConfirmOrder = () => {
  if (!selectedProduct.value) return
  
  // 验证表单
  formRef.value?.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    
    // 检查账号可用性是否有错误
    if (usernameAvailabilityError.value) {
      ElMessage.error('请输入可用的账号')
      return
    }
    
    // 打开支付确认对话框
    showPaymentConfirmDialog.value = true
    
    // 重置支付方式为默认支付宝
    payMethod.value = 'ALI_PAY'
    wechatPayDisabled.value = false
  })
}

// 最终确认支付
const handleFinalConfirm = async () => {
  if (onlinePayAmount.value <= 0 || wechatPayDisabled.value) {
    // 全额抵扣情况，直接创建订单
    if (onlinePayAmount.value <= 0) {
      await createOrderAndPay()
      return
    }
    return
  }
  
  // 需要在线支付的情况
  await createOrderAndPay()
}

// 创建订单并发起支付
const createOrderAndPay = async () => {
  if (!selectedProduct.value) return
  
  try {
    // 构建订单请求数据
    const orderData: PackageOrderRequest = {
      orderType: OrderType.PACKAGE_ORDER,
      username: formData.value.username,
      password: formData.value.password,
      usageCount: formData.value.usageCount,
      productId: selectedProduct.value.id || 0,
      gameBind: {
        username: formData.value.username,
        gameId: formData.value.gameId || 0,
        locationIdList: formData.value.locationIds
      },
      paySource: payMethod.value as PaySource,
      tradeType: isMobile(navigator.userAgent) ? 'WAP' : 'WEB'
    }
    
    console.log('创建订单:', orderData)
    
    // 调用创建订单接口
    const response = await requestPackageOrders(orderData)
    
    if (response && response.data) {
      const orderInfo = response.data
      
      // 如果需要在线支付且金额大于 0
      if (onlinePayAmount.value > 0) {
        // 跳转到支付页面或打开支付二维码
        // 这里根据实际支付流程处理
        ElMessage.success('订单创建成功，正在跳转支付...')
        
        // 如果有支付链接，直接跳转
        if (orderInfo.payUrl) {
          window.location.href = orderInfo.payUrl
        } else if (orderInfo.qrCode) {
          // 显示二维码弹窗
          // TODO: 实现二维码弹窗
          console.log('支付二维码:', orderInfo.qrCode)
        }
      } else {
        // 全额抵扣，直接成功
        ElMessage.success('订单创建成功，已使用余额和抵用券全额抵扣')
        showPaymentConfirmDialog.value = false
        showPaymentDialog.value = false
        // 刷新用户信息
        // TODO: 刷新 userInfo
      }
    }
  } catch (error: any) {
    console.error('创建订单失败:', error)
    const errorMsg = error.response?.data?.msg || error.message || '创建订单失败'
    ElMessage.error(getErrorMessage(errorMsg, '创建订单失败'))
  }
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

.dialog-content {
  padding: 20px 24px;
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

.total-price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
}

.total-price,
.discount-price {
  font-size: 20px;
  font-weight: bold;
}

.original-total-price {
  font-size: 20px;
  font-weight: bold;
  text-decoration: line-through;
}

.actual-pay-info {
  font-size: 14px;
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

/* 账号可用性错误提示*/
.username-error-tip {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

/* 支付确认弹窗样式 */
.payment-confirm-content {
  padding: 10px 0;
}

.order-info-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  color: #606266;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  
  &.price-highlight {
    color: rgb(225, 37, 27);
    font-size: 16px;
    font-weight: bold;
  }
}

.balance-section {
  display: flex;
  gap: 20px;
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-item {
  font-size: 14px;
  color: #606266;
}

.online-pay-section {
  padding: 15px;
  background: #ecf5ff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.pay-calculation {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.pay-amount-display {
  font-weight: bold;
  color: #303133;
}

.pay-amount-zero {
  color: #67c23a;
  font-size: 16px;
}

.section-title-small {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.payment-methods-section {
  margin-bottom: 10px;
}

.payment-methods {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.method-item {
  flex: 1;
  min-width: 150px;
  max-width: 200px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover:not(.disabled) {
    border-color: #409EFF;
    background-color: #f5f7fa;
  }

  &.active:not(.disabled) {
    border-color: #409EFF;
    background-color: #ecf5ff;

    .check-icon {
      opacity: 1;
      transform: scale(1);
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f7fa;
  }

  .method-icon {
    width: 28px;
    height: 28px;
    margin-right: 10px;
    object-fit: contain;
  }

  .method-name {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
  }

  .check-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    color: #409EFF;
    font-size: 20px;
    transition: all 0.3s;
    opacity: 0;
  }
}

.wechat-limit-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 12px;
  background: #fef0f0;
  border: 1px solid #fde2e2;
  border-radius: 6px;
  color: #f56c6c;
  font-size: 13px;
}

.payment-confirm-btn {
  background-color: rgb(225, 37, 27) !important;
  color: white !important;
  
  &:hover:not(:disabled) {
    opacity: 0.8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(225, 37, 27, 0.3);
  }
  
  &:disabled {
    background-color: #dcdfe6 !important;
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>

