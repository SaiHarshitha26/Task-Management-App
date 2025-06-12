import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, Layout, theme } from 'antd'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Teams from './pages/Teams'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import WelcomePage from './pages/WelcomePage' // ✅ import welcome page

const { Content } = Layout

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) setToken(savedToken)
  }, [])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <ConfigProvider
      theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          {token && (
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} logout={logout} />
          )}
          <Layout style={{ marginLeft: token ? 200 : 0, padding: 24 }}>
            <Content>
              <Routes>
                <Route
                  path="/"
                  element={!token ? <WelcomePage /> : <Navigate to="/welcomepage" />}
                />
                <Route
                  path="/login"
                  element={!token ? <Login onLogin={login} /> : <Navigate to="/teams" />}
                />
                <Route
  path="/register"
  element={!token ? <Register /> : <Navigate to="/teams" />}
/>

                <Route
                  path="/teams"
                  element={token ? <Teams /> : <Navigate to="/login" />}
                />
                <Route
                  path="/projects"
                  element={token ? <Projects /> : <Navigate to="/login" />}
                />
                <Route
                  path="/tasks"
                  element={token ? <Tasks /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<Navigate to={token ? "/teams" : "/"} />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
