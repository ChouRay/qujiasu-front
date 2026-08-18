<template>
  <div class="login-container">
    <div class="background-image"></div>
    <div class="container">
      <div class="hero">
        <div class="rigster-panel">
          <div class="login-form">
            <div class="form-header">
              <h2>欢迎注册</h2>
              <p class="subtitle">趣加速</p>
            </div>
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
                <div id="captcha-register-container" style="display:none"></div>
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

<script setup lang="ts">
import { reactive, ref,onBeforeUnmount  } from 'vue'
import TcentCaptcha from '@/components/captcha/TcentCaptcha'

const form = reactive({
  phone: '',
  password: '',
  confirmPassword: '',
  code: '',
  inviteCode: '',
  agree: false
})

const captchaInstance = ref<any>(null)
const CaptchaAppId = '191280376' // 请替换为您的腾讯云 CaptchaAppId

// 发送验证码按钮点击处理
const sendCode = () => {
  if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
    alert('请输入正确的手机号')
    return
  }

  // 调起腾讯图形验证码
  showCaptcha()
}

// 显示腾讯验证码
const showCaptcha = () => {
  if (captchaInstance.value) {
    captchaInstance.value.show()
    return
  }

  try {
    captchaInstance.value = new TcentCaptcha(
      'captcha-register-container', // elementId - 由调用者传入
      CaptchaAppId,
      captchaCallback,
      {
        type: 'popup',
      }
    )
    captchaInstance.value.show()
  } catch (error) {
    console.error('captcha error', error)
    // 处理初始化失败的情况
    handleCaptchaError()
  }
}

// 验证码回调函数
const captchaCallback = (res: any) => {
  console.log('captcha result', res)
  
  if (res.ret === 0) {
    // 验证成功
    if (res.errorCode) {
      // 虽然有票据但是有错误码（容灾票据）
      console.warn('验证成功但存在错误:', res.errorMessage)
      alert(`验证异常：${res.errorCode}-${res.errorMessage}`)
    } else {
      // 验证完全成功，调用发送短信验证码
      sendSmsCode(res.ticket, res.randstr)
    }
  } else if (res.ret === 2) {
    // 用户主动关闭验证码
    console.log('用户关闭验证码')
  } else {
    // 验证失败
    console.error('验证失败:', res)
    alert(`验证失败：${res.errorMessage || '请重试'}`)
  }
}

// 处理验证码错误
const handleCaptchaError = () => {
  alert('验证码加载失败，请稍后重试')
}

// 发送短信验证码 API 调用
const sendSmsCode = async (ticket: string, randstr: string) => {
  try {
    // TODO: 调用实际的 sendSmsCode API
    // await api.sendSmsCode({
    //   phone: form.phone,
    //   ticket,
    //   randstr
    // })
    
    console.log('发送短信验证码:', {
      phone: form.phone,
      ticket,
      randstr
    })
    
    alert('验证码已发送')
    // TODO: 添加倒计时逻辑
  } catch (error) {
    console.error('发送验证码失败:', error)
    alert('发送验证码失败，请稍后重试')
  }
}

const handleRegister = () => {
  if (form.password !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  if (form.password.length < 6 || form.password.length > 20) {
    alert('密码长度应为6-20位')
    return
  }
  if (!/^[a-zA-Z0-9]+$/.test(form.password)) {
    alert('密码应为字母和数字组合')
    return
  }
  if (!form.agree) {
    alert('请勾选同意协议')
    return
  }
  // TODO: 实现注册逻辑
  console.log('注册信息:', form)
  alert('注册成功')
}

onBeforeUnmount(() => {
  console.log('组件即将卸载');
  if (captchaInstance.value ) {
    captchaInstance.value.destroy();
  }
});

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
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-width: 90%;
  z-index: 10;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-form .form-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-form h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.login-form .subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
  font-weight: 500;
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
  flex-wrap: wrap;
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

/* 平板尺寸 */
@media (max-width: 1024px) {
  .rigster-panel {
    width: 400px;
    max-width: 85%;
  }
  
  .login-form {
    padding: 35px;
  }
}

/* 手机横屏和小平板 */
@media (max-width: 768px) {
  .left-panel {
    display: none;
  }
  
  .rigster-panel {
    width: 380px;
    max-width: 85%;
  }
  
  .login-form {
    padding: 30px 25px;
  }
  
  .login-form h2 {
    font-size: 24px;
  }
}

/* 手机竖屏 */
@media (max-width: 480px) {
  .rigster-panel {
    width: 340px;
    max-width: 90%;
  }
  
  .login-form {
    padding: 25px 20px;
  }
  
  .login-form h2 {
    font-size: 22px;
    margin-bottom: 25px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .verification-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .send-code-btn {
    width: 100%;
  }
  
  .submit-btn {
    padding: 12px;
    font-size: 15px;
  }
  
  .redirect-link {
    margin-top: 15px;
    font-size: 13px;
  }
}

/* 超小屏幕 */
@media (max-width: 360px) {
  .rigster-panel {
    width: 300px;
    max-width: 92%;
  }
  
  .login-form {
    padding: 20px 15px;
  }
  
  .login-form h2 {
    font-size: 20px;
  }
  
  .checkbox-label {
    font-size: 12px;
  }
}
</style>
