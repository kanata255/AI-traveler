import { Button, Form, Input, Toast } from 'antd-mobile';

import { useRouter } from '@/hooks';

import { RegisterParams, register } from '@/api/auth';

function Register() {
  const router = useRouter();

  const handleFinish = async (values: RegisterParams) => {
    const res = await register(values);
    if (res?.code === 200) {
      Toast.show({ content: '注册成功' });
      router.push('/login');
    } else {
      Toast.show({ content: res?.message || '注册失败' });
    }
  };

  return (
    <Form
      onFinish={handleFinish}
      footer={
        <>
          <Button block type="submit" color="primary" size="large">
            注册
          </Button>
          <Button
            block
            fill="none"
            size="small"
            style={{ marginTop: 8 }}
            onClick={() => router.push('/login')}
          >
            已有账号？去登录
          </Button>
        </>
      }
    >
      <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item name="email" label="邮箱">
        <Input type="email" placeholder="选填" />
      </Form.Item>
      <Form.Item name="name" label="昵称">
        <Input placeholder="选填" />
      </Form.Item>
    </Form>
  );
}

export default Register;
