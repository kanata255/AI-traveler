import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useUserStore } from '@/store';

import { clearToken, getToken } from '@/utils/auth';

// import { Loading } from '@/components';

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 请求的默认前缀 只要是发出去请求就会 默认带上这个前缀
  timeout: 60000, // 请求超时时间：60s
  headers: { 'Content-Type': 'application/json' }, // 设置默认请求头
});

/** 登录失效：清 token 并跳转登录页 */
function handleUnauthorized() {
  clearToken();
  useUserStore.getState().updateToken('');
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求里加入认证信息（后端从 Authorization 头读取 token）
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }

    // 全局 loading 显示
    // Loading.show();

    return config;
  },
  (err: AxiosError) => {
    // 全局 loading 隐藏
    // Loading.hide();
    return Promise.reject(err);
  },
);

// 响应拦截器即异常处理
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    // 业务层 401：登录失效
    if (res.data?.code === 401) {
      handleUnauthorized();
    }

    // 全局 loading 隐藏
    // Loading.hide();

    return res; // res.data
  },
  (err: AxiosError) => {
    // HTTP 401：未登录或 token 过期
    if (err.response?.status === 401) {
      handleUnauthorized();
    }

    // 如果接口请求报错时，也可以直接返回对象，如return { message: onErrorReason(error.message) }，这样使用async/await就不需要加try/catch
    // onErrorReason(err.message) // 做一些全局的错误提示，可用ui库的message提示组件

    // 全局 loading 隐藏
    // Loading.hide();

    return Promise.resolve(err);
  },
);

/** 解析http层面请求异常原因 */
// function onErrorReason(message: string): string {
//   if (message.includes('Network Error')) {
//     return '网络异常，请检查网络情况!';
//   }
//   if (message.includes('timeout')) {
//     return '请求超时，请重试!';
//   }
//   return '服务异常,请重试!';
// }

// 导出实例
export default axiosInstance;
