import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';

import { AuthGuard, ErrorBoundary } from '@/components';
import type { RouteObject } from '@/types/router';

import { LazyLoad, routes } from './utils';

const router: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard />, // 路由守卫：未登录跳转 /login
    /**
     * 可以在Root组件（自己新建），用 useLoaderData 接收 loader 返回的数据做一些操作
     * @see https://reactrouter.com/en/main/hooks/use-loader-data#useloaderdata
     */
    // element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />, // 重定向
      },
      {
        path: '/home',
        element: LazyLoad(lazy(() => import('@/views/home'))),
      },
      {
        path: '/login',
        meta: { title: '登录', requiresAuth: false },
        element: LazyLoad(lazy(() => import('@/views/test/login'))),
      },
      {
        path: '/register',
        meta: { title: '注册', requiresAuth: false },
        element: LazyLoad(lazy(() => import('@/views/test/register'))),
      },
      {
        path: '/404',
        meta: { title: '404', requiresAuth: false },
        element: LazyLoad(lazy(() => import('@/components/not-fount'))),
      },
      ...routes, // modules 路由
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" />, // 找不到页面
  },
];

// 将 meta.requiresAuth 镜像到 handle，供 AuthGuard 通过 useMatches 读取
function attachAuthHandle(list: RouteObject[]) {
  list.forEach((route) => {
    if (route.meta?.requiresAuth !== undefined) {
      route.handle = { requiresAuth: route.meta.requiresAuth };
    }
    if (route.children) attachAuthHandle(route.children);
  });
}

attachAuthHandle(router);

export default createBrowserRouter(router);
