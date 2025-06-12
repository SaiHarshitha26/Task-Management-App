import React from 'react'
import { Layout, Menu, Switch } from 'antd'
import { Link, useLocation } from 'react-router-dom'

const { Sider } = Layout

interface NavbarProps {
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
  logout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, logout }) => {
  const location = useLocation()
  const selectedKey = location.pathname

  return (
    <Sider
      width={200}
      theme={darkMode ? 'dark' : 'light'}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'auto',
      }}
    >
      <div style={{ padding: '1rem', textAlign: 'center', color: darkMode ? '#fff' : '#000' }}>
        <strong>DashBoard</strong>
      </div>
      <Menu
        theme={darkMode ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%' }}
      >
        <Menu.Item key="/teams">
          <Link to="/teams">Teams</Link>
        </Menu.Item>
        <Menu.Item key="/projects">
          <Link to="/projects">Projects</Link>
        </Menu.Item>
        <Menu.Item key="/tasks">
          <Link to="/tasks">Tasks</Link>
        </Menu.Item>
        <Menu.Item key="logout" onClick={logout}>
          Logout
        </Menu.Item>
        <Menu.Item key="theme-switch" disabled>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Navbar
