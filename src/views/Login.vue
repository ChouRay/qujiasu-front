<template>
  <div class="bg_main">
    <div class="container">
      <div class="hero">
        <div class="background-image"></div>
        <div class="bottom-left-text">
          <h2>稳定 高效 就用趣加速</h2>
        </div>
        <div class="right-panel">
          <div>
            <div class="login-title">账户登录</div>
            <el-form
              :model="loginform"
              ref="loginform"
              class="input1"
              @submit.native.prevent
              @keyup.enter.native="submitForm('loginform')"
              size="mini"
            >
              <el-form-item prop="accountnum">
                <el-input
                  v-model="loginform.accountnum"
                  auto-complete="off"
                  placeholder="请输入手机号或者用户名"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="loginform.password"
                  auto-complete="off"
                  placeholder="请输入密码"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item class="mt-4">
                <el-button
                  type="primary"
                  @click="submitForm('loginform')"
                  style="width: 100%; letter-spacing: 0.2rem"
                  class="fpx16"
                  >登录</el-button
                >

                <div style="overflow: hidden; margin-top: 6px">
                  <div
                    class="loginbtn"
                    style="float: left"
                    @click="gotoRegester"
                  >
                    没有账号？立即注册
                  </div>
                  <a
                    class="forgetPass"
                    style="float: right"
                    @click.prevent="fgPwd"
                    >忘记密码?</a
                  >
                </div>
                <div class="mt-5">
                  <div content-position="center"
                    ><span style="color: #020202"
                      >其他登录方式</span
                    ></div>
                  <div class="text-center text-nowrap mt-3 f-1-2 cursor">
                    <img
                      src="@/assets/images/icon-wechat.png"
                      alt=""
                      style="vertical-align: middle; height: 2.5rem;"
                      class="mr-1"
                      @click="wxLogin"
                    />
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginform = ref({
  accountnum: '',
  password: ''
})

const submitForm = (formName: string) => {
  console.log('提交登录表单', formName)
}

const gotoRegester = () => {
  console.log('前往注册')
}

const fgPwd = () => {
  console.log('忘记密码')
}

const wxLogin = () => {
  console.log('微信登录')
}
</script>

<style scoped lang="scss">
/* 响应式设计 */
@media (max-width: 1200px) {
  .background-image {
    display: none;
  }
  .right-panel {
    justify-content: center;
    align-items: center;
    width: 50% !important;
    margin-right: 0px;
    transform: translate(-50%, -60%) !important;
    background: rgba(255, 255, 255, 1);
  }

  .bottom-left-text h2 {
    font-size: 2.8rem;
    display: none;
  }
}

@media (max-width: 768px) {
  .hero {
    height: auto;
    min-height: 600px;
  }

  .background-image {
    display: none;
  }

  .right-panel {
    position: relative;
    width: 100% !important;
    transform: translate(-0%, -60%) !important;
    top: auto;
    right: auto;
    margin-right: 0px !important;
    border-radius: 16px;
    background: rgba(255, 255, 255, 1);
    margin-top: 40px;
  }

  .bottom-left-text {
    position: relative;
    left: auto;
    bottom: auto;
    padding: 40px 30px 0;
  }
}

.bg_main {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.container {
  max-width: 1016px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  position: relative;
  height: 80vh;
  min-height: 500px;
  border-radius: 20px;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/bg-login-card.jpg');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 20px;
  overflow: hidden;
}

.right-panel {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 40%;
  margin-right: 32px;
  border-radius: 16px;
  padding: 40px;
  z-index: 2;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.bottom-left-text {
  position: absolute;
  left: 40px;
  bottom: 12%;
  max-width: 500px;
  z-index: 2;
  color: #fff;
}

.bottom-left-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 45px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.login-title {
  font-weight: bold;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 36px;
}

.input1 {
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}

.el-form-item {
  a.forgetPass {
    float: right;
    cursor: pointer;
    color: red;
    font-weight: 600;

    &:hover {
      text-decoration: none;
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(input.el-input__inner) {
  height: 32px !important;
}

:deep(.el-input__icon) {
  line-height: 14.5px !important;
}

:deep(.el-input__prefix),
:deep(.el-input__suffix) {
  top: 1.8px !important;
}

.loginbtn {
  font-size: 14px;
  cursor: pointer;
  color: #1ab2ff;
  margin-right: 12px;

  &:hover {
    color: red;
  }
}

.mt-4 {
  margin-top: 16px;
}

.mt-5 {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}

.cursor {
  cursor: pointer;
}
</style>
