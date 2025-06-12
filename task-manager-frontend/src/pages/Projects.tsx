import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Form, Input, Select, message, Pagination } from 'antd'
import { fetchProjects, createProject, updateProject, deleteProject, fetchTeams } from '../api/api'
import search from 'antd/es/transfer/search'

const { Option } = Select

interface TeamMember {
  _id: string
  name: string
  email: string
  designation: string
}

interface Project {
  _id: string
  name: string
  description: string
  teamMembers: TeamMember[] // populated by backend
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState('')

  const [form] = Form.useForm()

  // Load projects
  const loadProjects = async (page = 1) => {
    setLoading(true)
    try {
      const data = await fetchProjects(page, 5)
      setProjects(data)
      setFilteredProjects(data)
      setCurrentPage(page)
      setTotalCount(data.length >= 5 ? (page + 1) * 5 : page * 5)
    } catch (error) {
      console.error(error)
      message.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  // Load team members for select dropdown
  const loadTeams = async () => {
    try {
      const res = await fetchTeams(1, 1000)
      setTeams(res.data.teams)
    } catch {
      message.error('Failed to load team members')
    }
  }

  useEffect(() => {
    loadProjects()
    loadTeams()
  }, [])

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects(projects)
    }
  }, [searchText, projects])

  const openModalForCreate = () => {
    setEditingProject(null)
    form.resetFields()
    setModalVisible(true)
  }

  const openModalForEdit = (project: Project) => {
    setEditingProject(project)
    form.setFieldsValue({
      name: project.name,
      description: project.description,
      teamMembers: project.teamMembers.map((tm) => tm._id),
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await deleteProject(id)
      message.success('Project deleted')
      loadProjects(currentPage)
    } catch {
      message.error('Failed to delete project')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      if (editingProject) {
        await updateProject(editingProject._id, values)
        message.success('Project updated')
      } else {
        await createProject(values)
        message.success('Project created')
      }
      setModalVisible(false)
      loadProjects(currentPage)
    } catch {
      message.error('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Team Members',
      key: 'teamMembers',
      render: (_: any, record: Project) => (
        <>
          {record.teamMembers.map((tm) => (
            <div key={tm._id}>{tm.name}</div>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <>
          <Button type="link" onClick={() => openModalForEdit(record)}>Edit</Button>
          <Button danger type="link" onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={openModalForCreate}>
          Add Project
        </Button>
        <Input.Search
          placeholder="Search projects by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredProjects}
        loading={loading}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        total={totalCount}
        pageSize={5}
        onChange={loadProjects}
        style={{ marginTop: 16, textAlign: 'right' }}
      />

      <Modal
        title={editingProject ? 'Edit Project' : 'Add Project'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input description' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Team Members"
            name="teamMembers"
            rules={[{ required: true, message: 'Please select team members' }]}
          >
            <Select mode="multiple" placeholder="Select team members">
              {teams.map((tm) => (
                <Option key={tm._id} value={tm._id}>
                  {tm.name} ({tm.designation})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects
