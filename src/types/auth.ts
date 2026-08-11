// 认证相关类型定义

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  token: string;
  roles: string[];
}

export interface ApiError {
  code: string;
  data: null;
  msg: string;
}
