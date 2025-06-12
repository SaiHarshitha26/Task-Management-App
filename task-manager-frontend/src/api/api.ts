import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api' // Change if needed

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})

// Add token to headers if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

export default axiosInstance

// AUTH
export const loginUser = (data: { email: string; password: string }) =>
  axiosInstance.post('/auth/login', data)

export const registerUser = (data: { name: string; email: string; password: string }) =>
  axiosInstance.post('/auth/register', data)

// TEAMS
export const fetchTeams = (page = 1, limit = 5) =>
  axiosInstance.get(`/teams?page=${page}&limit=${limit}`)

export const createTeamMember = (data: { name: string; email: string; designation: string }) =>
  axiosInstance.post('/teams', data)

export const updateTeamMember = (id: string, data: { name: string; email: string; designation: string }) =>
  axiosInstance.put(`/teams/${id}`, data)

export const deleteTeamMember = (id: string) =>
  axiosInstance.delete(`/teams/${id}`)

// PROJECTS
export const fetchProjects = (page = 1, limit = 5) =>
  axiosInstance
    .get(`/projects?page=${page}&limit=${limit}`)
    .then(res => res.data.projects) // ✅ FIXED

export const createProject = (data: { name: string; description: string; teamMembers?: string[] }) =>
  axiosInstance.post('/projects', data).then(res => res.data)

export const updateProject = (id: string, data: { name: string; description: string; teamMembers?: string[] }) =>
  axiosInstance.put(`/projects/${id}`, data).then(res => res.data)

export const deleteProject = (id: string) =>
  axiosInstance.delete(`/projects/${id}`).then(res => res.data)

// TASKS
export const fetchTasks = (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value.toString())
    }
  })
  return axiosInstance.get(`/tasks?${params.toString()}`).then(res => res.data)
}

export const createTask = (data: {
  title: string
  description?: string
  deadline?: string
  project?: string
  assignedMembers?: string[]
  status?: string
}) => axiosInstance.post('/tasks', data).then(res => res.data)

export const updateTask = (
  id: string,
  data: {
    title?: string
    description?: string
    deadline?: string
    project?: string
    assignedMembers?: string[]
    status?: string
  }
) => axiosInstance.put(`/tasks/${id}`, data).then(res => res.data)

export const deleteTask = (id: string) =>
  axiosInstance.delete(`/tasks/${id}`).then(res => res.data)
