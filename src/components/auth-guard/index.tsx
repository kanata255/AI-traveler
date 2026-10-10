import { Navigate, Outlet, useMatches } from 'react-router';

import { getToken } from '@/utils/auth';

type AuthHandle = { requiresAuth?: boolean };

/**
 * 路由守卫：读取最深叶子路由的 handle.requiresAuth 判定是否需要登录。
 * requiresAuth 未定义时默认需登录（仅 false 表示白名单）。
 */
function AuthGuard() {
  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  const requiresAuth = (leaf?.handle as AuthHandle | undefined)?.requiresAuth !== false;

  if (requiresAuth && !getToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthGuard;
