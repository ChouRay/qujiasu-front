<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="趣加速 logo" class="logo-img" />
          <h1>趣加速</h1>
        </div>
        <nav class="nav-menu">
          <el-menu
            mode="horizontal"
            :ellipsis="false"
            :default-active="activeTab"
            class="nav-menu-inner"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/" key="home">首页</el-menu-item>
            <el-menu-item index="/package" key="package">套餐购买</el-menu-item>
            <el-menu-item index="/software" key="software">软件下载</el-menu-item>
            <el-menu-item index="/agent" key="agent">代理加盟</el-menu-item>
          </el-menu>
        </nav>
        <div class="auth-buttons">
          <el-button type="primary" variant="outline">注册</el-button>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </div>
      </div>
    </header>

    <!-- 中间内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部信息栏 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>联系方式</h3>
          <p>联系电话：135xxxxx1234</p>
          <p>商务合作 QQ: 232332</p>
          <p>售后 QQ: 2112212</p>
        </div>
        <div class="footer-section">
          <h3>官方微信公众号</h3>
          <div class="qrcode-content">
            <div class="qrcode-box">
              <img width='100%' :src="imgWXOpenQR"/>
            </div>
          </div>
        </div>
        <div class="footer-section full-width">
          <p class="copyright">
            Copyright© 趣加速 (qujiasu.com) 版权所有. 
            湘 ICP 备 20251xxx482 号 -1, 
            湘公网安备 43011xxx002354 号
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import imgWXOpenQR from '@/assets/images/wx-open-qr.jpg'

const route = useRoute()
const router = useRouter()

const activeTab = computed(() => {
  return route.path
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 全局样式重置 - 消除浏览器默认边距 */
:global(html),
:global(body) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 2px;
}

.logo-img {
  height: 68px;
  width: auto;
  object-fit: contain;
}

.logo h1 {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-menu-inner {
  background: transparent !important;
  border: none !important;
}

.nav-menu-inner :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 16px;
  border: none !important;
}

.nav-menu-inner :deep(.el-menu-item:hover),
.nav-menu-inner :deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.auth-buttons .el-button {
  border-color: #fff;
  color: #fff;
}

.auth-buttons .el-button--primary {
  background-color: #fff;
  color: #667eea;
  border-color: #fff;
}

.auth-buttons .el-button--primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.main-content {
  flex: 1;
  width: 100%;
  margin: 0 auto;
  background-color: #f5f7fa;
}

.footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 40px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section.full-width {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #3498db;
}

.footer-section p {
  font-size: 14px;
  line-height: 2;
  margin: 5px 0;
  color: #bdc3c7;
}

.qrcode-box {
  width: 140px;
  height: 140px;
  background: #34495e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 12px;
}
.qrcode-content {
}

.copyright {
  font-size: 13px;
  color: #95a5a6;
  margin: 0;
}
</style>
