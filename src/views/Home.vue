<template>
  <div class="home-page">
    <!-- 轮播图/横幅区域 -->
    <section class="banner-section">
      <div class="banner-container">
        <div class="banner-content">
          <h1 class="banner-title">趣加速 - 专业网络加速服务</h1>
          <p class="banner-subtitle">提供稳定、安全、快速的网络加速解决方案</p>
          <p class="banner-desc">国内节点覆盖，智能路由选择，7x24小时技术支持</p>
          
          <!-- 特性图标 -->
          <div class="banner-features">
            <div class="feature-item">
              <div class="feature-icon" :style="{ backgroundImage: `url(${iconSafe})` }"></div>
              <span>安全</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon" :style="{ backgroundImage: `url(${iconAnonymous})` }"></div>
              <span>高匿</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon" :style="{ backgroundImage: `url(${iconRocket})` }"></div>
              <span>极速</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon" :style="{ backgroundImage: `url(${iconStable})` }"></div>
              <span>稳定</span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="banner-actions">
            <el-button type="success" size="large" round @click="goToDownload">
              立即下载
            </el-button>
            <el-button type="danger" size="large" round @click="goToPurchase">
              购买套餐
            </el-button>
          </div>
        </div>
		<div class="banner-image"></div>
      </div>
    </section>

    <!-- 产品展示区 -->
    <section class="product-section">
      <div class="section-header">
        <h2 class="section-title">我们的优势</h2>
        <p class="section-subtitle">为什么选择趣加速</p>
      </div>
      
      <div class="product-cards">
        <div class="product-card">
          <div class="card-image placeholder-img-medium">
            <img width="288px" :src="cardFast" />
          </div>
          <div class="card-content">
            <h3 class="card-title">极速稳定</h3>
            <p class="card-desc">采用最先进的加速技术，确保网络连接快速稳定</p>
          </div>
        </div>
        
        <div class="product-card">
          <div class="card-image placeholder-img-medium">
            <img width="288px" :src="cardSafe" />
          </div>
          <div class="card-content">
            <h3 class="card-title">安全保障</h3>
            <p class="card-desc">多重加密保护，您的数据安全我们始终放在第一位</p>
          </div>
        </div>
        
        <div class="product-card">
          <div class="card-image placeholder-img-medium">
            <img width="288px" :src="cardService" />
          </div>
          <div class="card-content">
            <h3 class="card-title">专业服务</h3>
            <p class="card-desc">7x24小时专业技术支持，随时为您解决问题</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import iconSafe from '@/assets/images/icon-safe.png'
import iconAnonymous from '@/assets/images/icon-anonymous.png'
import iconRocket from '@/assets/images/icon-rocket.png'
import iconStable from '@/assets/images/icon-stable.png'
import cardFast from '@/assets/images/card-fast.png'
import cardSafe from '@/assets/images/card-safe.png'
import cardService from '@/assets/images/card-service.png'

const router = useRouter()

const goToDownload = () => {
  router.push('/download')
}

const goToPurchase = () => {
  router.push('/package')
}
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 轮播图/横幅区域 */
.banner-section {
  background-image: url('@/assets/images/banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.banner-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  box-sizing: border-box;
  padding: 0 20px;
}

.banner-content {
  flex: 1;
  color: #fff;
}

.banner-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  letter-spacing: 2px;
  line-height: 1.3;
  color: #027cff;
}

.banner-subtitle {
  font-size: 1.5rem;
  margin-bottom: 16px;
  opacity: 0.95;
  color: #212529;
}

.banner-desc {
  font-size: 1.1rem;
  margin-bottom: 42px;
  opacity: 0.9;
  color: #212529;
}

.banner-features {
  display: flex;
  gap: 32px;
  margin-bottom: 42px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #212529;
}

.feature-icon {
  width: 47px;
  height: 47px;
  border-radius: 8px;
}

.feature-item span {
  font-size: 14px;
  color: #212529;
}

.banner-actions {
  display: flex;
  gap: 16px;
}

.banner-actions .el-button {
  width: 200px;
  height: 46px;
  font-size: 16px;
  font-weight: bold;
}

.banner-image {
  flex: 1;
  max-width: 600px;
  height: 500px;
  border-radius: 16px;
  background-image: url('@/assets/images/img-product.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 产品展示区 */
.product-section {
  background-color: #fff;
  padding: 60px 0;
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: 65px;
  padding: 0 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #666;
}

.product-cards {
  width: 100%;
  max-width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.product-card {
  width: 288px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  background-color: #e8ecf1;
}

.card-content {
  padding: 24px;
  text-align: center;
}

.card-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.card-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

/* 占位图样式 */
.placeholder-img {
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.placeholder-img-medium {
  background: linear-gradient(135deg, #d0d5dd 0%, #e8ecf1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.placeholder-img-large {
  background: linear-gradient(135deg, #c0c8d1 0%, #d8e0e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
  font-weight: bold;
}

.placeholder-img-large::after {
  content: '大幅图片占位';
}

/* 响应式设计 */
@media (max-width: 992px) {
  .banner-container {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-features {
    justify-content: center;
  }
  
  .banner-actions {
    justify-content: center;
  }
  
  .banner-image {
    width: 100%;
    max-width: 500px;
    height: 400px;
  }
  
  .banner-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .banner-section {
    padding: 40px 15px;
    min-height: auto;
  }
  
  .banner-title {
    font-size: 1.8rem;
  }
  
  .banner-subtitle {
    font-size: 1.2rem;
  }
  
  .banner-desc {
    font-size: 1rem;
  }
  
  .banner-features {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .banner-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .banner-actions .el-button {
    width: 100%;
    max-width: 280px;
  }
  
  .product-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .product-card {
    width: 100%;
    max-width: 340px;
  }
}
</style>
