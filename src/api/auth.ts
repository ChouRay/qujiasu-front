import request from '@/utils/request';
import type { LoginRequest, LoginResponse, ApiError } from '@/types/auth';

/**
 * 用户登录
 * @param data 登录信息
 * @returns Promise<LoginResponse>
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await request.post<LoginResponse>('/api/auth/user/login', data);
    
    // 登录成功后将 token 存储到 localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    // 处理错误响应
    if (error.response) {
      const status = error.response.status;
      const errorData: ApiError = error.response.data;
      
      if (status === 400) {
        // 业务错误：无效凭证
        console.error('登录失败:', errorData.msg);
        throw new Error(errorData.msg || '用户名或密码错误');
      } else if (status === 404) {
        // 业务错误：用户不存在
        console.error('用户不存在:', errorData.msg);
        throw new Error(errorData.msg || '用户不存在');
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
