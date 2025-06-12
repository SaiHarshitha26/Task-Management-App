import React from 'react'
import { Button, Form, Input, Card, message } from 'antd'
import { loginUser } from '../api/api'

interface LoginProps {
  onLogin: (token: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const onFinish = async (values: any) => {
    try {
      const res = await loginUser(values)
      onLogin(res.data.token)
      message.success('Login successful')
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Card title="Login">
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
