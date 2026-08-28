<template>
  <div class="download-container">
    <!-- 顶部内容区域 -->
    <div class="download-content">
      <!-- 标题区域 -->
      <div class="title-section">
        <h1 class="main-title">多平台支持 全方位服务</h1>
        <p class="sub-title">趣加速为您多端设备提供网络接入方案满足您各种不同需求让科技走进生活</p>
      </div>

      <!-- 中间图片 -->
      <div class="image-section">
        <img src="@/assets/images/img-download.png" alt="下载示意图" class="download-image" />
      </div>

      <!-- 底部下载按钮 -->
      <div class="download-buttons">
        <div class="download-btn pc-btn" @click="handlePcDownload">
          <img src="@/assets/images/icon-pc.png" alt="电脑图标" class="btn-icon" />
          <span class="btn-text">电脑下载</span>
        </div>
        <div 
          class="download-btn android-btn" 
          @click="handleAndroidDownload"
          @mouseenter="showQrCode('android')"
          @mouseleave="hideQrCode"
        >
          <img src="@/assets/images/icon-android.png" alt="安卓图标" class="btn-icon" />
          <span class="btn-text">安卓下载</span>
          <!-- 安卓二维码弹窗 -->
          <transition name="qr-fade">
            <div v-if="qrVisible && qrType === 'android'" class="qr-popup android-qr">
              <div class="qr-arrow"></div>
              <div class="qr-content">
                <div v-if="qrLoading" class="qr-loading">
                  <span>生成中...</span>
                </div>
                <canvas v-show="!qrLoading" ref="androidQrCanvas" class="qr-canvas"></canvas>
                <p class="qr-tip">扫码下载安卓版</p>
              </div>
            </div>
          </transition>
        </div>
        <div 
          class="download-btn ios-btn" 
          @click="handleIosDownload"
          @mouseenter="showQrCode('ios')"
          @mouseleave="hideQrCode"
        >
          <img src="@/assets/images/icon-ios.png" alt="苹果图标" class="btn-icon" />
          <span class="btn-text">苹果下载</span>
          <!-- iOS 二维码弹窗 -->
          <transition name="qr-fade">
            <div v-if="qrVisible && qrType === 'ios'" class="qr-popup ios-qr">
              <div class="qr-arrow"></div>
              <div class="qr-content">
                <div v-if="qrLoading" class="qr-loading">
                  <span>生成中...</span>
                </div>
                <canvas v-show="!qrLoading" ref="iosQrCanvas" class="qr-canvas"></canvas>
                <p class="qr-tip">扫码下载 iOS 版</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 底部背景图 -->
    <div class="bottom-bg"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getLatestClientVersion, type ClientVersion } from '@/api/download'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

const versionList = ref<ClientVersion[]>([])
const loading = ref(false)

// 二维码相关状态
const qrVisible = ref(false)
const qrType = ref<'android' | 'ios'>('android')
const qrLoading = ref(false)
const androidQrCanvas = ref<HTMLCanvasElement | null>(null)
const iosQrCanvas = ref<HTMLCanvasElement | null>(null)

// 设备类型映射
const deviceTypeMap = {
  PC: ['WINDOWS', 'MAC', 'LINUX'],
  ANDROID: ['ANDROID', 'HARMONYOS'],
  IOS: ['IOS']
}

// 获取最新版本信息
const fetchVersionList = async () => {
  loading.value = true
  try {
    const res = await getLatestClientVersion()
    versionList.value = res || []
  } catch (error) {
    console.error('获取版本信息失败:', error)
    ElMessage.error('获取版本信息失败')
  } finally {
    loading.value = false
  }
}

// 根据设备类型获取下载链接
const getDownloadUrl = (types: string[]): string | null => {
  const item = versionList.value.find(v => types.includes(v.deviceType))
  return item?.downloadUrl || null
}

// 处理下载点击
const handleDownload = (types: string[], deviceName: string) => {
  const url = getDownloadUrl(types)
  if (url) {
    window.open(url, '_blank')
  } else {
    ElMessage.warning(`暂未发布${deviceName}版本`)
  }
}

// 电脑下载
const handlePcDownload = () => {
  handleDownload(deviceTypeMap.PC, '电脑')
}

// 安卓下载
const handleAndroidDownload = () => {
  handleDownload(deviceTypeMap.ANDROID, '安卓')
}

// 苹果下载
const handleIosDownload = () => {
  handleDownload(deviceTypeMap.IOS, '苹果')
}

// 生成二维码
const generateQrCode = async (url: string, canvas: HTMLCanvasElement | null) => {
  if (!canvas || !url) return
  
  qrLoading.value = true
  try {
    await QRCode.toCanvas(canvas, url, {
      width: 120,
      margin: 2,
      color: {
        dark: '#333333',
        light: '#ffffff'
      }
    })
  } catch (error) {
    console.error('二维码生成失败:', error)
    ElMessage.error('二维码生成失败')
  } finally {
    qrLoading.value = false
  }
}

// 显示二维码
const showQrCode = async (type: 'android' | 'ios') => {
  qrType.value = type
  qrVisible.value = true
  
  const url = type === 'android' 
    ? getDownloadUrl(deviceTypeMap.ANDROID)
    : getDownloadUrl(deviceTypeMap.IOS)
  
  if (!url) {
    ElMessage.warning(`暂未发布${type === 'android' ? '安卓' : '苹果'}版本`)
    qrVisible.value = false
    return
  }
  
  await nextTick()
  
  const canvas = type === 'android' ? androidQrCanvas.value : iosQrCanvas.value
  await generateQrCode(url, canvas)
}

// 隐藏二维码
const hideQrCode = () => {
  qrVisible.value = false
}

onMounted(() => {
  fetchVersionList()
})
</script>

<style lang="scss" scoped>
.download-container {
  min-height: 100vh;  
  position: relative;
  display: flex;  
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  overflow-x: hidden;
}

.download-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.4;
}

.sub-title {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.image-section {
  margin: 40px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.download-image {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
}

.download-buttons {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 60px;
}

.download-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-width: 160px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  .btn-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .btn-text {
    font-size: 15px;
    font-weight: 500;
    color: #fff;
  }
}

// 电脑下载按钮 - 蓝色系
.pc-btn {
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
}

// 安卓下载按钮 - 绿色系
.android-btn {
  background: linear-gradient(135deg, #67C23A 0%, #529b2e 100%);
}

// 苹果下载按钮 - 灰色/深色系
.ios-btn {
  background: linear-gradient(135deg, #909399 0%, #73767a 100%);
}

.bottom-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1079px;
  background-image: url('@/assets/images/bg-download.png');
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
  z-index: 1;
}

// 响应式适配
@media (max-width: 768px) {
  .download-container {
    padding-top: 60px;
  }

  .main-title {
    font-size: 28px;
  }

  .sub-title {
    font-size: 14px;
  }

  .download-image {
    max-height: 250px;
  }

  .download-buttons {
    gap: 20px;
  }

  .download-btn {
    padding: 0 20px;
    height: 40px;
    min-width: 140px;

    .btn-icon {
      width: 22px;
      height: 22px;
    }

    .btn-text {
      font-size: 14px;
    }
  }
}

@media (max-width: 480px) {
  .download-container {
    padding-top: 40px;
  }

  .main-title {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .sub-title {
    font-size: 13px;
    line-height: 1.5;
    padding: 0 10px;
  }

  .image-section {
    margin: 30px 0;
  }

  .download-image {
    max-height: 200px;
  }

  .download-buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 30px;
    margin-bottom: 40px;
    width: 100%;
  }

  .download-btn {
    width: 85%;
    max-width: 280px;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    padding: 0 16px;
    height: 40px;
    min-width: auto;

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .btn-text {
      font-size: 13px;
    }
  }
}

@media (max-width: 360px) {
  .main-title {
    font-size: 20px;
  }

  .sub-title {
    font-size: 12px;
  }

  .download-image {
    max-height: 160px;
  }

  .download-btn {
    width: 90%;
    height: 38px;
    padding: 0 14px;

    .btn-icon {
      width: 18px;
      height: 18px;
    }

    .btn-text {
      font-size: 12px;
    }
  }
}

// 二维码弹窗样式
.qr-popup {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 100;

  .qr-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #fff;
  }

  .qr-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .qr-loading {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 13px;
    }

    .qr-canvas {
      display: block;
    }

    .qr-tip {
      margin: 0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
}

// 二维码淡入淡出动画
.qr-fade-enter-active,
.qr-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.qr-fade-enter-from,
.qr-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
