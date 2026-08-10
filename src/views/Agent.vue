<template>
  <div class="agent-page">
    <header class="page-header">
      <h1>成为VIP会员/代理商获取高额折扣和推广奖励</h1>
      <p class="subtitle">全网最高返佣奖励，不论是新用户购买，还是后续的续费，都享受同样的返佣比率</p>
    </header>

    <main class="content">
      <!-- VIP会员部分 -->
      <section class="membership-section">
        <h2 class="section-title">预充值成为VIP会员</h2>
        <div class="vip-cards">
          <!-- 普通会员 -->
          <div class="card normal">
            <div class="card-header">
              <h3>普通会员</h3>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">佣金比例</span>
                <span class="value highlight">20%</span>
              </div>
              <div class="benefit-item">
                <span class="label">购买折扣</span>
                <span class="value">无</span>
              </div>
            </div>
            <div class="action">
              <button class="btn btn-disabled" disabled>当前等级</button>
            </div>
          </div>

          <!-- 铜牌会员 -->
          <div class="card bronze">
            <div class="card-header">
              <h3>铜牌会员</h3>
              <span class="price">¥1,000</span>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">佣金/折扣</span>
                <span class="value highlight">20%</span>
              </div>
              <div class="benefit-item">
                <span class="label">有效期</span>
                <span class="value">90天</span>
              </div>
            </div>
            <div class="action">
              <button class="btn btn-primary" @click="handleRecharge('bronze')">立即充值</button>
            </div>
          </div>

          <!-- 银牌会员 -->
          <div class="card silver">
            <div class="card-header">
              <h3>银牌会员</h3>
              <span class="price">¥2,000</span>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">佣金/折扣</span>
                <span class="value highlight">28%</span>
              </div>
              <div class="benefit-item">
                <span class="label">有效期</span>
                <span class="value">90天</span>
              </div>
            </div>
            <div class="action">
              <button class="btn btn-primary" @click="handleRecharge('silver')">立即充值</button>
            </div>
          </div>

          <!-- 金牌会员 -->
          <div class="card gold">
            <div class="card-header">
              <h3>金牌会员</h3>
              <span class="price">¥5,000</span>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">佣金/折扣</span>
                <span class="value highlight">36%</span>
              </div>
              <div class="benefit-item">
                <span class="label">有效期</span>
                <span class="value">90天</span>
              </div>
            </div>
            <div class="action">
              <button class="btn btn-primary" @click="handleRecharge('gold')">立即充值</button>
            </div>
          </div>
        </div>

        <!-- VIP会员补充说明 -->
        <div class="info-box vip-rules">
          <h4><span class="icon">ℹ️</span> VIP会员规则说明</h4>
          <ul>
            <li>充值后自动成为对应等级VIP会员</li>
            <li>会员到期后将降级为普通会员，再次充值可恢复对应等级</li>
            <li>单笔充值相应金额并完成实名认证后自动激活VIP身份</li>
          </ul>
        </div>
      </section>

      <!-- 代理商部分 -->
      <section class="agent-section">
        <h2 class="section-title">申请成为代理商</h2>
        <div class="agent-cards">
          <!-- 铜牌代理商 -->
          <div class="card bronze agent-card">
            <div class="card-header">
              <h3>铜牌代理商</h3>
              <span class="commission-rate">佣金 20%</span>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">有效期</span>
                <span class="value">90天</span>
              </div>
              <div class="benefit-item">
                <span class="label">每月最低推荐人数</span>
                <span class="value highlight">10人</span>
              </div>
              <div class="benefit-item">
                <span class="label">预计月佣金</span>
                <span class="value highlight">¥1,000</span>
              </div>
            </div>
            <div class="upgrade-rules">
              <div class="rule downgrade">⬇️ 连续6个月不满足：降为普通会员</div>
              <div class="rule upgrade">⬆️ 连续3个月满足：升为银牌代理商</div>
            </div>
            <div class="action">
              <button class="btn btn-outline" @click="handleApply('bronze')">申请成为代理商</button>
            </div>
          </div>

          <!-- 银牌代理商 -->
          <div class="card silver agent-card">
            <div class="card-header">
              <h3>银牌代理商</h3>
              <span class="commission-rate">佣金 28%</span>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">有效期</span>
                <span class="value">90天</span>
              </div>
              <div class="benefit-item">
                <span class="label">每月最低推荐人数</span>
                <span class="value highlight">20人</span>
              </div>
              <div class="benefit-item">
                <span class="label">预计月佣金</span>
                <span class="value highlight">¥2,000</span>
              </div>
            </div>
            <div class="upgrade-rules">
              <div class="rule downgrade">⬇️ 连续6个月不满足：降为铜牌代理商</div>
              <div class="rule upgrade">⬆️ 连续3个月满足：升为金牌代理商</div>
            </div>
            <div class="action">
              <button class="btn btn-outline" @click="handleApply('silver')">申请成为代理商</button>
            </div>
          </div>

          <!-- 金牌代理商 -->
          <div class="card gold agent-card">
            <div class="card-header">
              <h3>金牌代理商</h3>
              <span class="commission-rate">佣金 36%</span>
            </div>
            <div class="benefits">
              <div class="benefit-item">
                <span class="label">有效期</span>
                <span class="value">90天</span>
              </div>
              <div class="benefit-item">
                <span class="label">每月最低推荐人数</span>
                <span class="value highlight">50人</span>
              </div>
              <div class="benefit-item">
                <span class="label">预计月佣金</span>
                <span class="value highlight">¥5,000</span>
              </div>
            </div>
            <div class="upgrade-rules">
              <div class="rule downgrade">⬇️ 连续6个月不满足：降为银牌代理商</div>
              <div class="rule keep">✅ 连续3个月满足：保持金牌等级</div>
            </div>
            <div class="action">
              <button class="btn btn-outline" @click="handleApply('gold')">申请成为代理商</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const handleRecharge = (level: string) => {
  const levelNames: Record<string, string> = {
    bronze: '铜牌',
    silver: '银牌',
    gold: '金牌'
  }
  ElMessage.info(`即将跳转到${levelNames[level]}会员充值页面`)
  // TODO: 实现充值跳转逻辑
}

const handleApply = (level: string) => {
  const levelNames: Record<string, string> = {
    bronze: '铜牌',
    silver: '银牌',
    gold: '金牌'
  }
  ElMessage.info(`即将跳转到${levelNames[level]}代理商申请表单`)
  // TODO: 实现申请跳转逻辑
}
</script>

<style scoped>
.agent-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  color: #1a1a1a;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
  line-height: 1.6;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.section-title {
  text-align: center;
  color: #1a1a1a;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 30px 0;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #409EFF, #67C23A);
  border-radius: 2px;
}

/* 卡片网格布局 */
.vip-cards,
.agent-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

/* 卡片基础样式 */
.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 30px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* 等级颜色主题 */
.card.normal {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-color: #dcdfe6;
}

.card.bronze {
  background: linear-gradient(135deg, #fef5e7 0%, #faecd8 100%);
  border-color: #e6c58c;
}

.card.silver {
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  border-color: #bcccdc;
}

.card.gold {
  background: linear-gradient(135deg, #fff7e6 0%, #ffecc2 100%);
  border-color: #ffd700;
}

/* 卡片头部 */
.card-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-header h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
}

.card.bronze .card-header h3,
.card.silver .card-header h3,
.card.gold .card-header h3 {
  color: #d48806;
}

.price,
.commission-rate {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(90deg, #409EFF, #67C23A);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
}

/* 权益列表 */
.benefits {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.benefit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
}

.benefit-item:last-child {
  border-bottom: none;
}

.label {
  color: #606266;
  font-size: 14px;
}

.value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.value.highlight {
  color: #e6a23c;
  font-weight: 700;
  font-size: 16px;
}

/* 按钮样式 */
.action {
  margin-top: auto;
}

.btn {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-disabled {
  background: #dcdfe6;
  color: #909399;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(90deg, #409EFF, #67C23A);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.btn-outline {
  background: transparent;
  color: #409EFF;
  border: 2px solid #409EFF;
}

.btn-outline:hover {
  background: #409EFF;
  color: white;
}

/* 升降级规则 */
.upgrade-rules {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 13px;
  line-height: 1.6;
}

.rule {
  padding: 4px 0;
}

.rule.downgrade {
  color: #f56c6c;
}

.rule.upgrade,
.rule.keep {
  color: #67c23a;
}

/* 信息框 */
.info-box {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 24px;
  margin-top: 30px;
}

.info-box h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.info-box li {
  margin-bottom: 10px;
  line-height: 1.6;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agent-page {
    padding: 30px 15px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .section-title {
    font-size: 20px;
  }

  .vip-cards,
  .agent-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card {
    padding: 24px 20px;
  }

  .card-header h3 {
    font-size: 20px;
  }

  .benefit-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .value.highlight {
    font-size: 15px;
  }

  .btn {
    padding: 12px 16px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .card-header h3 {
    font-size: 18px;
  }

  .price,
  .commission-rate {
    font-size: 12px;
    padding: 4px 12px;
  }
}
</style>
