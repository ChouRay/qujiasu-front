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
                <button
                  type="primary"
                  @click="submitForm('loginform')"
                  style="width: 100%; letter-spacing: 0.2rem"
                  class="submit-btn"
                  >登录</button
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
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";

const router = useRouter();
const loginform = ref({
  accountnum: "",
  password: "",
});

const submitForm = (formName: string) => {
  console.log("提交登录表单", formName);
};

const gotoRegester = () => {
  router.push('/register');
};

const fgPwd = () => {
  console.log("忘记密码");
};

const wxLogin = () => {
  console.log("微信登录");
};
</script>

<style scoped lang="scss">
/* 响应式设计 */
@media (max-width: 1200px) {
  .background-image {
    display: none;
  }

  .hero {
    box-shadow: none !important;
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
  .bg_main {
    height: auto;
    min-height: 100vh;
    padding: 20px 0;
  }

  .container {
    padding: 0 15px;
  }

  .hero {
    display: none;
  }

  .background-image {
    display: none;
  }

  .bottom-left-text {
    position: relative;
    left: auto;
    bottom: auto;
    width: 100%;
    text-align: center;
    padding: 0 0 30px;
    max-width: 100%;
  }

  .bottom-left-text h2 {
    font-size: 1.8rem;
    display: block;
    margin-bottom: 0;
  }

  .right-panel {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    transform: none !important;
    width: 100% !important;
    max-width: 400px;
    margin: 0 auto !important;
    border-radius: 16px;
    background: rgba(255, 255, 255, 1);
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .login-title {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  .input1 {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
    width: 100%;
  }

  :deep(input.el-input__inner) {
    height: 40px !important;
    font-size: 14px;
  }

  :deep(.el-input__icon) {
    line-height: 40px !important;
  }

  :deep(.el-input__prefix),
  :deep(.el-input__suffix) {
    top: 0 !important;
  }

  .el-button.fpx16 {
    height: 40px;
    font-size: 16px;
  }

  .loginbtn,
  .forgetPass {
    font-size: 13px;
  }
}

.bg_main {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("@/assets/images/login-bg.jpg");
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
  height: 500px;
  min-height: 500px;
  width: 2811px;
  max-width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/bg-login-card.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 20px;
  z-index: 1;
}

.right-panel {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  width: 32%;
  max-width: 400px;
  border-radius: 16px;
  padding: 40px 30px;
  z-index: 2;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom-left-text {
  position: absolute;
  left: 40px;
  bottom: 0;
  transform: translateY(20%);
  max-width: 400px;
  z-index: 2;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.bottom-left-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 45px;
}

.login-title {
  font-weight: bold;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 36px;
}

.input1 {
  max-width: 360px;
  width: 100%;
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

.submit-btn {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
