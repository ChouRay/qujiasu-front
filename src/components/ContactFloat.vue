<template>
  <div class="contact-float" :class="{ 'expanded': isExpanded }">
    <!-- 展开状态：显示完整联系方式 -->
    <template v-if="isExpanded">
      <div class="contact-header">
        <span>联系我们</span>
        <el-icon class="close-btn" @click="toggleExpand"><Close /></el-icon>
      </div>
      <div class="contact-list">
        <div class="contact-item" @click="copyPhone">
          <div class="contact-icon phone">
            <el-icon><Phone /></el-icon>
          </div>
          <div class="contact-info">
            <span class="contact-label">手机号码</span>
            <span class="contact-value">{{ contactInfo.phone }}</span>
          </div>
        </div>
        
        <div class="contact-item" @click="jumpToQQ">
          <div class="contact-icon qq">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="contact-info">
            <span class="contact-label">QQ 号码</span>
            <span class="contact-value">{{ contactInfo.qq }}</span>
          </div>
        </div>
        
        <div class="contact-item" @click="joinQQGroup">
          <div class="contact-icon qq-group">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="contact-info">
            <span class="contact-label">QQ 群</span>
            <span class="contact-value">{{ contactInfo.qqGroup }}</span>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 收起状态：显示悬浮按钮 -->
    <template v-else>
      <div class="float-button" @click="toggleExpand">
        <el-icon :size="24"><ChatLineRound /></el-icon>
        <span class="button-text">联系</span>
      </div>
    </template>
  </div>
  
  <!-- 复制成功提示 -->
  <el-message v-if="messageVisible" type="success" duration="2000">
    {{ messageText }}
  </el-message>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close, Phone, ChatDotRound, UserFilled, ChatLineRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 联系方式配置
const contactInfo = {
  phone: '135xxxxx1234',
  qq: '232332',
  qqGroup: '2112212'
}

const isExpanded = ref(false)
const messageVisible = ref(false)
const messageText = ref('')

// 切换展开/收起状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 复制手机号
const copyPhone = async () => {
  try {
    await navigator.clipboard.writeText(contactInfo.phone)
    showMessage('手机号已复制到剪贴板')
  } catch (err) {
    // 降级方案：创建临时 input 元素
    const input = document.createElement('input')
    input.value = contactInfo.phone
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    showMessage('手机号已复制到剪贴板')
  }
}

// 跳转到 QQ
const jumpToQQ = () => {
  const qqNumber = contactInfo.qq
  // 尝试打开 QQ
  const qqScheme = `mqqwpa://im/chat?chat_type=wpa&uin=${qqNumber}&version=1`
  
  // 先尝试使用 scheme 协议打开 QQ 应用
  window.location.href = qqScheme
  
  // 延迟后如果未打开，则打开网页版
  setTimeout(() => {
    // 可以提示用户手动打开 QQ
    showMessage('正在打开 QQ，如未跳转请手动添加')
  }, 1000)
}

// 加入 QQ 群
const joinQQGroup = () => {
  const qqGroup = contactInfo.qqGroup
  // QQ 群链接
  const groupUrl = `https://qm.qq.com/cgi-bin/qm/qr?k=${qqGroup}`
  
  // 尝试打开 QQ 群
  const qqGroupScheme = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${qqGroup}&card_type=group`
  window.location.href = qqGroupScheme
  
  setTimeout(() => {
    window.open(groupUrl, '_blank')
    showMessage('正在打开 QQ 群，如未跳转请手动加入')
  }, 1000)
}

// 显示消息提示
const showMessage = (text: string) => {
  messageText.value = text
  messageVisible.value = true
  ElMessage({
    message: text,
    type: 'success',
    duration: 2000
  })
}
</script>

<style scoped>
.contact-float {
  position: fixed;
  right: 25%; /* 右下角四分之三位置 */
  bottom: 80px;
  z-index: 9999;
  transition: all 0.3s ease;
}

/* 展开状态 */
.contact-float.expanded {
  right: 25%;
  bottom: 80px;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: bold;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
}

.close-btn {
  cursor: pointer;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.contact-list {
  background: #fff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 200px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item:hover {
  background-color: #f5f7fa;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.contact-icon.phone {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.contact-icon.qq {
  background: linear-gradient(135deg, #12b7f5 0%, #0ea5e9 100%);
  color: #fff;
}

.contact-icon.qq-group {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-label {
  font-size: 12px;
  color: #666;
}

.contact-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 收起状态 - 悬浮按钮 */
.float-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  gap: 4px;
}

.float-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.button-text {
  font-size: 12px;
}

/* 响应式设计 - 手机端适配 */
@media (max-width: 768px) {
  .contact-float {
    right: 15px;
    bottom: 70px;
  }
  
  .contact-float.expanded {
    right: 15px;
    bottom: 70px;
  }
  
  .contact-list {
    min-width: 180px;
  }
  
  .float-button {
    width: 50px;
    height: 50px;
  }
  
  .button-text {
    font-size: 10px;
  }
}
</style>
