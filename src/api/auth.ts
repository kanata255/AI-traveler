import { GET, POST } from '@/services';

export type LoginParams = {
  /** 手机号或邮箱 */
  account: string;
  password: string;
};

export type RegisterParams = {
  /** 手机号，必填 */
  phone: string;
  password: string;
  email?: string;
  name?: string;
};

export type UserVO = {
  id: number;
  name: string | null;
  age: number | null;
  email: string | null;
  phone: string | null;
  status: number;
};

/** 登录：手机号或邮箱 + 密码，返回 token */
export function login(data: LoginParams) {
  return POST<string>('/user/login', data);
}

/** 注册：手机号必填 + 密码，邮箱/昵称可选，成功自动登录并返回 token */
export function register(data: RegisterParams) {
  return POST<string>('/user/register', data);
}

/** 登出 */
export function logout() {
  return POST<void>('/user/logout');
}

/** 获取当前登录用户 */
export function getCurrentUser() {
  return GET<UserVO>('/user/me');
}
