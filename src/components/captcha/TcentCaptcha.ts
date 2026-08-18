/**
 * 腾讯云图形验证码组件
 * 
 * @param elementId - 验证码渲染的 DOM 元素 ID，由调用者传入
 * @param appId - 腾讯云验证码应用 ID (CaptchaAppId)
 * @param callback - 验证结束后的回调函数
 * @param options - 可选的外观配置参数
 */

// 定义回调结果类型
export interface TencentCaptchaResult {
  ret: number; // 0：验证成功；2：用户主动关闭验证码
  ticket: string | null; // 验证成功的票据，仅当 ret = 0 时有值
  randstr: string | null; // 本次验证的随机串
  errorCode?: number; // 错误 code（可选）
  errorMessage?: string; // 错误消息（可选）
}

// 定义回调函数类型
export type TencentCaptchaCallback = (res: TencentCaptchaResult) => void;

// 定义外观配置选项类型
export interface TencentCaptchaOptions {
  type?: 'popup' | 'bind'; // 验证码类型：popup(弹窗) / bind(绑定)
  [key: string]: any; // 支持其他自定义配置
}

// 定义验证码加载错误的容灾回调
export interface LoadErrorCallback {
  (): void;
}

export class TencentCaptcha {
  private elementId: string;
  private appId: string;
  private callback: TencentCaptchaCallback;
  private options: TencentCaptchaOptions;
  private captchaInstance: any = null;

  /**
   * 构造函数
   * @param elementId - 验证码渲染的 DOM 元素 ID
   * @param appId - 腾讯云验证码应用 ID
   * @param callback - 验证结束后的回调函数
   * @param options - 可选的外观配置参数
   */
  constructor(
    elementId: string,
    appId: string,
    callback: TencentCaptchaCallback,
    options: TencentCaptchaOptions = {}
  ) {
    this.elementId = elementId;
    this.appId = appId;
    this.callback = callback;
    this.options = options;
  }

  /**
   * 生成容灾票据
   * @param errorCode - 错误码
   * @returns 容灾票据对象
   */
  private generateDisasterTicket(errorCode: number): TencentCaptchaResult {
    const ticket = `trerror_${errorCode}_${this.appId}_${Math.floor(new Date().getTime() / 1000)}`;
    return {
      ret: 0,
      randstr: '@' + Math.random().toString(36).substr(2),
      ticket: ticket,
      errorCode: errorCode,
      errorMessage: 'disaster_recovery',
    };
  }

  /**
   * 显示验证码
   */
  public show(): void {
    try {
      // 检查是否存在容器元素（如果是 bind 模式）
      const element = document.getElementById(this.elementId);
      
      // 初始化验证码实例
      // @ts-ignore - TencentCaptcha 是全局变量，由 SDK 注入
      if (typeof TencentCaptcha !== 'undefined') {
        // @ts-ignore
        this.captchaInstance = new TencentCaptcha(
          this.appId,
          (res: TencentCaptchaResult) => {
            // 处理回调结果
            this.handleCallback(res);
          },
          this.options
        );
        
        // 调用 show 方法显示验证码
        this.captchaInstance.show();
      } else {
        throw new Error('TencentCaptcha 未定义');
      }
    } catch (error) {
      console.error('初始化验证码失败:', error);
      // 根据错误类型生成容灾票据
      let errorCode = 1005; // 默认中间 JS 运行错误
      if (error instanceof Error) {
        if (error.message.includes('未定义')) {
          errorCode = 1001;
        }
      }
      this.callback(this.generateDisasterTicket(errorCode));
    }
  }

  /**
   * 处理回调结果
   * @param res - 原始回调结果
   */
  private handleCallback(res: TencentCaptchaResult): void {
    // 用户主动关闭验证码
    if (res.ret === 2) {
      this.callback({
        ret: 2,
        ticket: null,
        randstr: null,
      });
      return;
    }

    // 验证成功或返回容灾票据
    this.callback(res);
  }

  /**
   * 销毁验证码实例（可选）
   */
  public destroy(): void {
    if (this.captchaInstance && typeof this.captchaInstance.destroy === 'function') {
      this.captchaInstance.destroy();
      this.captchaInstance = null;
    }
  }
}

export default TencentCaptcha;
