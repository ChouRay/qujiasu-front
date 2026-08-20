<template>
  <div class="policy-container">
    <div class="policy-content">
      <h1>服务协议</h1>
      <p class="update-time">最后更新时间：2024年1月1日</p>

      <section>
        <h2>1. 接受条款</h2>
        <p>欢迎您使用我们的服务。在使用本服务之前，请您仔细阅读并同意本服务协议。一旦您使用本服务，即表示您已阅读、理解并同意受本协议约束。</p>
      </section>

      <section>
        <h2>2. 服务内容</h2>
        <p>我们致力于为用户提供优质的网络加速服务。具体服务内容包括：</p>
        <ul>
          <li>网络加速优化</li>
          <li>数据传输服务</li>
          <li>技术支持与咨询</li>
          <li>其他相关增值服务</li>
        </ul>
      </section>

      <section>
        <h2>3. 用户注册与账户</h2>
        <p>3.1 您需要提供真实、准确的个人信息完成注册。</p>
        <p>3.2 您应妥善保管账户信息，并对账户下的所有活动负责。</p>
        <p>3.3 如发现账户被盗用，请立即通知我们。</p>
        <p>3.4 我们有权对异常账户进行冻结或注销处理。</p>
      </section>

      <section>
        <h2>4. 用户行为规范</h2>
        <p>在使用本服务时，您不得：</p>
        <ul>
          <li>从事任何违法、违规活动</li>
          <li>侵犯他人知识产权或其他合法权益</li>
          <li>传播病毒、恶意代码或进行网络攻击</li>
          <li>利用服务从事欺诈、传销等非法活动</li>
          <li>干扰或破坏服务的正常运行</li>
          <li>其他损害我们或第三方利益的行为</li>
        </ul>
      </section>

      <section>
        <h2>5. 费用与支付</h2>
        <p>5.1 部分服务可能需要付费，具体价格以页面显示为准。</p>
        <p>5.2 您应按照规定的支付方式完成付款。</p>
        <p>5.3 一经支付，除特殊情况外，费用不予退还。</p>
        <p>5.4 我们保留调整服务价格的权利，并将提前通知您。</p>
      </section>

      <section>
        <h2>6. 知识产权</h2>
        <p>6.1 本服务及其相关内容（包括但不限于软件、代码、界面设计、商标等）的知识产权归我们所有。</p>
        <p>6.2 未经书面许可，您不得复制、修改、传播或用于商业目的。</p>
      </section>

      <section>
        <h2>7. 免责声明</h2>
        <p>7.1 因不可抗力导致的服务中断，我们不承担责任。</p>
        <p>7.2 因用户操作不当或第三方原因造成的损失，我们不承担责任。</p>
        <p>7.3 我们不保证服务完全无错误或中断。</p>
      </section>

      <section>
        <h2>8. 协议变更</h2>
        <p>我们有权根据需要修改本协议内容。修改后的协议将在本页面公布，重大变更将通过适当方式通知您。如您继续使用服务，视为接受修改后的协议。</p>
      </section>

      <section>
        <h2>9. 协议终止</h2>
        <p>9.1 您可随时申请注销账户终止服务。</p>
        <p>9.2 如您违反本协议，我们有权暂停或终止向您提供服务。</p>
        <p>9.3 协议终止后，您的账户数据可能无法恢复，请提前备份重要信息。</p>
      </section>

      <section>
        <h2>10. 法律适用与争议解决</h2>
        <p>10.1 本协议适用中华人民共和国法律。</p>
        <p>10.2 如发生争议，双方应友好协商解决；协商不成的，可向有管辖权的人民法院提起诉讼。</p>
      </section>

      <section>
        <h2>11. 联系我们</h2>
        <p>如您对本协议有任何疑问，请通过以下方式联系我们：</p>
        <p>邮箱：support@example.com</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面标题（未使用，保留以备将来扩展）
// const title = ref('服务协议')
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
