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
            <!-- 海报叠加层 -->
            <div class="poster-overlay">
              <!-- 微信二维码：正中间偏上 -->
              <div class="qr-code-section">
                <img
                  src="@/assets/images/wx-open-qr.jpg"
                  alt="微信二维码"
                  class="qr-code-image"
                />
              </div>
              
              <!-- 品牌名称：四分之三位置 -->
              <div class="brand-name-section">
                <span class="brand-name">趣加速</span>
              </div>
              
              <!-- 底部推广链接 -->
              <div class="promo-link-section">
                <div class="promo-link-text">
                  {{ promoLink }}
                </div>
                <el-button
                  type="primary"
                  size="small"
                  class="copy-link-btn"
                  @click="copyLink"
                >
                  专属推广链接
                </el-button>
              </div>
            </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userInfo } from '@/store/user'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 弹窗控制
const showPasswordDialog = ref(false)

// 计算推广链接
const promoLink = computed(() => {
  const code = userInfo.invitationCode || ''
  return `www.qujiasu.com?c=${code}`
})

// 复制到剪贴板
const copyLink = () => {
  const link = promoLink.value
  navigator.clipboard.writeText(link).then(() => {
    ElMessage.success('推广链接已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

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
  position: relative;
}

.poster-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
}

/* 海报叠加层 */
.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  pointer-events: none;
}

/* 二维码区域 */
.qr-code-section {
  margin-top: 39%;
  pointer-events: auto;
}

.qr-code-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border: 4px solid white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 品牌名称区域 */
.brand-name-section {
  position: absolute;
  top: 64.5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 20px;
  color: #000000;
}

.brand-name {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 底部推广链接区域 */
.promo-link-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  text-align: center;
  width: 100%;
  max-width: 280px;
}

.promo-link-text {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  word-break: break-all;
  font-family: monospace;
}

.copy-link-btn {
  width: 100%;
  font-weight: bold;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .qr-code-image {
    width: 100px;
    height: 100px;
  }

  .brand-name {
    font-size: 24px;
  }

  .promo-link-section {
    max-width: 100%;
    padding: 10px 16px;
  }

  .promo-link-text {
    font-size: 11px;
  }
}
</style>
