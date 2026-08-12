import axios, { AxiosInstance, AxiosResponse } from 'axios';

// 根据环境设置 baseUrl
const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.qujiasu.com';
  } else {
    return 'https://test.qujiasu.com';
  }
};

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 设置请求头
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    // 设置 withCredentials
    config.withCredentials = false;
    // 自动携带 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 处理 401 和 403 错误（未授权或登录过期）
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export default request;
