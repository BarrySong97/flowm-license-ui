import { OpenAPI } from '@/api/core/OpenAPI';
import { AuthService } from '@/api/services/AuthService';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { message } from 'antd';
import { flushSync } from 'react-dom';
import './index.css';

export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      // 登录
      const token = await AuthService.login({ ...values });

      if (token.accessToken) {
        message.success('登录成功');
        window.localStorage.setItem('accessToken', token.accessToken);
        window.localStorage.setItem('refreshToken', token.refreshToken);
        OpenAPI.TOKEN = token.accessToken;
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // 如果失败去设置用户错误信息
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };
  return (
    <ProConfigProvider hashed={false}>
      <div className="h-screen flex flex-col items-center justify-center">
        <LoginForm
          logo="https://www.flowm.cc/icon-512.png"
          title="Flowm-License"
          onFinish={async (values) => {
            await handleSubmit(values as { email: string; password: string });
          }}
          subTitle="Flowm License管理平台"
        >
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
              {
                type: 'email',
                message: '请输入正确的邮箱地址!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
              strengthText:
                'Password should contain numbers, letters and special characters, at least 8 characters long.',
              statusRender: (value) => {
                const getStatus = () => {
                  if (value && value.length > 12) {
                    return 'ok';
                  }
                  if (value && value.length > 6) {
                    return 'pass';
                  }
                  return 'poor';
                };
                const status = getStatus();
                if (status === 'pass') {
                  return <div>强度：中</div>;
                }
                if (status === 'ok') {
                  return <div>强度：强</div>;
                }
                return <div>强度：弱</div>;
              },
            }}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
