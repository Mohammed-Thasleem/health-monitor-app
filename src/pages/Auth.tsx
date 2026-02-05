import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.scss';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await signIn(values.email, values.password);
      message.success('Logged in successfully');
    } catch (error) {
      message.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await signUp(values.email, values.password);
      message.success('Account created! Please log in.');
    } catch (error) {
      message.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Login',
      children: (
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'signup',
      label: 'Sign Up',
      children: (
        <Form onFinish={handleSignup} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1>Health Monitor</h1>
          <p>Track your health metrics daily</p>
        </div>
        <Tabs items={tabItems} centered />
      </Card>
    </div>
  );
};
