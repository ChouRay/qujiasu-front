<template>
  <!-- 购买详情 -->
  <div class="buy-form">
    <h3 class="buy-form-title" :style="{ color: titleColor }">{{ title }}-套餐购买</h3>

    <!-- 版本选择 -->
    <div class="version-tabs">
      <div
        v-for="catalog in catalogs"
        :key="catalog.id"
        class="version-tab"
        :class="{ active: selectedCatalogId === catalog.id }"
        @click="selectVersion(catalog)"
      >
        {{ catalog.name }}
      </div>
    </div>

    <!-- 套餐选择 -->
    <div class="select-group">
      <span class="select-label">套餐选择</span>
      <div class="package-options">
        <div
          v-for="metadata in metadataList"
          :key="metadata.id"
          class="package-option"
          :class="{ active: selectedMetadata?.id === metadata.id }"
          @click="selectPackage(metadata)"
        >
          {{ metadata.name }}
        </div>
      </div>
    </div>

    <!-- 时长选择 -->
    <div v-if="selectedMetadata" class="select-group">
      <span class="select-label">时长选择</span>
      <div class="duration-options">
        <div
          v-for="product in selectedMetadata.products"
          :key="product.id"
          class="duration-option"
          :class="{ active: selectedProduct?.id === product.id }"
          @click="selectDuration(product)"
        >
          {{ product.duration }}天
          <span class="duration-price">¥{{ product.price?.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div v-if="selectedProduct" class="dialog-content">
      <!-- 产品信息摘要 -->
      <div class="product-summary"></div>
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
            <el-popover placement="right" :width="200" trigger="hover" content="授权数用于一个账号可用于多个窗口/设备同时连接">
              <template #reference>
                <el-icon style="cursor: pointer; color: #909399; font-size:18px;"><QuestionFilled /></el-icon>
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
                :disabled="city.isEnable !== 1"
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

    <div v-if="selectedProduct" class="dialog-footer">
      <button @click="handleCancelBuy" class="cancel-btn">取消</button>
      <button
        @click="handleConfirmOrder"
        class="confirm-btn"
        style="backgroundColor: #409eff"
      >
        确认
      </button>
    </div>
  </div>

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
            :class="{ active: payMethod === PAY_SOURCE.ALIPAY, disabled: onlinePayAmount <= 0 }"
            @click="selectPayMethod(PAY_SOURCE.ALIPAY)"
          >
            <img src="@/assets/images/alipay-ico.png" alt="支付宝" class="method-icon" />
            <span class="method-name">支付宝</span>
            <el-icon v-if="payMethod === PAY_SOURCE.ALIPAY" class="check-icon"><CircleCheckFilled /></el-icon>
          </div>

          <!-- <div
            class="method-item"
            :class="{ active: payMethod === PAY_SOURCE.WECHAT, disabled: onlinePayAmount <= 0 }"
            @click="selectPayMethod(PAY_SOURCE.WECHAT)"
          >
            <img src="@/assets/images/wxpay-ico.png" alt="微信" class="method-icon" />
            <span class="method-name">微信</span>
            <el-icon v-if="payMethod === PAY_SOURCE.WECHAT" class="check-icon"><CircleCheckFilled /></el-icon>
          </div> -->
        </div>
        <div v-if="wechatPayDisabled" class="wechat-limit-tip">
          <el-icon><WarningFilled /></el-icon>
          微信支付限额 200 元，请改用支付宝或减少支付金额
        </div>
      </div>

      <!-- 退款政策同意 -->
      <div class="refund-policy-section">
        <el-checkbox v-model="agreeRefundPolicy">
          我已知晓并同意，虚拟商品下单后不可退款
        </el-checkbox>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button @click="showPaymentConfirmDialog = false" class="cancel-btn">取消</button>
        <button
          @click="handleFinalConfirm"
          class="confirm-btn payment-confirm-btn"
          :disabled="wechatPayDisabled || !agreeRefundPolicy"
        >
          确认支付
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { requestGames, requestLocations } from '@/api/packages'
import type { ProductItem, ProductCatalogVO, ProductCatalogMetadataVO } from '@/types/product'
import type { Province, City } from '@/types/region'
import type { GameDTO } from '@/types/packages'
import { userInfo } from '@/reactive/user'
import { getUserInfo } from '@/api/user'
import { isMobile } from '@/utils/util'
import { checkUsernameAvilability, requestPackageOrders } from '@/api/order'
import type { PackageOrderRequest, PaySource } from '@/types/order'
import { OrderType } from '@/types/order'
import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
import { QuestionFilled, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import { getErrorMessage } from '@/utils/errorMessage'
import { PAY_SOURCE, PAY_TRADE_TYPE } from '@/utils/apiEnums'

const router = useRouter()

// 事件：版本变化通知父组件联动
const emit = defineEmits<{
  (e: 'update:selectedCatalogId', value: number | null): void
}>()

// 标题/分类/版本/套餐由父组件传入
const props = withDefaults(defineProps<{
  title?: string
  titleColor?: string
  catalogs?: ProductCatalogVO[]
  selectedCatalogId?: number | null
  metadataList?: ProductCatalogMetadataVO[]
}>(), {
  title: '套餐购买',
  titleColor: '#2c3e50',
  catalogs: () => [],
  selectedCatalogId: null,
  metadataList: () => []
})

// 状态
const selectedProduct = ref<ProductItem | null>(null)
const selectedMetadata = ref<ProductCatalogMetadataVO | null>(null)
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
      const errorMsg = error.response?.data?.msg
      usernameAvailabilityError.value = getErrorMessage(errorMsg , '该账号已被使用，请更换其他账号')
    } else {
      // 其他错误显示错误信息
      const errorMsg = error.response?.data?.msg || '检查失败'
      usernameAvailabilityError.value = getErrorMessage(errorMsg, '检查失败')
    }
  } finally {
    checkingUsername.value = false
  }
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
    allCitiesMap.value.clear()
    formData.value.locationIds = []

    // 必须同时有 gameId 和 metadataId 才请求
    if (!gameId || !metadataId) {
      return
    }

    try {
      const locations = await requestLocations({ metadataId, gameId })
      if (Array.isArray(locations)) {
        // 过滤：只有当 province.isEnable == 1 且 cities 不为空时，才处理其 cities
        const filteredProvinces: Province[] = []
        locations.forEach((province: Province) => {
          if (province.isEnable === 1 && province.cities && province.cities.length > 0) {
            // 创建新的 province 对象，只包含启用的城市
            const enabledCities = province.cities.filter(city => city.isEnable === 1)
            if (enabledCities.length > 0) {
              const filteredProvince: Province = {
                ...province,
                cities: enabledCities
              }
              filteredProvinces.push(filteredProvince)

              // 将启用的城市加入 allCitiesMap
              enabledCities.forEach(city => {
                allCitiesMap.value.set(city.id, city)
              })
            }
          }
        })
        locationOptions.value = filteredProvinces
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
const payMethod = ref<typeof PAY_SOURCE.ALIPAY | typeof PAY_SOURCE.WECHAT>(PAY_SOURCE.ALIPAY)

// 微信支付是否被禁用（超过 200 元限额）
const wechatPayDisabled = ref(false)

// 是否同意退款政策
const agreeRefundPolicy = ref(false)

// 选择支付方式
const selectPayMethod = (method: typeof PAY_SOURCE.ALIPAY | typeof PAY_SOURCE.WECHAT) => {
  if (onlinePayAmount.value <= 0) {
    return // 金额为 0 时不能选择支付方式
  }

  if (method === PAY_SOURCE.WECHAT && onlinePayAmount.value >= 200) {
    wechatPayDisabled.value = true
    ElMessage.warning('微信支付限额 200 元，请改用支付宝支付')
    return
  }

  wechatPayDisabled.value = false
  payMethod.value = method
}

// 选择版本：切换分类（metadataList 更新后会自动选中第一个套餐与时长）
const selectVersion = (catalog: ProductCatalogVO) => {
  if (catalog.id === props.selectedCatalogId) return
  emit('update:selectedCatalogId', catalog.id ?? null)
}

// 选择套餐：选中元数据节点，并清空已选产品
const selectPackage = (metadata: ProductCatalogMetadataVO) => {
  if (metadata.id === selectedMetadata.value?.id) return
  selectedMetadata.value = metadata
  selectedProduct.value = null
}

// 应用产品选择：重置表单
const applyProductSelection = (product: ProductItem) => {
  selectedProduct.value = product
  formData.value = {
    username: '',
    password: '',
    usageCount: 1,
    gameId: undefined,
    locationIds: []
  }
  usernameAvailabilityError.value = ''
  payMethod.value = PAY_SOURCE.ALIPAY
  wechatPayDisabled.value = false
  handleDialogOpen()
}

// 选择时长：选中产品
const selectDuration = (product: ProductItem) => {
  applyProductSelection(product)
}

// 版本变化（metadataList 更新）后，默认选中第一个套餐与第一个时长
// immediate: true 保证首次挂载时（BuyOperation 随 loading=false 才渲染，此时 metadataList 已有值）也自动选中
watch(() => props.metadataList, (list) => {
  const firstMetadata = list?.[0] || null
  const firstProduct = firstMetadata?.products?.[0] || null
  selectedMetadata.value = firstMetadata
  if (firstProduct) {
    applyProductSelection(firstProduct)
  } else {
    selectedProduct.value = null
  }
}, { immediate: true })

// 取消购买：清空表单填写内容（表单保持显示）
const handleCancelBuy = () => {
  formData.value = {
    username: '',
    password: '',
    usageCount: 1,
    gameId: undefined,
    locationIds: []
  }
  usernameAvailabilityError.value = ''
  payMethod.value = PAY_SOURCE.ALIPAY
  wechatPayDisabled.value = false
  if (formRef.value) {
    formRef.value.resetFields()
  }
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
    payMethod.value = PAY_SOURCE.ALIPAY
    wechatPayDisabled.value = false
  })
}

// 最终确认支付
const handleFinalConfirm = async () => {
  if (wechatPayDisabled.value) {
    return
  }

  // 直接创建订单，由后端判断支付状态
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
      tradeType: PAY_TRADE_TYPE.NATIVE
    }

    console.log('创建订单:', orderData)

    // 调用创建订单接口
    await requestPackageOrders(orderData)

    // 200 状态码：request.ts 拦截器已处理，表示成功，无返回数据
    // 刷新用户信息
    await getUserInfo()

    ElMessage.success('购买成功')
    showPaymentConfirmDialog.value = false

    // 询问是否继续购买
    try {
      await ElMessageBox.confirm('是否继续购买？', '提示', {
        confirmButtonText: '继续购买',
        cancelButtonText: '查看订单',
        type: 'success'
      })

      // 继续购买：清空套餐购买框的数据
      resetForm()
    } catch {
      // 取消继续购买：跳转到 orders 页面
      router.push('/center/orders')
    }
  } catch (error: any) {
    console.error('创建订单失败:', error)

    // 处理 402 状态码 - 需要支付
    if (error.response?.status === 402) {
      const paySource = payMethod.value as PaySource

      if (paySource === PAY_SOURCE.ALIPAY) {
        // 支付宝支付：直接写入响应内容跳转
        document.write(error.response.data.data)
      } else if (paySource === PAY_SOURCE.WECHAT) {
        // 微信支付：走二维码支付逻辑（暂时不做）
        ElMessage.info('微信支付二维码功能待实现')
        // TODO: 实现微信二维码支付逻辑
      }
    } else if (error.response?.status === 400) {
      // 400 错误：提示错误信息
      const errorMsg = error.response?.data?.msg || '创建订单失败'
      ElMessage.error(getErrorMessage(errorMsg, '创建订单失败'))
    } else {
      // 其他错误
      const errorMsg = error.response?.data?.msg || error.message || '创建订单失败'
      ElMessage.error(getErrorMessage(errorMsg, '创建订单失败'))
    }
  }
}

// 重置表单数据
const resetForm = () => {
  formData.value = {
    username: '',
    password: '',
    usageCount: 1,
    gameId: undefined,
    locationIds: []
  }
  selectedProduct.value = null
  payMethod.value = PAY_SOURCE.ALIPAY
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

</script>

<style scoped>
.buy-form {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
}

.buy-form-title {
  font-size: 20px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 16px;
}

/* 版本选择 */
.version-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.version-tab {
  flex: 1;
  padding: 10px 16px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #606266;
  background: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.version-tab:hover {
  border-color: #667eea;
}

.version-tab.active {
  border-color: #667eea;
  color: #667eea;
  background: #f0f3ff;
}

/* 套餐/时长选择 */
.select-group {
  margin-bottom: 16px;
}

.select-label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.package-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.package-option {
  padding: 8px 14px;
  font-size: 14px;
  color: #606266;
  background: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.package-option:hover {
  border-color: #667eea;
}

.package-option.active {
  border-color: #667eea;
  color: #667eea;
  background: #f0f3ff;
}

.duration-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.duration-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  background: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.duration-option:hover {
  border-color: #667eea;
}

.duration-option.active {
  border-color: #667eea;
  color: #667eea;
  background: #f0f3ff;
}

.duration-price {
  font-size: 13px;
  color: #e74c3c;
}

.dialog-content {
  padding: 0;
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

.refund-policy-section {
  margin-top: 16px;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;

  :deep(.el-checkbox) {
    color: #606266;
    font-size: 14px;

    .el-checkbox__label {
      color: #f56c6c;
      font-weight: 500;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
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
