// 运行时配置
import {
  history,
  RunTimeLayoutConfig,
  RuntimeReactQueryType,
} from '@umijs/max';
import { User } from './api/models/user';
import { AuthService } from './api/services/AuthService';
import { AvatarDropdown } from './components/AvatarDropDown';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
const loginPath = '/login';
export async function getInitialState(): Promise<{
  currentUser?: User;
  loading?: boolean;
  fetchUserInfo?: () => Promise<User | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  return {
    fetchUserInfo,
  };
}

export const reactQuery: RuntimeReactQueryType = {
  devtool: {
    initialIsOpen: true,
  },
  queryClient: {
    defaultOptions: {
      queries: {
        // 🟡 此配置具有的表现往往令人出乎意料，若无特殊需求，请默认关闭
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      },
    },
  },
};
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    logo: 'https://www.flowm.cc/icon-512.png',
    // 自定义 403 页面
    avatarProps: {
      src: 'https://www.flowm.cc/icon-512.png',
      title: 'BarrySong',
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
      size: 'small',
    },
    actionsRender: () => {
      return [];
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 自定义 404 页面
    noFound: <div>noFound</div>,
    menu: {
      locale: false,
    },
  };
};
