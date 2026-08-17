<template>
  <div class="affiliate-mgr">
    <div class="content-wrapper">
      <!-- 左侧信息卡片 -->
      <div class="left-panel">
        <div class="info-card">
          <div class="info-item">
            <span class="label">我的等级：</span>
            <span class="value">{{ user.agentLevel || '普通会员' }}</span>
          </div>
          <div class="info-item">
            <span class="label">返佣比率：</span>
            <span class="value">{{ ((user.dividenratio || 0) * 100).toFixed(1) }}%</span>
          </div>
          <div class="info-item">
            <span class="label">我的积分：</span>
            <span class="value">{{ user.userPoint || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付宝：</span>
            <span v-if="user.idAli" class="value">{{ user.idAli }}</span>
            <el-button v-else type="primary" size="small" @click="handleBindAlipay">绑定</el-button>
          </div>
          <div class="info-item">
            <span class="label">佣金余额：</span>
            <span class="value">¥{{ (user.agentIncome || 0).toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">推广人数：</span>
            <span class="value">{{ user.totalInviteCount || 0 }}人</span>
          </div>
          <div class="info-item">
            <span class="label">加入时间：</span>
            <span class="value">{{ formatTime(user.gmtCreate) }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
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
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { formatTime } from '@/utils/times'

// 模拟用户数据（实际应从 Pinia store 获取）
const user = reactive({
  agentLevel: '金牌代理',
  dividenratio: 0.15,
  userPoint: 2580,
  idAli: '', // 设为空字符串测试绑定按钮显示
  agentIncome: 1268.50,
  totalInviteCount: 42,
  gmtCreate: Date.now() - 86400000 * 30 // 30天前
})

const handleBindAlipay = () => {
  console.log('绑定支付宝')
  // TODO: 实现绑定逻辑
}
</script>

<style scoped>
.affiliate-mgr {
  padding: 20px;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 左侧面板 */
.left-panel {
  flex: 1;
  min-width: 300px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  color: #666;
  font-size: 14px;
}

.info-item .value {
  color: #333;
  font-weight: 600;
  font-size: 15px;
}

/* 右侧面板 */
.right-panel {
  flex: 1.5;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  width: 100%;
  padding-top: 125%; /* 4:5 比例 */
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
  bottom: 20%; /* 约五分之四处 */
  transform: translateX(-50%);
  width: 80%;
}

.free-use-btn {
  width: 100%;
  height: 48px;
  background-color: #009f04 !important;
  color: #fff !important;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.free-use-btn:hover {
  background-color: #008a03 !important;
  transform: translateX(-50%) scale(1.05);
}

/* 响应式 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    min-width: 100%;
  }
}
</style>
