import { useState } from 'react';

import { Button, Form, Input, Toast } from 'antd-mobile';

import { useRouter } from '@/hooks';
import { useUserStore } from '@/store';

import { login } from '@/api/auth';

function Login() {
  const router = useRouter();
  const updateToken = useUserStore((state) => state.updateToken);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { account: string; password: string }) => {
    setLoading(true);
    try {
      const res = await login(values);
      if (res?.code === 200 && res?.data) {
        updateToken(res.data);
        Toast.show({ position: 'top', content: '登录成功' });
        router.push('/home');
      } else {
        Toast.show({ position: 'top', content: res?.message || '登录失败' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onFinish={handleFinish}
      footer={
        <>
          <Button block type="submit" color="primary" size="large" loading={loading}>
            登录
          </Button>
          <Button
            block
            fill="none"
            size="small"
            style={{ marginTop: 8 }}
            onClick={() => router.push('/register')}
          >
            没有账号？去注册
          </Button>
        </>
      }
    >
      <Form.Item
        name="account"
        label="账号"
        rules={[{ required: true, message: '请输入手机号或邮箱' }]}
      >
        <Input placeholder="请输入手机号或邮箱" />
      </Form.Item>
      <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>
    </Form>
  );
}

export default Login;
