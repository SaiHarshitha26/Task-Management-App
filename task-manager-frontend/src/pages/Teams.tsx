import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Form, Input, message, Pagination } from 'antd'
import {
  fetchTeams,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../api/api'

interface TeamMember {
  _id: string
  name: string
  email: string
  designation: string
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [form] = Form.useForm()

  const loadTeams = async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetchTeams(page, 5)
      setTeams(res.data.teams)
      setCurrentPage(res.data.page)
      setTotalCount(res.data.pages * 5) // total = pages * pageSize
    } catch (error) {
      message.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const openModalForCreate = () => {
    setEditingMember(null)
    form.resetFields()
    setModalVisible(true)
  }

  const openModalForEdit = (member: TeamMember) => {
    setEditingMember(member)
    form.setFieldsValue(member)
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await deleteTeamMember(id)
      message.success('Team member deleted')
      loadTeams(currentPage)
    } catch (error) {
      message.error('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      if (editingMember) {
        await updateTeamMember(editingMember._id, values)
        message.success('Team member updated')
      } else {
        await createTeamMember(values)
        message.success('Team member created')
      }
      setModalVisible(false)
      loadTeams(currentPage)
    } catch (error) {
      message.error('Failed to save team member')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TeamMember) => (
        <>
          <Button type="link" onClick={() => openModalForEdit(record)}>
            Edit
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={openModalForCreate}
        style={{ marginBottom: 16 }}
      >
        Add Team Member
      </Button>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={teams}
        loading={loading}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        total={totalCount}
        pageSize={5}
        onChange={loadTeams}
        style={{ marginTop: 16, textAlign: 'right' }}
      />

      <Modal
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input email' },
              { type: 'email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Designation"
            name="designation"
            rules={[{ required: true, message: 'Please input designation' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Teams
