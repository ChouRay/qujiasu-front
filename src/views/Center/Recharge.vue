<template>
  <div class="recharge-container">
    <!-- 账户余额卡片 -->
    <el-card class="balance-card" shadow="hover">
      <div class="balance-label">账户余额</div>
      <div class="balance-amount">¥ {{ userInfo.userBalance?.toFixed(2) || '0.00' }}</div>
    </el-card>

    <!-- 快捷充值 -->
    <div class="section-title">快捷充值</div>
    
    <!-- VIP 套餐区域 -->
    <div class="vip-plans-container">
      <div 
        v-for="vip in vipPlans" 
        :key="vip.amount"
        class="vip-item"
        :class="{ active: selectedAmount === vip.amount }"
        @click="selectAmount(vip.amount)"
      >
        <div class="vip-header">
          <img :src="vip.icon" :alt="vip.level" class="vip-icon" />
          <div class="vip-info">
            <div class="vip-title">{{ vip.title }}</div>
            <div class="vip-desc">{{ vip.desc }}</div>
          </div>
          <div class="vip-price">¥{{ vip.amount }}</div>
        </div>
        <div class="vip-benefits">
          <span class="benefit-tag">推荐佣金{{ vip.commission }}</span>
          <span class="benefit-tag">自用{{ vip.discount }}</span>
        </div>
        <div class="vip-note">注：需实名认证，有效期 90 天，活动产品除外</div>
      </div>
    </div>

    <!-- 普通面额区域 -->
    <div class="normal-amounts-container">
      <div 
        v-for="amount in normalAmounts" 
        :key="amount"
        class="amount-item"
        :class="{ active: selectedAmount === amount }"
        @click="selectAmount(amount)"
      >
        <span class="amount-value">¥{{ amount }}</span>
      </div>
    </div>

    <!-- 其它充值金额 -->
    <div class="section-title">其它充值金额</div>
    <div class="custom-amount-wrapper">
      <el-input
        v-model="customAmount"
        type="number"
        placeholder="请输入充值金额"
        prefix-icon="Money"
        class="custom-amount-input"
        @input="handleCustomInput"
      >
        <template #append>元</template>
      </el-input>
    </div>

    <!-- 总计金额显示 -->
    <div v-if="currentAmount > 0" class="total-amount-display">
      <span class="total-label">您需要支付：</span>
      <span class="total-value">¥{{ currentAmount.toFixed(2) }}</span>
    </div>

    <!-- 充值方式 -->
    <div class="section-title">充值方式</div>
    <div class="payment-methods">
      <div 
        class="method-item"
        :class="{ active: payMethod === PAY_SOURCE.ALIPAY }"
        @click="payMethod = PAY_SOURCE.ALIPAY"
      >
        <img src="@/assets/images/alipay-ico.png" alt="支付宝" class="method-icon" />
        <span class="method-name">支付宝充值</span>
        <el-icon v-if="payMethod === PAY_SOURCE.ALIPAY" class="check-icon"><CircleCheckFilled /></el-icon>
      </div>

      <div 
        class="method-item"
        :class="{ active: payMethod === PAY_SOURCE.WECHAT }"
        @click="payMethod = PAY_SOURCE.WECHAT"
      >
        <img src="@/assets/images/wxpay-ico.png" alt="微信" class="method-icon" />
        <span class="method-name">微信充值</span>
        <el-icon v-if="payMethod === PAY_SOURCE.WECHAT" class="check-icon"><CircleCheckFilled /></el-icon>
      </div>
    </div>

    <!-- 确认支付按钮 -->
    <div class="action-footer">
      <el-button type="primary" size="large" class="submit-btn" @click="handleSubmit" :loading="loading">
        确认支付
      </el-button>
    </div>

    <!-- 最近充值记录 -->
    <div class="section-title">最近充值记录</div>
    <div class="record-table-wrapper">
      <el-table 
        :data="rechargeList" 
        style="width: 100%" 
        v-loading="listLoading"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="totalAmount" label="充值金额 (元)" width="100">
          <template #default="scope">
            <span class="amount-text">¥{{ scope.row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paySource" label="支付渠道" width="100">
          <template #default="scope">
            {{ formatPaySource(scope.row.paySource) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="支付状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ formatPayStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tradeNo" label="订单编号" min-width="150" show-overflow-tooltip />
        <el-table-column prop="payNo" label="支付编号" min-width="150" show-overflow-tooltip />
        <el-table-column prop="gmtCreate" label="创建时间" width="160">
          <template #default="scope">
            {{ formatDateTime(scope.row.gmtCreate) }}
          </template>
        </el-table-column>
        <el-table-column prop="gmtModified" label="完成时间" width="160">
          <template #default="scope">
            {{ formatDateTime(scope.row.gmtModified) }}
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="fetchRechargeList"
          @current-change="fetchRechargeList"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheckFilled } from '@element-plus/icons-vue';
import { getRechargeList, createRechargeOrder } from '@/api/user';
import { userInfo } from '@/reactive/user';
import { formatDateTime } from '@/utils/times';
import { formatPayStatus, PAY_SOURCE, PAY_TRADE_TYPE } from '@/utils/apiEnums'; 

import iconBronze from '@/assets/images/icon-bronze-medal.png';
import iconSilver from '@/assets/images/icon-silver-medal.png';
import iconGold from '@/assets/images/icon-gold-medal.png';


// 状态定义
const loading = ref(false);
const listLoading = ref(false);
const selectedAmount = ref<number | null>(null);
const customAmount = ref<string>('');
const payMethod = ref<typeof PAY_SOURCE.ALIPAY | typeof PAY_SOURCE.WECHAT>(PAY_SOURCE.ALIPAY);

// 列表相关
const pageNum = ref(1);
const pageSize = ref(10);
const totalNum = ref(0);
const rechargeList = ref<any[]>([]);

// 配置数据
const normalAmounts = [50, 100, 200, 500];

const vipPlans = [
  {
    amount: 1000,
    level: '铜牌 VIP',
    title: '升级为铜牌 VIP',
    desc: '点我充值',
    icon: iconBronze,
    commission: '20%',
    discount: '八折'
  },
  {
    amount: 2000,
    level: '银牌 VIP',
    title: '升级为银牌 VIP',
    desc: '点我充值',
    icon: iconSilver,
    commission: '28%',
    discount: '七二折'
  },
  {
    amount: 5000,
    level: '金牌 VIP',
    title: '升级为金牌 VIP',
    desc: '点我充值',
    icon: iconGold,
    commission: '36%',
    discount: '六四折'
  }
];

// 计算当前选中金额
const currentAmount = computed(() => {
  if (selectedAmount.value) {
    return selectedAmount.value;
  }
  if (customAmount.value) {
    const val = parseFloat(customAmount.value);
    return isNaN(val) ? 0 : val;
  }
  return 0;
});

// 方法
const selectAmount = (amount: number) => {
  selectedAmount.value = amount;
  customAmount.value = '';
};

const handleCustomInput = () => {
  selectedAmount.value = null;
};

const formatPaySource = (source: string) => {
  const map: Record<string, string> = {
    [PAY_SOURCE.WECHAT]: '微信',
    [PAY_SOURCE.ALIPAY]: '支付宝',
    [PAY_SOURCE.BALANCE]: '余额支付',
    [PAY_SOURCE.APPLE]: 'Apple Pay'
  };
  return map[source] || source;
};

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    'SUCCESS': 'success',
    'PAY_SUCCESS': 'success',
    'CREDITING': 'warning',
    'CREATED': 'info',
    'PAYING': 'warning',
    'FAILED': 'danger',
    'REFUNDING': 'warning',
    'REFUNDED': 'info',
    'EXCEPTION': 'danger'
  };
  return typeMap[status] || 'info';
};

const handleSubmit = async () => {
  const amount = selectedAmount.value || (customAmount.value ? parseFloat(customAmount.value) : null);
  
  if (!amount || amount <= 0) {
    ElMessage.warning('请输入有效的充值金额');
    return;
  }

  loading.value = true;
  try {
    await createRechargeOrder({
      totalAmount: amount,
      paySource: payMethod.value,
      tradeType: PAY_TRADE_TYPE.NATIVE
    });

    // 200 成功
    ElMessage.success('充值订单创建成功');
    // 刷新列表
    fetchRechargeList();
    // 清空选择
    selectedAmount.value = null;
    customAmount.value = '';
  } catch (error: any) {
    // 处理 402 状态码：支付宝或微信数据
    if (error.response && error.response.status === 402) {
      const responseData = error.response.data;
      
      if (payMethod.value === PAY_SOURCE.ALIPAY) {
        // 支付宝：直接执行 document.write 跳转
        document.write(responseData.data);
        document.close();
      } else if (payMethod.value === PAY_SOURCE.WECHAT) {
        // 微信：暂时不做处理，可根据返回数据展示二维码等
        ElMessage.warning('请根据提示完成微信支付');
        console.log('微信支付数据:', responseData);
      }
    } else if (error.response && error.response.status === 400) {
      // 400 业务错误
      ElMessage.error(error.response.data?.message || '充值失败');
    } else {
      // 其他错误
      ElMessage.error('充值请求失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

const fetchRechargeList = async () => {
  listLoading.value = true;
  try {
    const res = await getRechargeList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    console.log('data=>',res)
    if (res?.data) {
      rechargeList.value = res.data || [];
      totalNum.value = res.totalNum || 0;
    } else {
      ElMessage.error('获取记录失败');
    }
  } catch (error) {
    ElMessage.error('获取记录失败');
  } finally {
    listLoading.value = false;
  }
};

onMounted(() => {
  fetchRechargeList();
});
</script>

<style scoped lang="scss">
.recharge-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 24px 0 16px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: #409EFF;
    margin-right: 8px;
    border-radius: 2px;
  }
}

.balance-card {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: white;
  border: none;
  
  :deep(.el-card__body) {
    padding: 24px;
    text-align: center;
  }

  .balance-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .balance-amount {
    font-size: 32px;
    font-weight: bold;
    font-family: 'DIN Alternate', 'Arial', sans-serif;
  }
}

.vip-plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.normal-amounts-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.amount-item {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  
  &:hover {
    border-color: #409EFF;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  }

  &.active {
    border-color: #409EFF;
    background-color: #ecf5ff;
    color: #409EFF;
    font-weight: bold;
  }

  .amount-value {
    font-size: 16px;
    font-weight: 600;
  }
}

.total-amount-display {
  margin: 20px 0;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  text-align: center;
  border: 1px solid #bae6fd;
  
  .total-label {
    font-size: 14px;
    color: #606266;
    margin-right: 8px;
  }
  
  .total-value {
    font-size: 24px;
    font-weight: bold;
    color: #F56C6C;
  }
}

.vip-item {
  grid-column: span 1;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    grid-column: span 2;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  }

  &.active {
    border-color: #E6A23C;
    background: linear-gradient(to bottom right, #fffdf5, #fff);
    box-shadow: 0 0 0 1px #E6A23C inset;
    
    .vip-title {
      color: #D69020;
    }
  }

  .vip-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .vip-icon {
    width: 25px;
    height: 32px;
    margin-right: 12px;
    object-fit: contain;
  }

  .vip-info {
    flex: 1;
  }

  .vip-title {
    font-size: 15px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
  }

  .vip-desc {
    font-size: 12px;
    color: #909399;
  }

  .vip-price {
    font-size: 18px;
    font-weight: bold;
    color: #E6A23C;
    margin-left: 8px;
  }

  .vip-benefits {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .benefit-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: #fdf6ec;
    color: #E6A23C;
    border: 1px solid #faecd8;
  }

  .vip-note {
    font-size: 11px;
    color: #C0C4CC;
    line-height: 1.4;
    border-top: 1px dashed #ebeef5;
    padding-top: 8px;
  }
}

.custom-amount-wrapper {
  max-width: 400px;
}

.custom-amount-input {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #e4e7ed inset;
  }
}

.payment-methods {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.method-item {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover {
    border-color: #409EFF;
    background-color: #f5f7fa;
  }

  &.active {
    border-color: #409EFF;
    background-color: #ecf5ff;
    
    .check-icon {
      opacity: 1;
      transform: scale(1);
    }
  }

  .method-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    object-fit: contain;
  }

  .method-name {
    font-size: 15px;
    font-weight: 500;
    color: #606266;
  }

  .check-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    color: #409EFF;
    font-size: 24px;
    transition: all 0.3s;
    opacity: 0;
  }
}

.action-footer {
  margin-top: 32px;
  text-align: center;
  
  .submit-btn {
    width: 100%;
    max-width: 400px;
    height: 50px;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2px;
  }
}

.record-table-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  overflow-x: auto;

  .amount-text {
    color: #F56C6C;
    font-weight: bold;
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .recharge-container {
    padding: 12px;
  }

  .balance-card :deep(.el-card__body) {
    padding: 16px;
  }

  .balance-amount {
    font-size: 24px !important;
  }

  .section-title {
    font-size: 14px;
    margin: 16px 0 12px;
  }

  .vip-plans-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .normal-amounts-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .vip-item {
    grid-column: span 1 !important;
    padding: 12px;
    
    .vip-icon {
      width: 20px;
      height: 26px;
    }
    
    .vip-title {
      font-size: 13px;
    }
    
    .vip-desc {
      font-size: 11px;
    }
    
    .benefit-tag {
      font-size: 10px;
      padding: 1px 6px;
    }
    
    .vip-price {
      font-size: 14px;
    }
    
    .vip-note {
      font-size: 10px;
    }
  }

  .amount-item {
    min-height: 50px;
    padding: 10px 8px;
    
    .amount-value {
      font-size: 14px;
    }
  }

  .custom-amount-wrapper {
    max-width: 100%;
  }

  .total-amount-display {
    margin: 16px 0;
    padding: 12px;
    
    .total-label {
      font-size: 13px;
    }
    
    .total-value {
      font-size: 20px;
    }
  }

  .payment-methods {
    flex-direction: column;
    gap: 12px;
  }

  .method-item {
    max-width: 100%;
    padding: 12px 16px;
    
    .method-icon {
      width: 28px;
      height: 28px;
    }
    
    .method-name {
      font-size: 14px;
    }
  }

  .action-footer {
    margin-top: 24px;
    
    .submit-btn {
      height: 44px;
      font-size: 16px;
    }
  }

  .record-table-wrapper {
    padding: 10px;
    max-width: 420px;
    
    :deep(.el-table) {
      font-size: 12px;
    }
    
    :deep(.el-table th) {
      padding: 8px 0;
    }
    
    :deep(.el-table td) {
      padding: 8px 0;
    }
    
    .pagination-wrapper {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>
