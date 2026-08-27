<template>
  <div class="contact-float">
    <!-- 三个图标垂直排列 -->
    <div class="icon-list">
      <!-- 手机号 -->
      <div class="contact-icon-wrapper phone" @mouseenter="showTooltip('phone')" @mouseleave="hideTooltip" @click="copyPhone">
        <div class="contact-icon">
          <el-icon><Phone /></el-icon>
        </div>
        <div class="tooltip" v-if="activeTooltip === 'phone'">
          <span class="tooltip-label">手机号码</span>
          <span class="tooltip-value">{{ contactInfo.phone }}</span>
        </div>
      </div>
      
      <!-- QQ 号 -->
      <div class="contact-icon-wrapper qq" @mouseenter="showTooltip('qq')" @mouseleave="hideTooltip" @click="jumpToQQ">
        <div class="contact-icon">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="tooltip" v-if="activeTooltip === 'qq'">
          <span class="tooltip-label">QQ 号码</span>
          <span class="tooltip-value">{{ contactInfo.qq }}</span>
        </div>
      </div>
      
      <!-- QQ 群 -->
      <div class="contact-icon-wrapper qq-group" @mouseenter="showTooltip('qqGroup')" @mouseleave="hideTooltip" @click="joinQQGroup">
        <div class="contact-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="tooltip" v-if="activeTooltip === 'qqGroup'">
          <span class="tooltip-label">QQ 群</span>
          <span class="tooltip-value">{{ contactInfo.qqGroup }}</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 复制成功提示 -->
  <el-message v-if="messageVisible" type="success" duration="2000">
    {{ messageText }}
  </el-message>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Phone, ChatDotRound, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 联系方式配置
const contactInfo = {
  phone: '135xxxxx1234',
  qq: '232332',
  qqGroup: '2112212'
}

const activeTooltip = ref<string | null>(null)
const messageVisible = ref(false)
const messageText = ref('')

// 显示提示
const showTooltip = (type: string) => {
  activeTooltip.value = type
}

// 隐藏提示
const hideTooltip = () => {
  activeTooltip.value = null
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
  right: 0; /* 靠右显示，紧贴屏幕右边缘 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%);
  z-index: 9999;
  transition: all 0.3s ease;
}

.icon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 8px;
  background: #fff;
  border-radius: 12px 0 0 12px; /* 左侧圆角 */
  box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.15);
}

.contact-icon-wrapper {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: flex-end; /* 图标靠右 */
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.contact-icon-wrapper:hover .contact-icon {
  transform: scale(1.15);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.contact-icon-wrapper.phone .contact-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.contact-icon-wrapper.qq .contact-icon {
  background: linear-gradient(135deg, #12b7f5 0%, #0ea5e9 100%);
}

.contact-icon-wrapper.qq-group .contact-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

/* 提示框 */
.tooltip {
  position: absolute;
  right: 60px; /* 在图标左侧显示 */
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slideIn 0.2s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 6px solid #fff;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.tooltip-label {
  font-size: 12px;
  color: #666;
}

.tooltip-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* 响应式设计 - 手机端适配 */
@media (max-width: 768px) {
  .contact-float {
    right: 0;
    top: auto;
    bottom: 100px;
    transform: none;
  }
  
  .icon-list {
    gap: 8px;
    padding: 10px 6px;
  }
  
  .contact-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .tooltip {
    right: 50px;
    padding: 6px 10px;
  }
  
  .tooltip-label {
    font-size: 11px;
  }
  
  .tooltip-value {
    font-size: 13px;
  }
}
</style>
