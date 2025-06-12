// src/pages/Register.tsx
import React from 'react'
import { Button, Form, Input, Card, message, Typography } from 'antd'
import { registerUser } from '../api/api'
import { useNavigate } from 'react-router-dom'

const { Link } = Typography

const Register: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    try {
      const res = await registerUser(values)
      const token = res.data.token
      localStorage.setItem('token', token) // or call props.onRegister(token) if needed
      message.success('Registration successful')
      navigate('/tasks') // or home/dashboard page
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Card title="Register">
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

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
              Register
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link onClick={() => navigate('/login')}>Login</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Register
