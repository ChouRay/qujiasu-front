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
        <div class="download-btn pc-btn">
          <img src="@/assets/images/icon-pc.png" alt="电脑图标" class="btn-icon" />
          <span class="btn-text">电脑下载</span>
        </div>
        <div class="download-btn android-btn">
          <img src="@/assets/images/icon-android.png" alt="安卓图标" class="btn-icon" />
          <span class="btn-text">安卓下载</span>
        </div>
        <div class="download-btn ios-btn">
          <img src="@/assets/images/icon-ios.png" alt="苹果图标" class="btn-icon" />
          <span class="btn-text">苹果下载</span>
        </div>
      </div>
    </div>

    <!-- 底部背景图 -->
    <div class="bottom-bg"></div>
  </div>
</template>

<script>
export default {
  name: 'Download',
}
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
  flex-direction: column;
  align-items: center;
  padding: 30px 40px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-width: 150px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  .btn-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 12px;
    object-fit: contain;
  }

  .btn-text {
    font-size: 16px;
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
  height: 400px;
  background-image: url('@/assets/images/login-bg.png');
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
    padding: 20px 30px;
    min-width: 120px;

    .btn-icon {
      width: 48px;
      height: 48px;
    }

    .btn-text {
      font-size: 14px;
    }
  }

  .bottom-bg {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 24px;
  }

  .sub-title {
    font-size: 13px;
  }

  .download-buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .download-btn {
    width: 100%;
    max-width: 280px;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    padding: 15px 25px;

    .btn-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 0;
    }

    .btn-text {
      font-size: 15px;
    }
  }

  .bottom-bg {
    height: 200px;
  }
}
</style>
