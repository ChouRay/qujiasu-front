<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isRenewMode ? '套餐续费' : '授权数调整'"
    :width="dialogWidth"
    destroy-on-close
    @close="handleClose"
  >
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="formData.productList.length === 0" class="error-container">
      <p>暂无可用产品</p>
      <el-button type="primary" @click="fetchProducts">刷新</el-button>
    </div>

    <div v-else class="renew-form">
      <!-- 续费账号 -->
      <div class="form-item">
        <label class="form-label">续费账号：</label>
        <span class="form-value">{{ subscription.username }}</span>
      </div> 

      <!-- 原到期时间 -->
      <div class="form-item">
        <label class="form-label">当前到期时间：</label>
        <span class="form-value" :style="{ color: getDeadlineColor(subscription.dateOffline) }">
          {{ formatDateTime(subscription.dateOffline) }}
        </span>
      </div>

      <!-- 时长选择 -->
      <div class="form-item">
        <label class="form-label">时长选择：</label>
        <div class="duration-options">
          <div
            v-for="product in formData.productList"
            :key="product.id"
            class="duration-option"
            :class="{ active: formData.selectedProduct?.id === product.id }"
            @click="selectProduct(product)"
          >
            <span class="duration-text">{{ product.duration }}天</span>
            <span class="duration-price">¥{{ product.price?.toFixed(2) }}</span>
            <el-icon v-if="formData.selectedProduct?.id === product.id" class="check-icon"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </div>

      <!-- 续费后到期时间 -->
      <div class="form-item">
        <label class="form-label">续费后到期时间：</label>
        <span class="form-value highlight">{{ formatDateTime(formData.renewedDate) }}</span>
      </div>

      <!-- 当前授权数量 -->
      <div class="form-item">
        <label class="form-label">当前授权数：</label>
        <span class="form-value">{{ subscription.usageCount }}</span>
      </div>

      <!-- 增减授权数（仅增减模式显示） -->
      <div v-if="!isRenewMode" class="form-item adjust-mode">
        <label class="form-label">增减授权数：</label>
        <div class="adjust-input-wrapper">
          <el-input-number
            v-model="formData.adjustCount"
            :min="-subscription.usageCount + 1"
            :max="100"
            :step="1"
            controls-position="right"
            style="width: 150px;"
            @change="handleAdjustChange"
          />
          <span class="adjust-tip">（负数减少，正数增加）</span>
        </div>
        <div class="adjust-hint">
          <el-icon><Info-Filled /></el-icon>
          未到期增加连接数，仅对新增加的连接数扣费，时间再综合到每个连接数上
        </div>
      </div>

      <!-- 最终授权数 -->
      <div class="form-item">
        <label class="form-label">最终授权数：</label>
        <span class="form-value highlight">{{ formData.finalUsageCount }}</span>
      </div>

      <!-- 账单合计 -->
      <div class="form-item price-section">
        <label class="form-label">订单金额：</label>
        <div class="price-detail">
          <span v-if="userInfo.dividendRatio && userInfo.dividendRatio > 0" class="original-price">
            ¥{{ totalPrice.toFixed(2) }}元
          </span>
          <span v-else class="total-price">¥{{ totalPrice.toFixed(2) }}元</span>
          <span v-if="userInfo.dividendRatio && userInfo.dividendRatio > 0" class="actual-pay-info">
            （实际应付：<span class="discount-price">¥{{ actualPayPrice.toFixed(2) }}元</span>）
          </span>
        </div>
      </div>

      <!-- 余额和抵用券 -->
      <div class="balance-section">
        <div class="balance-item">
          账户余额：<span class="money">{{ (userInfo.userBalance || 0).toFixed(2) }}元</span>
        </div>
        <div class="balance-item">
          抵用金额：<span class="money">{{ (userInfo.userReward || 0).toFixed(2) }}元</span>
        </div>
      </div>

      <!-- 在线支付金额计算 -->
      <div class="pay-calculation-section">
        <div class="calc-text">
          在线支付金额 = 订单总价 - (抵用券 + 余额)
        </div>
        <div class="calc-result">
          = {{ actualPayPrice.toFixed(2) }} - ({{ (userInfo.userReward || 0).toFixed(2) }} + {{ (userInfo.userBalance || 0).toFixed(2) }})
          = <span :class="{'zero-amount': onlinePayAmount <= 0}">{{ onlinePayAmountDisplay }}</span>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods-section">
        <div class="section-title">在线支付</div>
        <div class="payment-methods">
          <div
            class="method-item"
            :class="{ active: payMethod === PAY_SOURCE.ALIPAY, disabled: onlinePayAmount <= 0 }"
            @click="selectPayMethod(PAY_SOURCE.ALIPAY)"
          >
            <img src="@/assets/images/alipay-ico.png" alt="支付宝" class="method-icon" />
            <span class="method-name">支付宝</span>
            <el-icon v-if="payMethod === PAY_SOURCE.ALIPAY" class="check-icon"><CircleCheckFilled /></el-icon>
          </div>

          <div
            class="method-item"
            :class="{ active: payMethod === PAY_SOURCE.WECHAT, disabled: onlinePayAmount <= 0 }"
            @click="selectPayMethod(PAY_SOURCE.WECHAT)"
          >
            <img src="@/assets/images/wxpay-ico.png" alt="微信" class="method-icon" />
            <span class="method-name">微信</span>
            <el-icon v-if="payMethod === PAY_SOURCE.WECHAT" class="check-icon"><CircleCheckFilled /></el-icon>
          </div>
        </div>
        <div v-if="wechatPayDisabled" class="wechat-limit-tip">
          <el-icon><WarningFilled /></el-icon>
          微信支付限额 200 元，请改用支付宝或减少支付金额
        </div>
      </div>

      <!-- 同意协议 checkbox -->
      <div class="agreement-section">
        <el-checkbox v-model="formData.agreed" :label="false">
          我已知晓并同意，虚拟商品下单后不可退款
        </el-checkbox>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="handleSubmit"
        >
          提交订单
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { WarningFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import { getProductsByMetadataId } from '@/api/product'
import { requestRenew } from '@/api/order'
import type { ProductItem } from '@/types/product'
import type { SubscriptionVO } from '@/types/packages'
import type { PaySource } from '@/types/order'
import { OrderType } from '@/types/order'
import { PAY_SOURCE, PAY_TRADE_TYPE } from '@/utils/apiEnums'
import { formatDateTime } from '@/utils/times'
import { isMobile } from '@/utils/util'
import { userInfo } from '@/reactive/user'
import { getUserInfo } from '@/api/user'

interface Props {
  modelValue: boolean
  subscription: SubscriptionVO
  mode?: 'renew' | 'adjust' // 'renew'=续费模式，'adjust'=增减模式
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'renew'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 是否为续费模式
const isRenewMode = computed(() => props.mode === 'renew')

// 对话框宽度
const dialogWidth = ref(isMobile(navigator.userAgent) ? '85%' : 640)

// 状态
const loading = ref(false)
const submitting = ref(false)
const currentTime = ref(new Date())

// 表单数据
const formData = ref({
  productList: [] as ProductItem[],
  selectedProduct: null as ProductItem | null,
  adjustCount: 0, // 增减数量（仅增减模式）
  finalUsageCount: 0, // 最终授权数
  renewedDate: 0 as number, // 续费后的时间戳
  agreed: false
})

// 支付方式
const payMethod = ref<typeof PAY_SOURCE.ALIPAY | typeof PAY_SOURCE.WECHAT>(PAY_SOURCE.ALIPAY)
const wechatPayDisabled = ref(false)

// 是否可以提交
const canSubmit = computed(() => {
  if (!formData.value.selectedProduct) return false
  if (!formData.value.agreed) return false
  if (wechatPayDisabled.value) return false
  return true
})

// 判断账号是否已到期
const isAccountExpired = computed(() => {
  const offlineTime = new Date(props.subscription.dateOffline).getTime()
  const now = Date.now()
  return offlineTime < now
})

// 计算总价
// 规则：
// 1. 账号未到期 + 增加数量：只对新增部分收费 = (最终授权数 - 原授权数) * 单价
// 2. 账号未到期 + 减少数量：必须续费≥30天，按最终数量收费 = 最终授权数 * 单价
// 3. 账号已到期：无论增减，都按最终数量收费 = 最终授权数 * 单价
const totalPrice = computed(() => {
  if (!formData.value.selectedProduct || !formData.value.selectedProduct.price) return 0
  
  const unitPrice = formData.value.selectedProduct.price
  const finalCount = formData.value.finalUsageCount
  const adjustCount = formData.value.adjustCount
  
  // 如果是增减模式
  if (!isRenewMode.value) {
    if (!isAccountExpired.value) {
      // 账号未到期
      if (adjustCount > 0) {
        // 增加数量：只对新增部分收费
        return adjustCount * unitPrice
      } else if (adjustCount < 0) {
        // 减少数量：按最终数量收费（前面已验证时长≥30天）
        return finalCount * unitPrice
      }
    }
    // 账号已到期：按最终数量收费
    return finalCount * unitPrice
  }
  
  // 续费模式：按最终数量收费
  return finalCount * unitPrice
})

// 计算实际应付 = 总价 * (1 - 折扣比率)
const actualPayPrice = computed(() => {
  if (!formData.value.selectedProduct || !formData.value.selectedProduct.price) return 0
  const ratio = userInfo.dividendRatio || 0
  return totalPrice.value * (1 - ratio)
})

// 在线支付金额
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

// 获取产品列表
const fetchProducts = async () => {
  if (!props.subscription.metadataId) return
  
  loading.value = true
  try {
    const products = await getProductsByMetadataId(props.subscription.metadataId)
    formData.value.productList = products.filter(p => p.status === 'ENABLED')
    
    // 默认选中第一个产品
    if (formData.value.productList.length > 0) {
      formData.value.selectedProduct = formData.value.productList[0]
      calculateRenewedDate()
    }
  } catch (error: any) {
    console.error('获取产品列表失败:', error)
    ElMessage.error('获取产品列表失败')
  } finally {
    loading.value = false
  }
}

// 计算续费后的到期时间
const calculateRenewedDate = () => {
  if (!formData.value.selectedProduct) return
  
  const product = formData.value.selectedProduct
  const durationDays = product.duration || 0
  const durationMs = durationDays * 24 * 60 * 60 * 1000
  
  // 获取原到期时间
  let baseTime: number
  const offlineTime = new Date(props.subscription.dateOffline).getTime()
  const now = Date.now()
  
  // 如果原账号已经到期，则以当前时间为基准；否则以原到期时间为基准
  if (offlineTime < now) {
    baseTime = now
  } else {
    baseTime = offlineTime
  }
  
  formData.value.renewedDate = baseTime + durationMs
}

// 处理产品选择变化
const selectProduct = (product: ProductItem) => {
  formData.value.selectedProduct = product
  calculateRenewedDate()
}

// 处理增减数量变化
const handleAdjustChange = () => {
  formData.value.finalUsageCount = props.subscription.usageCount + formData.value.adjustCount
  // 确保最终授权数至少为 1
  if (formData.value.finalUsageCount < 1) {
    formData.value.finalUsageCount = 1
    formData.value.adjustCount = 1 - props.subscription.usageCount
  }
  
  // 只有账号未到期且减少数量时，才强制要求时长≥30天
  if (formData.value.adjustCount < 0 && !isAccountExpired.value && formData.value.selectedProduct) {
    const selectedDuration = formData.value.selectedProduct.duration || 0
    if (selectedDuration < 30) {
      ElMessage.warning('账号未到期减少连接数时，时长必须大于等于 30 天')
      // 自动选择第一个 >= 30 天的产品
      const validProduct = formData.value.productList.find(p => (p.duration || 0) >= 30)
      if (validProduct) {
        selectProduct(validProduct)
      } else {
        // 如果没有符合条件的产品，重置调整数量
        formData.value.adjustCount = 0
        formData.value.finalUsageCount = props.subscription.usageCount
        ElMessage.info('无可用的 30 天及以上时长产品，已取消减少操作')
      }
    }
  }
}

// 选择支付方式
const selectPayMethod = (method: typeof PAY_SOURCE.ALIPAY | typeof PAY_SOURCE.WECHAT) => {
  if (onlinePayAmount.value <= 0) {
    return
  }
  
  if (method === PAY_SOURCE.WECHAT && onlinePayAmount.value >= 200) {
    wechatPayDisabled.value = true
    ElMessage.warning('微信支付限额 200 元，请改用支付宝支付')
    return
  }
  
  wechatPayDisabled.value = false
  payMethod.value = method
}

// 获取到期时间颜色
const getDeadlineColor = (dateStr: string) => {
  if (!dateStr) return '#303133'
  
  const now = new Date().getTime()
  const target = new Date(dateStr).getTime()
  const diff = target - now
  
  const oneDay = 24 * 60 * 60 * 1000
  const twelveHours = 12 * 60 * 60 * 1000
  
  if (diff < 0) {
    return '#909399'
  } else if (diff < twelveHours) {
    return '#F56C6C'
  } else if (diff < 3 * oneDay) {
    return '#E6A23C'
  } else {
    return '#67C23A'
  }
}

// 提交订单
const handleSubmit = async () => {
  if (!canSubmit.value || !formData.value.selectedProduct) return
  
  submitting.value = true
  
  try {
    // 构建订单请求
    const orderData = {
      orderType: isRenewMode.value ? OrderType.PACKAGE_RENEW_ORDER : OrderType.PACKAGE_RENEW_ORDER,
      username: props.subscription.username,
      usageCount: formData.value.finalUsageCount,
      productId: formData.value.selectedProduct.id || 0,
      paySource: payMethod.value as PaySource,
      tradeType: PAY_TRADE_TYPE.NATIVE
    }
    
    console.log('创建续费订单:', orderData)
    
    // 调用续费接口
    await requestRenew(orderData)
    
    // 刷新用户信息
    await getUserInfo()
    
    ElMessage.success('订单提交成功')
    dialogVisible.value = false
    emit('success')
  } catch (error: any) {
    console.error('提交订单失败:', error)
    
    if (error.response?.status === 402) {
      // 需要支付
      const paySource = payMethod.value as PaySource
      
      if (paySource === PAY_SOURCE.ALIPAY) {
        // 支付宝支付
        document.write(error.response.data)
      } else if (paySource === PAY_SOURCE.WECHAT) {
        ElMessage.info('微信支付二维码功能待实现')
      }
    } else if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.msg || '创建订单失败'
      ElMessage.error(errorMsg)
    } else {
      const errorMsg = error.response?.data?.msg || error.message || '创建订单失败'
      ElMessage.error(errorMsg)
    }
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  // 重置表单
  formData.value = {
    productList: [],
    selectedProduct: null,
    adjustCount: 0,
    finalUsageCount: props.subscription.usageCount,
    renewedDate: 0,
    agreed: false
  }
  payMethod.value = PAY_SOURCE.ALIPAY
  wechatPayDisabled.value = false
}

// 监听对话框打开
watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    currentTime.value = new Date()
    // 初始化最终授权数
    formData.value.finalUsageCount = props.subscription.usageCount
    await fetchProducts()
  }
})

onMounted(() => {
  // 定时更新当前时间
   console.log( props.subscription)
  setInterval(() => {
    if (dialogVisible.value) {
      currentTime.value = new Date()
    }
  }, 1000)
})
</script>

<style scoped lang="scss">
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.renew-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}

.form-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  font-size: 14px;
}

.form-label {
  width: 120px;
  color: #606266;
  flex-shrink: 0;
  line-height: 32px;
}

.form-value {
  color: #303133;
  line-height: 32px;
}

.form-value.highlight {
  color: #409eff;
  font-weight: bold;
  font-size: 16px;
}

.adjust-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.adjust-tip {
  color: #909399;
  font-size: 13px;
}

.adjust-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e6a23c;
  font-size: 12px;
  margin-top: 6px;
  background: #fdf6ec;
  padding: 8px 10px;
  border-radius: 4px;
}

.price-section {
  background: #f9fafc;
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
}

.price-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.original-price {
  color: #909399;
  text-decoration: line-through;
  font-size: 13px;
}

.total-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

.discount-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.actual-pay-info {
  color: #606266;
  font-size: 13px;
}

.balance-section {
  display: flex;
  gap: 20px;
  padding: 12px;
  background: #fdf6ec;
  border-radius: 8px;
  margin-top: 10px;
}

.balance-item {
  font-size: 14px;
  color: #606266;
}

.money {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.pay-calculation-section {
  padding: 12px;
  background: #f0f9eb;
  border-radius: 8px;
  margin-top: 10px;
}

.calc-text {
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
}

.calc-result {
  font-size: 14px;
  color: #303133;
}

.zero-amount {
  color: #67c23a;
  font-weight: bold;
}

.payment-methods-section {
  margin-top: 16px;
}

.section-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  font-weight: bold;
}

.payment-methods {
  display: flex;
  width: 50%;
  gap: 15px;
}

.method-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.method-item:hover:not(.disabled) {
  border-color: #409eff;
  background: #ecf5ff;
}

.method-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.method-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.method-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.method-name {
  font-size: 14px;
  color: #303133;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #409eff;
  font-size: 20px;
}

.wechat-limit-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e6a23c;
  font-size: 12px;
  margin-top: 8px;
  background: #fdf6ec;
  padding: 8px 10px;
  border-radius: 4px;
}

.agreement-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.duration-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.duration-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  background: #fff;
}

.duration-option:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.duration-option.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.duration-text {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.duration-price {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
  margin-top: 4px;
}

.duration-option .check-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #409eff;
  font-size: 18px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
