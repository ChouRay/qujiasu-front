<template>
  <div class="login-container">
    <div class="background-image"></div>
    <div class="container">
      <div class="hero">
        <div class="rigster-panel">
          <div class="login-form">
            <h2>账户注册</h2>
            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <input 
                  type="tel" 
                  v-model="form.phone" 
                  placeholder="请输入手机号" 
                  required
                  pattern="[0-9]{11}"
                />
              </div>
              <div class="form-group">
                <input 
                  type="password" 
                  v-model="form.password" 
                  placeholder="请设置6-20位字母和数字组合的密码" 
                  required
                  minlength="6"
                  maxlength="20"
                />
              </div>
              <div class="form-group">
                <input 
                  type="password" 
                  v-model="form.confirmPassword" 
                  placeholder="请再次输入密码" 
                  required
                />
              </div>
              <div class="form-group verification-group">
                <input 
                  type="text" 
                  v-model="form.code" 
                  placeholder="输入手机验证码" 
                  required
                />
                <button type="button" class="send-code-btn" @click="sendCode">
                  发送验证码
                </button>
              </div>
              <div class="form-group">
                <input 
                  type="text" 
                  v-model="form.inviteCode" 
                  placeholder="填写邀请码（可不填）" 
                />
              </div>
              <div class="form-group agreement-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.agree" required />
                  <span>我已阅读并同意</span>
                  <a href="/privacy" target="_blank">《隐私权政策》</a>
                  <a href="/agreement" target="_blank">《服务协议》</a>
                </label>
              </div>
              <button type="submit" class="submit-btn">立即注册</button>
            </form>
            <div class="redirect-link">
              已有账号？<router-link to="/login">立即登录</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        phone: '',
        password: '',
        confirmPassword: '',
        code: '',
        inviteCode: '',
        agree: false
      }
    }
  },
  methods: {
    sendCode() {
      if (!this.form.phone || !/^1[3-9]\d{9}$/.test(this.form.phone)) {
        alert('请输入正确的手机号')
        return
      }
      // TODO: 实现发送验证码逻辑
      alert('验证码已发送')
    },
    handleRegister() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      if (this.form.password.length < 6 || this.form.password.length > 20) {
        alert('密码长度应为6-20位')
        return
      }
      if (!/^[a-zA-Z0-9]+$/.test(this.form.password)) {
        alert('密码应为字母和数字组合')
        return
      }
      if (!this.form.agree) {
        alert('请勾选同意协议')
        return
      }
      // TODO: 实现注册逻辑
      console.log('注册信息:', this.form)
      alert('注册成功')
    }
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.hero {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.left-panel {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

.bottom-left-text {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.bottom-left-text h1 {
  font-size: 48px;
  margin-bottom: 10px;
}

.bottom-left-text p {
  font-size: 20px;
  opacity: 0.9;
}

.rigster-panel {
  position: absolute;
  top: 50%;
  left: 40%;
  transform: translateY(-50%);
  width: 40%;
  max-width: 450px;
  min-width: 350px;
  z-index: 10;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-form h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #409EFF;
}

.verification-group {
  display: flex;
  gap: 10px;
}

.verification-group input {
  flex: 1;
}

.send-code-btn {
  padding: 12px 20px;
  background: #fff;
  border: 1px solid #409EFF;
  color: #409EFF;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.3s;
}

.send-code-btn:hover {
  background: #409EFF;
  color: #fff;
}

.agreement-group {
  font-size: 13px;
  color: #666;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 5px;
}

.checkbox-label a {
  color: #409EFF;
  text-decoration: none;
  margin: 0 2px;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 14px;
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

.redirect-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.redirect-link a {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
}

.redirect-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .right-panel {
    right: 5%;
    width: 90%;
    min-width: auto;
  }
  
  .left-panel {
    display: none;
  }
  
  .login-form {
    padding: 30px 20px;
  }
}
</style>
