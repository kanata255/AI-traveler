const TOKEN_KEY = 'satoken';

/** 读取 token */
export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';

/** 写入 token */
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** 清除 token */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
