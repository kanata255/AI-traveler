import { RouteObject } from '@/types/router';

export * from './lazy-load';

/** 路由列表 */
export const routes = getRoutesFromModules();

/**
 * 基于 router/modules 文件导出的内容动态生成路由
 */
export function getRoutesFromModules() {
  const routes: RouteObject[] = [];

  const modules = import.meta.glob('../modules/**/*.tsx', { eager: true }) as Record<
    string,
    Record<'default', RouteObject[]>
  >;
  const addConfigurationToRoute = (r: RouteObject) => {
    r.loader = () => {
      // 设置标题
      document.title = r.meta?.title ?? import.meta.env.VITE_APP_TITLE;
      return null;
    };
    if (r.children) {
      r.children = r.children.map((child) => addConfigurationToRoute(child));
    }
    return r;
  };
  Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    // 为每个路由添加 loader 并递归处理子路由
    const processedRoutes = modList.map((route) => {
      return addConfigurationToRoute(route);
    });
    routes.push(...processedRoutes);
  });
  return routes;
}
