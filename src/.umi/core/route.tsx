// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import React from 'react';

export async function getRoutes() {
  const routes = {"1":{"name":"登录","path":"/login","hideInMenu":true,"hideInBreadcrumb":true,"layout":false,"id":"1"},"2":{"path":"/","redirect":"/home","parentId":"ant-design-pro-layout","id":"2"},"3":{"name":"首页","icon":"SmileOutlined","path":"/home","parentId":"ant-design-pro-layout","id":"3"},"4":{"name":"License","icon":"TabletOutlined","path":"/license","parentId":"ant-design-pro-layout","id":"4"},"5":{"path":"*","layout":false,"id":"5"},"ant-design-pro-layout":{"id":"ant-design-pro-layout","path":"/","isLayout":true}} as const;
  return {
    routes,
    routeComponents: {
'1': React.lazy(() => import(/* webpackChunkName: "p__Login__index" */'@/pages/Login/index.tsx')),
'2': React.lazy(() => import('./EmptyRoute')),
'3': React.lazy(() => import(/* webpackChunkName: "p__Home__index" */'@/pages/Home/index.tsx')),
'4': React.lazy(() => import(/* webpackChunkName: "p__License__index" */'@/pages/License/index.tsx')),
'5': React.lazy(() => import(/* webpackChunkName: "p__404" */'@/pages/404.tsx')),
'ant-design-pro-layout': React.lazy(() => import(/* webpackChunkName: "umi__plugin-layout__Layout" */'C:/code/flowm-license-ui/src/.umi/plugin-layout/Layout.tsx')),
},
  };
}
