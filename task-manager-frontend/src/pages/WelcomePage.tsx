import React from 'react'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const WelcomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '700px',
          textAlign: 'center',
        }}
      >
        <Title level={2}>Welcome to TaskFyer</Title>
        <Paragraph>
          TaskFyer helps teams and individuals stay organized and productive. You can:
        </Paragraph>
        <ul style={{ textAlign: 'left', fontSize: '16px', marginTop: 10 }}>
          <li>Create and manage projects</li>
          <li>Assign tasks to team members</li>
          <li>Set deadlines and track status</li>
          <li>Filter tasks and view team workloads</li>
        </ul>

        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button type="primary" size="large" onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button type="default" size="large" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
