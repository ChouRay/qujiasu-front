<template>
  <div class="user-center-index">
    <el-row :gutter="20">
      <!-- 左侧：会员信息 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <el-card class="user-info-card">
          <template #header>
            <div class="card-header">
              <span>会员信息</span>
            </div>
          </template>

          <div class="user-basic-info">
            <!-- 用户名 -->
            <div class="info-row">
              <span class="label">用户名：</span>
              <span class="value">{{ userInfo.username || '-' }}</span>
            </div>

            <!-- 手机号 + 修改密码 -->
            <div class="info-row">
              <span class="label">手机号：</span>
              <span class="value">{{ userInfo.phoneNumber || '-' }}</span>
              <el-button 
                type="primary" 
                link 
                class="action-btn"
                @click="showPasswordDialog = true"
              >
                修改密码
              </el-button>
            </div>

            <!-- 余额 + 充值 -->
            <div class="info-row highlight-row">
              <span class="label">账户余额：</span>
              <span class="value money">¥{{ formatNumber(userInfo.userBalance) }}</span>
              <el-button 
                type="warning" 
                size="small" 
                class="recharge-btn"
                @click="handleRecharge"
              >
                充值
              </el-button>
            </div>

            <!-- 消费券金额 -->
            <div class="info-row">
              <span class="label">消费券金额：</span>
              <span class="value money">¥{{ formatNumber(userInfo.userReward) }}</span>
            </div>

            <!-- 实名认证占位 -->
            <div class="info-row">
              <span class="label">实名认证：</span>
              <span class="value">
                <el-tag v-if="userInfo.isCertifyOk" type="success">已认证</el-tag>
                <el-tag v-else type="info">未认证</el-tag>
              </span>
            </div>
          </div>

          <!-- 详细数据网格 -->
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">累计消费</div>
              <div class="stat-value">¥{{ formatNumber(userInfo.totalCost) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">折扣/返佣比率</div>
              <div class="stat-value">{{ formatPercent(userInfo.dividendRatio) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">佣金余额</div>
              <div class="stat-value money">¥{{ formatNumber(userInfo.agentIncome) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">累计佣金</div>
              <div class="stat-value money">¥{{ formatNumber(userInfo.totalAgentIncome) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">推广人数</div>
              <div class="stat-value">{{ userInfo.totalInviteCount || 0 }}人</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">我的推广码</div>
              <div class="stat-value code">{{ userInfo.invitationCode || '-' }}</div>
            </div>
            <div class="stat-item full-width">
              <div class="stat-label">上一次登录IP</div>
              <div class="stat-value">{{ userInfo.lastLoginIp || '-' }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：推广海报 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card class="poster-card">
          <div class="poster-wrapper">
            <img 
              src="@/assets/images/affi-poster.png" 
              alt="推广海报" 
              class="poster-image"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码弹窗（预留） -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="400px"
      destroy-on-close
    >
      <p>修改密码功能开发中...</p>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userInfo } from '@/store/user'

const router = useRouter()

// 弹窗控制
const showPasswordDialog = ref(false)

// 格式化数字（保留两位小数）
const formatNumber = (num: any) => {
  if (!num && num !== 0) return '0.00'
  return Number(num).toFixed(2)
}

// 格式化百分比
const formatPercent = (ratio: any) => {
  if (!ratio && ratio !== 0) return '0%'
  return (Number(ratio) * 100).toFixed(1) + '%'
}

// 处理充值跳转
const handleRecharge = () => {
  router.push('/center/recharge')
}
</script>

<style scoped lang="scss">
.user-center-index {
  padding: 20px;
}

.user-info-card,
.poster-card {
  height: 100%;
  border-radius: 12px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.user-basic-info {
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.info-row .label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.info-row .value {
  color: #333;
  font-weight: 500;
}

.info-row .value.money {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.info-row .value.code {
  font-family: monospace;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.highlight-row {
  background: #fdf6ec;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.action-btn {
  margin-left: 12px;
}

.recharge-btn {
  margin-left: 12px;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  background: #f9fafc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.stat-item.full-width {
  grid-column: 1 / -1;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.stat-value.money {
  color: #67c23a;
}

.poster-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.poster-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .user-center-index {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .info-row {
    flex-wrap: wrap;
  }

  .info-row .label {
    width: 100%;
    margin-bottom: 4px;
  }

  .highlight-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-btn,
  .recharge-btn {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
