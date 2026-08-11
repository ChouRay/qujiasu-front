<template>
  <div class="center-home">
    <div class="welcome-card">
      <h2>欢迎来到我的中心</h2>
      <p>请从左侧菜单选择您需要的功能</p>
    </div>
    
    <div class="quick-menu">
      <div class="menu-card" @click="$router.push('/center/orders')">
        <el-icon :size="40" color="#667eea"><List /></el-icon>
        <h3>订单管理</h3>
        <p>查看您的所有订单记录</p>
      </div>
      <div class="menu-card" @click="$router.push('/center/recharge')">
        <el-icon :size="40" color="#667eea"><Wallet /></el-icon>
        <h3>账户充值</h3>
        <p>为您的账户进行充值</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { List, Wallet } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.center-home {
  .welcome-card {
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
    text-align: center;
    
    h2 {
      margin: 0 0 10px;
      font-size: 24px;
      color: #333;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
  
  .quick-menu {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    
    .menu-card {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
      }
      
      h3 {
        margin: 16px 0 8px;
        font-size: 18px;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #999;
        font-size: 13px;
      }
    }
  }
}
</style>
