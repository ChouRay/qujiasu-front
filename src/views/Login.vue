<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录页面</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.login-box h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}
</style>
