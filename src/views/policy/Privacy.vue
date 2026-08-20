<template>
  <div class="policy-container">
    <div class="policy-content">
      <h1>隐私权政策</h1>
      <p class="update-time">最后更新时间：2024年1月1日</p>

      <section>
        <h2>1. 引言</h2>
        <p>欢迎您使用我们的服务。我们非常重视您的隐私保护，本隐私权政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。</p>
      </section>

      <section>
        <h2>2. 信息收集</h2>
        <p>我们可能收集以下类型的信息：</p>
        <ul>
          <li>您提供的个人信息（如姓名、邮箱、电话号码等）</li>
          <li>设备信息和使用数据</li>
          <li>位置信息（经您授权后）</li>
        </ul>
      </section>

      <section>
        <h2>3. 信息使用</h2>
        <p>我们收集的信息将用于：</p>
        <ul>
          <li>提供和改进我们的服务</li>
          <li>与您沟通服务相关信息</li>
          <li>保障服务安全</li>
          <li>遵守法律法规要求</li>
        </ul>
      </section>

      <section>
        <h2>4. 信息共享</h2>
        <p>我们不会向第三方出售、出租或交易您的个人信息。仅在以下情况下，我们可能会共享您的信息：</p>
        <ul>
          <li>获得您的明确同意</li>
          <li>履行法律义务</li>
          <li>与服务提供商合作（仅限于提供服务所需）</li>
        </ul>
      </section>

      <section>
        <h2>5. 信息安全</h2>
        <p>我们采取合理的技术和管理措施保护您的个人信息安全，防止未经授权的访问、使用或泄露。</p>
      </section>

      <section>
        <h2>6. 您的权利</h2>
        <p>您有权：</p>
        <ul>
          <li>访问和更正您的个人信息</li>
          <li>删除您的个人信息</li>
          <li>撤回您的同意</li>
          <li>投诉和举报</li>
        </ul>
      </section>

      <section>
        <h2>7. 联系我们</h2>
        <p>如果您对本隐私权政策有任何疑问或建议，请通过以下方式联系我们：</p>
        <p>邮箱：privacy@example.com</p>
      </section>

      <section>
        <h2>8. 政策更新</h2>
        <p>我们可能会不时更新本隐私权政策。更新后的政策将在本页面发布，并在重大变更时通知您。</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面标题（未使用，保留以备将来扩展）
// const title = ref('隐私权政策')
</script>

<style scoped lang="scss">
.policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
}

.policy-content {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
    text-align: center;
  }

  .update-time {
    text-align: center;
    color: #999;
    font-size: 14px;
    margin-bottom: 40px;
  }

  section {
    margin-bottom: 30px;

    h2 {
      font-size: 20px;
      color: #333;
      margin-bottom: 15px;
      border-left: 4px solid #409eff;
      padding-left: 12px;
    }

    p {
      line-height: 1.8;
      color: #666;
      margin-bottom: 10px;
      text-align: justify;
    }

    ul {
      margin-left: 20px;
      color: #666;
      line-height: 1.8;

      li {
        margin-bottom: 8px;
      }
    }
  }
}

@media (max-width: 768px) {
  .policy-container {
    padding: 20px 10px;
  }

  .policy-content {
    padding: 20px;
  }

  h1 {
    font-size: 24px !important;
  }

  section h2 {
    font-size: 18px !important;
  }
}
</style>
