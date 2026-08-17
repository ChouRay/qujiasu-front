<template>
  <div class="affiliate-layout">
    <!-- 左侧导航栏 -->
    <aside 
      :class="['sidebar', { 'sidebar-collapsed': isMobile && !isMenuOpen }]"
      :style="{ width: isMobile ? (isMenuOpen ? '240px' : '64px') : '240px' }"
    >
      <div class="sidebar-header">
        <!-- 移动端切换按钮 -->
        <button v-if="isMobile" class="menu-toggle" @click="toggleMenu">
          <el-icon><Fold v-if="isMenuOpen" /><Expand v-else /></el-icon>
        </button>
        <h2 v-show="!isMobile || isMenuOpen">推广管理</h2>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          :mode="'vertical'"
          :collapse="isMobile && !isMenuOpen"
          @select="handleMenuSelect"
          class="nav-menu"
        >
          <el-menu-item index="/affiliate/manager">
            <el-icon><Promotion /></el-icon>
            <span>推广管理</span>
          </el-menu-item>
          <el-menu-item index="/affiliate/commissions">
            <el-icon><Coin /></el-icon>
            <span>佣金记录</span>
          </el-menu-item>
          <el-menu-item index="/affiliate/withdrawals">
            <el-icon><Wallet /></el-icon>
            <span>提现记录</span>
          </el-menu-item>
          <el-menu-item index="/affiliate/invited-users">
            <el-icon><User /></el-icon>
            <span>推广会员</span>
          </el-menu-item>
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>回到首页</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </aside>

    <!-- 右侧内容区 -->
    <main class="main-content" :style="{ marginLeft: isMobile ? (isMenuOpen ? '240px' : '64px') : '240px' }">
      <!-- 顶部标题 -->
      <header class="content-header">
        <div class="header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="content-body">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Promotion, Coin, Wallet, User, HomeFilled, Fold, Expand } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const isMobile = ref(false)
const isMenuOpen = ref(false)

// 检测屏幕宽度
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMenuOpen.value = true
  } else {
    isMenuOpen.value = false
  }
}

// 切换菜单展开/收起
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const activeMenu = computed(() => {
  return route.path
})

const currentPageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    '/affiliate/manager': '推广管理',
    '/affiliate/commissions': '佣金记录',
    '/affiliate/withdrawals': '提现记录',
    '/affiliate/invited-users': '推广会员'
  }
  return titleMap[route.path] || '推广管理'
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}
</script>

<style scoped lang="scss">
.affiliate-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧导航栏 */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #11998e 0%, #38ef7d 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  transition: width 0.3s ease;
}

/* 移动端收起状态 */
.sidebar-collapsed {
  width: 64px !important;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  
  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }
}

/* 菜单切换按钮 */
.menu-toggle {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .el-icon {
    font-size: 20px;
  }
}

/* 移动端特殊样式 */
@media (max-width: 768px) {
  .sidebar-header {
    padding: 15px 10px;
    flex-direction: column;
    align-items: stretch;
    
    h2 {
      font-size: 16px;
      text-align: center;
      margin: 8px 0;
      order: 2;
    }
    
    .menu-toggle {
      order: 1;
      align-self: flex-end;
      margin-bottom: 8px;
    }
  }
}

.sidebar-nav {
  flex: 1;
  padding-top: 20px;
  
  .nav-menu {
    background: transparent !important;
    border-right: none !important;
    
    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.9) !important;
      font-size: 15px;
      height: 50px;
      line-height: 50px;
      margin: 4px 12px;
      border-radius: 8px;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
      
      &.is-active {
        background-color: rgba(255, 255, 255, 0.3) !important;
        color: #fff !important;
      }
      
      .el-icon {
        margin-right: 12px;
        font-size: 18px;
      }
    }
    
    /* 移动端收起状态下图标左移调整 */
    :deep(.sidebar-collapsed .el-menu-item) {
      padding-left: 62px !important;
      
      .el-icon {
        margin-right: 0 !important;
      }
    }
  }
}

/* 右侧内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-header {
  background: #fff;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title {
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
}

.content-body {
  flex: 1;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
    
    &.sidebar-collapsed {
      width: 64px;
    }

    .nav-menu {
    background: transparent !important;
    border-right: none !important;
    
    :deep(.el-menu-item) {
      .el-icon {
        font-size: 18px;
        transform: translateX(-12px);
      }
    }
    
    /* 收起模式下只显示图标 */
    :deep(&.el-menu--collapse) {
      .el-menu-item {
        padding: 0 !important;
        padding-right: 32px !important;
        justify-content: center !important;
        
        .el-icon {
          margin-right:52px !important;
        }
        
        span {
          display: none !important;
        }
      }
    }
    
    /* 移动端收起状态下图标左移调整 */
    :deep(.sidebar-collapsed .el-menu-item) {
      padding-left: 62px !important;
      
      .el-icon {
        margin-right: 0 !important;
      }
    }
  }
  }
  
  .sidebar-header {
    padding: 20px 10px;
    
    h2 {
      font-size: 16px;
    }
  }
  
  .content-header {
    padding: 15px 20px;
  }
  
  .content-body {
    padding: 20px 15px;
  }
}
</style>
