import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  reactQuery: {},
  favicons: ['https://www.flowm.cc/icon-512.png'],
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  layout: {
    title: 'Flowm-License',
  },
  routes: [
    {
      name: '登录',
      path: '/login',
      hideInMenu: true,
      hideInBreadcrumb: true,
      layout: false,
      component: './Login',
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      icon: 'SmileOutlined',
      path: '/home',
      component: './Home',
    },
    {
      name: 'License',
      icon: 'TabletOutlined',
      path: '/license',
      component: './License',
    },
    {
      path: '*',
      layout: false,
      component: './404',
    },
  ],
  npmClient: 'pnpm',
  tailwindcss: {},
});
