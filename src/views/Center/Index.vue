<template>
  <div class="center-container">
    <h1>我的中心</h1>
    <div class="menu-list">
      <div class="menu-item" @click="$router.push('/center/orders')">
        <span>订单管理</span>
      </div>
      <div class="menu-item" @click="$router.push('/center/recharge')">
        <span>账户充值</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 我的中心首页 - 导航入口
</script>

<style scoped>
.center-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.menu-item:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}
</style>
