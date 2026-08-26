<template>
  <div class="affiliate-mgr">
    <div class="content-wrapper">
      <!-- 左侧信息卡片 -->
      <div class="left-panel">
        <h2>代理商信息</h2>
        <div class="info-card">
          <div class="info-item">
            <span class="label">我的等级：</span>
            <span class="value">{{ userInfo.agentLevel || '普通会员' }}</span>
          </div>
          <div class="info-item">
            <span class="label">返佣比率：</span>
            <span class="value">{{ ((userInfo.dividendRatio || 0) * 100).toFixed(1) }}%</span>
          </div>
          <div class="info-item">
            <span class="label">我的积分：</span>
            <span class="value">{{ userInfo.userPoint || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付宝：</span>
            <span class="value">{{ userInfo.idAli || '未绑定' }}</span>
            <el-icon class="edit-icon" @click="handleBindAlipay"><Edit /></el-icon>
          </div>
          <div class="info-item">
            <span class="label">佣金余额：</span>
            <span class="value">¥{{ (userInfo.agentIncome || 0).toFixed(2) }}</span>
            <el-button type="primary" size="small" @click="handleWithdraw">提现</el-button>
          </div>
          <div class="info-item">
            <span class="label">提现中：</span>
            <span class="value" style="color: #ff9800;">{{ userInfo.onWithdraw || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="label">推广人数：</span>
            <span class="value">{{ userInfo.totalInviteCount || 0 }}人</span>
          </div>
          <div class="info-item">
            <span class="label">加入时间：</span>
            <span class="value">{{ formatTime(userInfo.gmtCreate || '') }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <div style="margin-top:44px;"></div>
        <!-- 右上：说明 -->
        <div class="instruction-card">
          <h3 class="card-title">说明</h3>
          <ul class="instruction-list">
            <li class="instruction-item">
              <span class="num-circle">01</span>
              <span class="text">推荐他人购买产品，推广人获得相应比率佣金</span>
            </li>
            <li class="instruction-item">
              <span class="num-circle">02</span>
              <span class="text">佣金可以用于消费或者提现</span>
            </li>
            <li class="instruction-item">
              <span class="num-circle">03</span>
              <span class="text">满100元可以随时申请提现</span>
            </li>
            <li class="instruction-item">
              <span class="num-circle">04</span>
              <span class="text">公司会在每月15日打款（非工作日顺延）</span>
            </li>
          </ul>
        </div>

        <!-- 右下：海报 -->
        <div class="poster-card">
          <div class="poster-wrapper">
            <img src="@/assets/images/affi-poster2.png" alt="推广海报" class="poster-bg" />
            <div class="qr-overlay">
              <img src="@/assets/images/wx-open-qr.jpg" alt="二维码" class="qr-code" />
            </div>
            <div class="action-btn-wrapper">
              <el-button class="free-use-btn">免费使用</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 绑定支付宝弹窗 -->
  <el-dialog
    v-model="bindDialogVisible"
    title="绑定支付宝账号"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form :model="bindForm" label-width="120px">
      <el-form-item label="支付宝真实姓名">
        <el-input v-model="bindForm.aliRealName" placeholder="请输入支付宝真实姓名" />
      </el-form-item>
      <el-form-item label="支付宝账号">
        <el-input v-model="bindForm.aliAccount" placeholder="请输入支付宝账号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <el-button @click="bindDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBindAlipay">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 提现弹窗 -->
  <el-dialog
    v-model="withdrawDialogVisible"
    title="佣金提现"
    width="400px"
    :close-on-click-modal="false"
  >
    <div style="margin-bottom: 16px; color: #666;">
      当前可提现佣金：<span style="color: #f56c6c; font-weight: bold; font-size: 18px;">¥{{ (userInfo.agentIncome || 0).toFixed(2) }}</span>
    </div>
    <el-form :model="withdrawForm" label-width="120px">
      <el-form-item label="提现到">
        <el-radio-group v-model="withdrawForm.destination">
          <el-radio label="BALANCE">账号余额</el-radio>
          <el-radio label="ALIPAY">支付宝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提现金额">
        <div style="display: flex; gap: 8px;">
          <el-input
            v-model="withdrawForm.totalAmount" 
            style="flex: 1;"
            type="number"
            placeholder="请输入提现金额"
          />
          <el-button 
            type="primary" 
            size="default"
            @click="fillMaxAmount"
          >
            全部
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <el-button @click="withdrawDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmWithdraw">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userInfo } from '@/reactive/user'
import { formatTime } from '@/utils/times'
import { getUserInfo, requestBindAliapy, requestWithdraw } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getErrorMessage } from '@/utils/errorMessage'
import { Edit } from '@element-plus/icons-vue'

// 绑定支付宝弹窗控制
const bindDialogVisible = ref(false)
const bindForm = ref({
  aliRealName: '',
  aliAccount: ''
})

// 提现弹窗控制
const withdrawDialogVisible = ref(false)
const withdrawForm = ref({
  totalAmount: 0,
  destination: 'BALANCE' as 'BALANCE' | 'ALIPAY'
})

const handleBindAlipay = () => {
  bindForm.value = {
    aliRealName: '',
    aliAccount: ''
  }
  bindDialogVisible.value = true
}

const confirmBindAlipay = async () => {
  try {
    await requestBindAliapy(bindForm.value)
    ElMessage.success('绑定成功')
    bindDialogVisible.value = false
    // 刷新用户信息
    getUserInfo()
  } catch (error: any) {
    const errorMsg = error.response?.data?.msg || '绑定失败'
    ElMessage.error(getErrorMessage(errorMsg))
  }
}

const handleWithdraw = () => {
  // 检查是否有未处理的提现
  if (userInfo.onWithdraw && userInfo.onWithdraw > 0) {
    ElMessage.warning('还有未处理的提现，请等待处理完成后再提现')
    return
  }
  
  // 初始化提现表单
  withdrawForm.value = {
    totalAmount: 0,
    destination: 'BALANCE'
  }
  withdrawDialogVisible.value = true
}

// 快捷输入全部佣金（取整）
const fillMaxAmount = () => {
  const maxAmount = Math.floor(userInfo.agentIncome || 0)
  withdrawForm.value.totalAmount = maxAmount
}

const confirmWithdraw = async () => {
  // 检查是否绑定支付宝（如果选择提现到支付宝）
  if (withdrawForm.value.destination === 'ALIPAY' && !userInfo.idAli) {
    ElMessage.warning('请先绑定支付宝账号')
    withdrawDialogVisible.value = false
    handleBindAlipay()
    return
  }
  
  try {
    await requestWithdraw(withdrawForm.value)
    ElMessage.success('提现申请成功')
    withdrawDialogVisible.value = false
    // 刷新用户信息
    getUserInfo()
  } catch (error: any) {
    const errorMsg = error.response?.data?.msg || '提现失败'
    ElMessage.error(getErrorMessage(errorMsg))
  }
}
</script>

<style scoped>
.affiliate-mgr {
  padding-left: 20px;
  padding-right: 20px;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 左侧面板 */
.left-panel {
  flex: 1;
  max-width: 630px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.info-item .value {
  color: #333;
  font-weight: 600;
  font-size: 15px;
}

/* 右侧面板 */
.right-panel {
  width: 448px; /* 固定宽度，不铺满全屏 */
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 0 52px; /* 居中显示 */
}

.instruction-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.num-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #d0e9ff;
  color: #0084ff;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.instruction-item .text {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* 海报区域 */
.poster-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.poster-wrapper {
  position: relative;
  width: 402px;
  height: 408px;
  overflow: hidden;
  border-radius: 8px;
}

.poster-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.qr-code {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.action-btn-wrapper {
  position: absolute;
  left: 50%;
  bottom: 5%; /* 约五分之四处 */
  transform: translateX(-24%);
  width: 80%;
}

.free-use-btn {
  width: 50%;
  height: 48px;
  background-color: #009f04 !important;
  color: #fff !important;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 24px;
}

.edit-icon {
  color: #409eff;
  cursor: pointer;
  font-size: 18px;
  margin-left: 8px;
}

.edit-icon:hover {
  color: #66b1ff;
}

/* 响应式 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    min-width: 100%;
    margin: 0 auto !important; /* 居中显示 */
  }
}
</style>
