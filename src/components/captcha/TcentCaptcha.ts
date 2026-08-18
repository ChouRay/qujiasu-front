/**
 * 腾讯云图形验证码组件
 * 
 * @param elementId - 验证码渲染的 DOM 元素 ID，由调用者传入
 * @param appId - 腾讯云验证码应用 ID (CaptchaAppId)
 * @param callback - 验证结束后的回调函数
 * @param options - 可选的外观配置参数
 */

// 定义回调结果类型
export interface TcentCaptchaResult {
  ret: number; // 0：验证成功；2：用户主动关闭验证码
  ticket: string | null; // 验证成功的票据，仅当 ret = 0 时有值
  randstr: string | null; // 本次验证的随机串
  errorCode?: number; // 错误 code（可选）
  errorMessage?: string; // 错误消息（可选）
}

// 定义回调函数类型
export type TcentCaptchaCallback = (res: TcentCaptchaResult) => void;

// 定义外观配置选项类型
export interface TcentCaptchaOptions {
  type?: 'popup' | 'bind'; // 验证码类型：popup(弹窗) / bind(绑定)
  [key: string]: any; // 支持其他自定义配置
}

// 定义验证码加载错误的容灾回调
export interface LoadErrorCallback {
  (): void;
}

// 全局脚本加载状态标记
let isScriptLoaded = false;
let isScriptLoading = false;
const SCRIPT_URL = 'https://turing.captcha.qcloud.com/TJCaptcha.js';

export class TcentCaptcha {
  private elementId: string;
  private appId: string;
  private callback: TcentCaptchaCallback;
  private options: TcentCaptchaOptions;
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
    callback: TcentCaptchaCallback,
    options: TcentCaptchaOptions = {}
  ) {
    this.elementId = elementId;
    this.appId = appId;
    this.callback = callback;
    this.options = options;
  }

  /**
   * 加载腾讯验证码 SDK 脚本
   * @returns Promise<void>
   */
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 如果已经加载过，直接返回成功
      if (isScriptLoaded) {
        resolve();
        return;
      }

      // 如果正在加载中，等待加载完成
      if (isScriptLoading) {
        const checkInterval = setInterval(() => {
          if (isScriptLoaded) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!isScriptLoaded) {
            reject(new Error('TJCaptcha.js 加载超时'));
          }
        }, 10000); // 10 秒超时
        return;
      }

      isScriptLoading = true;

      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.type = 'text/javascript';

      script.onload = () => {
        isScriptLoaded = true;
        isScriptLoading = false;
        resolve();
      };

      script.onerror = () => {
        isScriptLoading = false;
        reject(new Error('TJCaptcha.js 加载错误'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 生成容灾票据
   * @param errorCode - 错误码
   * @returns 容灾票据对象
   */
  private generateDisasterTicket(errorCode: number): TcentCaptchaResult {
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
    this.loadScript()
      .then(() => {
        try {
          // 检查是否存在容器元素（如果是 bind 模式）
          const element = document.getElementById(this.elementId);
          
          // 初始化验证码实例
          // @ts-ignore - TencentCaptcha 是全局变量，由 SDK 注入
          if (typeof TencentCaptcha !== 'undefined') {
            // @ts-ignore
            this.captchaInstance = new TencentCaptcha(element,
              this.appId,
              (res: TcentCaptchaResult) => {
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
            if (error.message.includes('加载错误')) {
              errorCode = 1001;
            } else if (error.message.includes('超时')) {
              errorCode = 1002;
            }
          }
          this.callback(this.generateDisasterTicket(errorCode));
        }
      })
      .catch((error) => {
        console.error('加载验证码 SDK 失败:', error);
        // 脚本加载错误，生成容灾票据
        const disasterResult = this.generateDisasterTicket(1001);
        disasterResult.errorMessage = error.message || 'TJCaptcha.js 加载错误';
        this.callback(disasterResult);
      });
  }

  /**
   * 处理回调结果
   * @param res - 原始回调结果
   */
  private handleCallback(res: TcentCaptchaResult): void {
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

export default TcentCaptcha;
