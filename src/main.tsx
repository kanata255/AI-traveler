import { createRoot } from 'react-dom/client';

// 注册兼容 React 19 的渲染方法
import { unstableSetRender } from 'antd-mobile';
import 'antd-mobile/es/global';

// 公共样式
import '@/styles/scss/global.scss';

import App from './app.tsx';

unstableSetRender((node, container) => {
  // 关键改动：先把 container 断言为 any
  const el = container as any;
  el._reactRoot ||= createRoot(container);
  const root = el._reactRoot;

  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

function setupApp() {
  createRoot(document.getElementById('root')!).render(<App />);
}

setupApp();
