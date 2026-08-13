<template>
  <div class="center-layout">
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
        <h2 v-show="!isMobile || isMenuOpen">用户中心</h2>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          :mode="'vertical'"
          :collapse="isMobile && !isMenuOpen"
          @select="handleMenuSelect"
          class="nav-menu"
        >
          <el-menu-item index="/center">
            <el-icon><User /></el-icon>
            <span>我的中心</span>
          </el-menu-item>
          <el-menu-item index="/center/buy">
            <el-icon><ShoppingTrolley /></el-icon>
            <span>套餐购买</span>
          </el-menu-item>
          <el-menu-item index="/center/orders">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/center/recharge">
            <el-icon><Wallet /></el-icon>
            <span>账户充值</span>
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
      <!-- 顶部退出按钮 -->
      <header class="content-header">
        <div class="header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <el-button type="danger" @click="handleLogout" class="logout-btn">
          <el-icon><SwitchButton /></el-icon>
          <span v-show="!isMobile">退出登录</span>
        </el-button>
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
import { User, List, Wallet, SwitchButton ,ShoppingTrolley,HomeFilled, Fold, Expand} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserInfo } from '@/api/user'
import { logout } from '@/api/auth'
import { clearUserInfo } from '@/store/user'
import type { UserInfo } from '@/types/user'

const route = useRoute()
const router = useRouter()

const userInfo = ref<UserInfo | null>(null)
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

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = res as UserInfo
    console.log('用户信息加载成功:', res)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请重新登录')
    router.push('/login')
  }
}

onMounted(() => {
  loadUserInfo()
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
    '/center': '我的中心',
    '/center/buy': '套餐购买',
    '/center/orders': '订单管理',
    '/center/recharge': '账户充值'
  }
  return titleMap[route.path] || '我的中心'
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 调用退出登录 API
    await logout()
  } catch (error) {
    // 用户取消退出或 API 调用失败，但仍需清理本地状态
    if ((error as any) !== 'cancel') {
      console.error('退出登录 API 调用失败:', error)
    }
  } finally {
    // 无论 API 是否成功，都清除本地 token 和用户信息
    localStorage.removeItem('token')
    clearUserInfo()
    
      // 手动触发 storage 事件，通知 App.vue 更新状态
      window.dispatchEvent(new StorageEvent('storage', { 
        key: 'token', 
        newValue: null 
      }))
    ElMessage.success('已退出登录')
    router.push('/')
  }
}
</script>

<style scoped lang="scss">
.center-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧导航栏 */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
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
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }
}

/* 移动端菜单切换按钮 */
.menu-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
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

/* 遮罩层已移除，不再需要 */

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

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .el-icon {
    font-size: 18px;
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
  
  /* 移动端内容区域 margin-left 由内联样式动态控制 */
  
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
  
  .logout-btn {
    span {
      display: none;
    }
  }
}
</style>
