import { RouteObject as ReactRouteObject } from 'react-router';

export type RouteObject = {
  meta?: {
    title: string; // 页面标题
    requiresAuth?: boolean; // 是否需要登录（默认 true，false 表示白名单）
  };
} & ReactRouteObject;
