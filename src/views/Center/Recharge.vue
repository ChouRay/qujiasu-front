<template>
  <div class="recharge-page">
    <el-row :gutter="20">
      <!-- 账户余额卡片 -->
      <el-col :span="24" :md="12">
        <el-card class="balance-card">
          <div class="balance-info">
            <div class="balance-label">账户余额</div>
            <div class="balance-amount">¥{{ balance }}</div>
            <el-button type="primary" @click="showRechargeDialog = true" class="recharge-btn">
              立即充值
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 充值记录 -->
      <el-col :span="24" :md="12">
        <el-card class="record-card">
          <template #header>
            <div class="card-header">
              <span>最近充值记录</span>
              <el-button type="primary" link @click="viewAllRecords">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentRecords" style="width: 100%" :show-header="false">
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }">
                ¥{{ row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'">
                  {{ row.status === 1 ? '成功' : '处理中' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 充值套餐选择 -->
    <el-card class="packages-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>选择充值金额</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8" :xs="24" v-for="pkg in rechargePackages" :key="pkg.amount">
          <el-card 
            class="package-item" 
            :class="{ active: selectedPackage === pkg.amount }"
            @click="selectedPackage = pkg.amount"
          >
            <div class="package-amount">¥{{ pkg.amount }}</div>
            <div class="package-desc">{{ pkg.desc }}</div>
            <div class="package-bonus" v-if="pkg.bonus">
              <el-tag type="danger" size="small">赠送{{ pkg.bonus }}元</el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="custom-amount" style="margin-top: 20px;">
        <el-input
          v-model="customAmount"
          placeholder="请输入自定义充值金额"
          style="max-width: 300px;"
        >
          <template #append>元</template>
        </el-input>
        <el-button type="primary" @click="handleCustomRecharge" style="margin-left: 10px;">
          确认充值
        </el-button>
      </div>
    </el-card>

    <!-- 充值对话框 -->
    <el-dialog
      v-model="showRechargeDialog"
      title="账户充值"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="recharge-form">
        <p>充值金额：<strong>¥{{ selectedPackage || customAmount }}</strong></p>
        <p class="tips">请选择支付方式：</p>
        <el-radio-group v-model="paymentMethod" style="width: 100%;">
          <el-radio value="wechat">微信支付</el-radio>
          <el-radio value="alipay">支付宝</el-radio>
          <el-radio value="bank">银行卡</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRechargeDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmRecharge">确认支付</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const balance = ref(1299.50)
const showRechargeDialog = ref(false)
const selectedPackage = ref<number | null>(null)
const customAmount = ref('')
const paymentMethod = ref('wechat')

const rechargePackages = ref([
  { amount: 50, desc: '基础充值', bonus: 0 },
  { amount: 100, desc: '常用充值', bonus: 5 },
  { amount: 200, desc: '超值充值', bonus: 15 },
  { amount: 500, desc: '大额充值', bonus: 50 },
  { amount: 1000, desc: '至尊充值', bonus: 150 }
])

const recentRecords = ref([
  { time: '2025-01-03 10:30:00', amount: 100, status: 1 },
  { time: '2025-01-01 15:20:00', amount: 50, status: 1 },
  { time: '2024-12-28 09:15:00', amount: 200, status: 2 }
])

const viewAllRecords = () => {
  ElMessage.info('查看完整的充值记录')
  // TODO: 跳转到充值记录页面或打开弹窗
}

const handleCustomRecharge = () => {
  if (!customAmount.value || isNaN(Number(customAmount.value)) || Number(customAmount.value) <= 0) {
    ElMessage.warning('请输入有效的充值金额')
    return
  }
  selectedPackage.value = null
  showRechargeDialog.value = true
}

const confirmRecharge = () => {
  const amount = selectedPackage.value || Number(customAmount.value)
  if (!amount || amount <= 0) {
    ElMessage.warning('请选择或输入充值金额')
    return
  }
  
  // TODO: 调用充值 API
  ElMessage.success(`充值请求已提交，金额：¥${amount}`)
  showRechargeDialog.value = false
}

onMounted(() => {
  // TODO: 加载账户余额和充值记录
})
</script>

<style scoped lang="scss">
.recharge-page {
  .balance-card {
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    
    .balance-info {
      padding: 20px;
      text-align: center;
      
      .balance-label {
        font-size: 14px;
        opacity: 0.9;
        margin-bottom: 10px;
      }
      
      .balance-amount {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      .recharge-btn {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        color: #fff;
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
  
  .record-card {
    border-radius: 12px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
  }
  
  .packages-card {
    border-radius: 12px;
    
    .card-header {
      font-weight: 600;
    }
    
    .package-item {
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
      margin-bottom: 15px;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
      }
      
      &.active {
        border-color: #667eea;
        background-color: rgba(102, 126, 234, 0.05);
      }
      
      .package-amount {
        font-size: 24px;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 8px;
      }
      
      .package-desc {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .package-bonus {
        margin-top: 8px;
      }
    }
  }
  
  .custom-amount {
    display: flex;
    align-items: center;
  }
  
  .recharge-form {
    p {
      margin: 10px 0;
      
      strong {
        font-size: 20px;
        color: #667eea;
      }
    }
    
    .tips {
      margin-top: 20px !important;
      margin-bottom: 15px !important;
      color: #666;
    }
  }
}
</style>
