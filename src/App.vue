<template>
  <!-- 判断是否为用户中心页面，如果是则不显示 header 和 footer -->
  <template v-if="isCenterPage">
    <router-view />
  </template>
  
  <template v-else>
    <div class="app-container">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="header-content">
          <!-- 移动端汉堡菜单按钮 -->
          <div class="mobile-menu-btn" @click="drawerVisible = true">
            <el-icon :size="24" color="#fff"><Menu /></el-icon>
          </div>

          <div class="logo" @click="handleLogoClick">
            <img src="@/assets/images/logo.png" alt="趣加速 logo" class="logo-img" />
            <h1>趣加速</h1>
          </div>

          <!-- 桌面端导航菜单 -->
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
              <el-menu-item index="/download" key="download">软件下载</el-menu-item>
              <el-menu-item index="/agent" key="agent">代理加盟</el-menu-item>
            </el-menu>
          </nav>

          <div class="auth-buttons">
            <template v-if="isLoggedIn">
              <el-button type="primary" @click="handleUserCenter">会员中心</el-button>
            </template>
            <template v-else>
              <el-button type="primary" variant="outline" @click="handleRegister">注册</el-button>
              <el-button type="primary" @click="handleLogin">登录</el-button>
            </template>
          </div>
        </div>
      </header>

      <!-- 移动端侧边抽屉导航 -->
      <el-drawer
        v-model="drawerVisible"
        direction="ltr"
        size="280px"
        class="mobile-drawer"
        :show-close="true"
      >
        <template #header>
          <div class="drawer-header">
            <img src="@/assets/images/logo.png" alt="趣加速 logo" class="drawer-logo" />
            <span class="drawer-title">趣加速</span>
          </div>
        </template>
        
        <el-menu
          :default-active="activeTab"
          mode="vertical"
          @select="handleDrawerMenuSelect"
          class="drawer-menu"
        >
          <el-menu-item index="/" key="drawer-home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/package" key="drawer-package">
            <el-icon><ShoppingCart /></el-icon>
            <span>套餐购买</span>
          </el-menu-item>
          <el-menu-item index="/doawload" key="drawer-download">
            <el-icon><Download /></el-icon>
            <span>软件下载</span>
          </el-menu-item>
          <el-menu-item index="/agent" key="drawer-agent">
            <el-icon><UserFilled /></el-icon>
            <span>代理加盟</span>
          </el-menu-item>
        </el-menu>
      </el-drawer>

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
              Copyright© 趣加速 (qujiasu.com) 版权所有。
              湘 ICP 备 20251xxx482 号 -1, 
              湘公网安备 43011xxx002354 号
            </p>
          </div>
        </div>
      </footer>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, HomeFilled, ShoppingCart, Download, UserFilled } from '@element-plus/icons-vue'
import imgWXOpenQR from '@/assets/images/wx-open-qr.jpg'

const route = useRoute()
const router = useRouter()
const drawerVisible = ref(false)

// 登录状态
const isLoggedIn = ref(false)

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

// 监听存储变化（用于登录后更新状态）
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'token') {
    checkLoginStatus()
  }
}

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('storage', handleStorageChange)
})

// 判断是否为中心页面（/center 及其子路由）
const isCenterPage = computed(() => {
  return route.path.startsWith('/center')
})

const activeTab = computed(() => {
  return route.path
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleDrawerMenuSelect = (index: string) => {
  router.push(index)
  drawerVisible.value = false
}

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  router.push('/register')
}

const handleUserCenter = () => {
  router.push('/center')
}

const handleLogoClick = () => {
  router.push('/')
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
  cursor: pointer;
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

/* 移动端汉堡菜单按钮 - 默认隐藏 */
.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.mobile-menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
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

/* 移动端抽屉样式 */
.drawer-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.drawer-title {
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
}

.drawer-menu {
  border-right: none !important;
}

.drawer-menu :deep(.el-menu-item) {
  font-size: 16px;
  color: #333;
}

.drawer-menu :deep(.el-menu-item.is-active) {
  background-color: #667eea !important;
  color: #fff !important;
}

.drawer-menu :deep(.el-icon) {
  margin-right: 10px;
  font-size: 20px;
}

/* 响应式设计 - 手机端适配 */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
    order: 0;
  }

  .logo {
    order: 1;
    margin-left: 12px;
  }

  .nav-menu {
    display: none;
  }

  .header-content {
    padding: 0 15px;
    justify-content: flex-start;
  }

  .auth-buttons {
    display: flex;
    order: 2;
    margin-left: auto;
    gap: 8px;
  }

  .auth-buttons .el-button {
    padding: 6px 10px;
    font-size: 13px;
  }

  .logo h1 {
    font-size: 18px;
  }

  .logo-img {
    height: 42px;
  }
}
</style>
