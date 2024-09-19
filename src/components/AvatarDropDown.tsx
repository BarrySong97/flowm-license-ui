import { AuthService } from '@/api/services/AuthService';
import { LogoutOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Dropdown, DropDownProps, Spin } from 'antd';
import { useCallback } from 'react';
import { flushSync } from 'react-dom';
export type HeaderDropdownProps = {
  overlayClassName?: string;
  placement?:
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => {
  return <Dropdown overlayClassName={cls} {...restProps} />;
};

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};
export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await AuthService.logout();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
        search: JSON.stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: any) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
    },
    [setInitialState],
  );

  const loading = (
    <span>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
