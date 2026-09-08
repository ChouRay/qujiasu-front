<template>
  <el-dialog
    v-model="dialogVisible"
    title="待付款"
    :width="dialogWidth"
    destroy-on-close
  >
    <div class="unpaid-form">
      <!-- 订单信息 -->
      <div class="form-item">
        <label class="form-label">套餐账号：</label>
        <span class="form-value">{{ username }}</span>
      </div>

      <div class="form-item">
        <label class="form-label">版本：</label>
        <span class="form-value">{{ productName }}</span>
      </div>

      <div class="form-item">
        <label class="form-label">授权数量：</label>
        <span class="form-value">{{ usageCount }}</span>
      </div>

      <div class="form-item">
        <label class="form-label">时长：</label>
        <span class="form-value">{{ days }} 天</span>
      </div>

      <div class="form-item">
        <label class="form-label">订单编号：</label>
        <span class="form-value">{{ tradeNo }}</span>
      </div>

      <div class="form-item price-section">
        <label class="form-label">订单金额：</label>
        <span class="total-price">¥{{ totalAmount.toFixed(2) }}元</span>
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

      <!-- 支付方式选择 -->
      <div class="payment-methods-section">
        <div class="section-title">支付方式</div>
        <div class="payment-methods">
          <div
            class="method-item"
            :class="{ active: payMethod === PAY_SOURCE.ALIPAY }"
            @click="payMethod = PAY_SOURCE.ALIPAY"
          >
            <img src="@/assets/images/alipay-ico.png" alt="支付宝" class="method-icon" />
            <span class="method-name">支付宝</span>
            <el-icon v-if="payMethod === PAY_SOURCE.ALIPAY" class="check-icon"><CircleCheckFilled /></el-icon>
          </div>

          <!-- <div
            class="method-item"            
            :class="{ active: payMethod === PAY_SOURCE.WECHAT }"
            @click="payMethod = PAY_SOURCE.WECHAT"
          >
            <img src="@/assets/images/wxpay-ico.png" alt="微信" class="method-icon" />
            <span class="method-name">微信</span>
            <el-icon v-if="payMethod === PAY_SOURCE.WECHAT" class="check-icon"><CircleCheckFilled /></el-icon>
          </div> -->
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { createPackageOrderPayment } from '@/api/order'
import { PAY_SOURCE, PAY_TRADE_TYPE } from '@/utils/apiEnums'
import { userInfo } from '@/reactive/user'
import { getUserInfo } from '@/api/user'
import { isMobile } from '@/utils/util'

interface Props {
  modelValue: boolean
  tradeNo: string
  username: string
  totalAmount: number
  usageCount: number
  productName: string
  days: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  tradeNo: '',
  username: '',
  totalAmount: 0,
  usageCount: 0,
  productName: '',
  days: 0
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

// 对话框宽度
const dialogWidth = ref(isMobile(navigator.userAgent) ? '85%' : 520)

// 支付方式
const payMethod = ref<typeof PAY_SOURCE.ALIPAY | typeof PAY_SOURCE.WECHAT>(PAY_SOURCE.ALIPAY)
const submitting = ref(false)

// 确认支付
const handleConfirm = async () => {
  submitting.value = true

  try {
    await createPackageOrderPayment(props.tradeNo, {
      paySource: payMethod.value,
      tradeType: PAY_TRADE_TYPE.NATIVE
    })

    // 刷新用户余额和抵用券
    await getUserInfo()

    ElMessage.success('支付成功')
    dialogVisible.value = false
    emit('success')
  } catch (error: any) {
    console.error('支付失败:', error)

    if (error.response?.status === 402) {
      // 需要支付
      if (payMethod.value === PAY_SOURCE.ALIPAY) {
        document.write(error.response.data.data)
      } else if (payMethod.value === PAY_SOURCE.WECHAT) {
        ElMessage.info('微信支付二维码功能待实现')
      }
    } else {
      const errorMsg = error.response?.data?.msg || error.message || '支付失败'
      ElMessage.error(errorMsg)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.unpaid-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}

.form-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
  font-size: 14px;
}

.form-label {
  width: 90px;
  color: #606266;
  flex-shrink: 0;
  line-height: 24px;
}

.form-value {
  color: #303133;
  line-height: 24px;
  word-break: break-all;
}

.price-section {
  background: #f9fafc;
  padding: 10px 12px;
  border-radius: 8px;
}

.total-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
}

.balance-section {
  display: flex;
  gap: 20px;
  padding: 12px;
  background: #fdf6ec;
  border-radius: 8px;
  margin-bottom: 16px;
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

.payment-methods-section {
  margin-top: 4px;
}

.section-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  font-weight: bold;
}

.payment-methods {
  display: flex;
  gap: 15px;
}

.method-item {
  flex: 1;
  display: flex;
  max-width: 160px;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.method-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.method-item.active {
  border-color: #409eff;
  background: #ecf5ff;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
