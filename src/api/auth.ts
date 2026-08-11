import request from '@/utils/request';
import type { LoginRequest, LoginResponse, ApiError } from '@/types/auth';
import { getErrorMessage } from '@/utils/errorMessage';

/**
 * 用户登录
 * @param data 登录信息
 * @returns Promise<LoginResponse>
 */
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // request 拦截器已经返回 response.data，所以这里直接就是后端返回的 JSON 数据
    const response = await request.post<LoginResponse>('/api/auth/user/login', data);
    
    // 登录成功后将 token 存储到 localStorage
    if (response && response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error: any) {
    // 处理错误响应
    if (error.response) {
      const status = error.response.status;
      const errorData: ApiError = error.response.data;
      
      // 使用 errorMessage.ts 中的 getErrorMessage 来获取错误消息
      const errorMsg = getErrorMessage(errorData.code, errorData.msg);
      
      if (status === 400) {
        // 业务错误：无效凭证
        console.error('登录失败:', errorMsg);
        throw new Error(errorMsg || '用户名或密码错误');
      } else if (status === 404) {
        // 业务错误：用户不存在
        console.error('用户不存在:', errorMsg);
        throw new Error(errorMsg || '用户不存在');
      }
    }
    throw error;
  }
};

/**
 * 获取本地存储的 token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * 清除本地存储的 token
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * 将 token 存储到本地
 * @param token JWT token
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};
