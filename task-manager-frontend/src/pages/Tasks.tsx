import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Pagination,
  AutoComplete,
} from 'antd';
import moment from 'moment';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchProjects,
  fetchTeams,
} from '../api/api';

const { RangePicker } = DatePicker;

interface Member {
  _id: string;
  name: string;
  designation: string;
}

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  deadline?: string;
  project?: Project;
  assignedMembers?: Member[];
  status?: string;
}

const statusOptions = ['to-do', 'in-progress', 'done', 'cancelled'];

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [form] = Form.useForm();

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [filters, setFilters] = useState({
    project: '',
    member: '',
    status: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  const [searchOptions, setSearchOptions] = useState<string[]>([]);

  const loadTasks = async (page = 1) => {
    setLoading(true);
    try {
      const query: any = {
        page,
        limit: 5,
      };
      if (filters.project) query.project = filters.project;
      if (filters.member) query.assignedMember = filters.member;
      if (filters.status) query.status = filters.status;
      if (filters.search) query.search = filters.search;
      if (filters.startDate) query.startDate = filters.startDate;
      if (filters.endDate) query.endDate = filters.endDate;

      const data = await fetchTasks(page, 5, query);
      setTasks(data.tasks);
      setTotalCount(data.totalCount);
      setCurrentPage(page);
    } catch {
      message.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch {
      message.error('Failed to load projects');
    }
  };

  const loadTeams = async () => {
    try {
      const res = await fetchTeams(1, 1000);
      setMembers(res.data.teams);
    } catch {
      message.error('Failed to load team members');
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
    loadTeams();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (_: any, dates: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      startDate: dates[0] || '',
      endDate: dates[1] || '',
    }));
  };

  const handleSearchChange = async (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    if (!value) {
      setSearchOptions([]);
      return;
    }

    try {
      const res = await fetch(`/api/tasks/suggestions?query=${value}`);
      const data = await res.json();
      setSearchOptions(data);
    } catch {
      setSearchOptions([]);
    }
  };

  const handleSearchSelect = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const openModalForCreate = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openModalForEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      deadline: task.deadline ? moment(task.deadline) : null,
      assignedMembers: task.assignedMembers?.map(m => m._id) || [],
      project: task.project?._id,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteTask(id);
      message.success('Task deleted');
      loadTasks(currentPage);
    } catch {
      message.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
      };
      if (editingTask) {
        await updateTask(editingTask._id, payload);
        message.success('Task updated');
      } else {
        await createTask(payload);
        message.success('Task created');
      }
      setModalVisible(false);
      loadTasks(currentPage);
    } catch {
      message.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Project',
      dataIndex: ['project', 'name'],
      key: 'project',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedMembers',
      key: 'assignedMembers',
      render: (members: Member[]) =>
        members?.map(m => `${m.name} (${m.designation})`).join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => (date ? moment(date).format('YYYY-MM-DD') : 'N/A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Task) => (
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
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <AutoComplete
          style={{ width: 200 }}
          options={searchOptions.map(title => ({ value: title }))}
          onSearch={handleSearchChange}
          onSelect={handleSearchSelect}
          placeholder="Search by title"
        />
        <Select
          placeholder="Project"
          allowClear
          onChange={(val) => handleFilterChange('project', val || '')}
          style={{ width: 160 }}
        >
          {projects.map(p => (
            <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Member"
          allowClear
          onChange={(val) => handleFilterChange('member', val || '')}
          style={{ width: 160 }}
        >
          {members.map(m => (
            <Select.Option key={m._id} value={m._id}>
              {m.name} ({m.designation})
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Status"
          allowClear
          onChange={(val) => handleFilterChange('status', val || '')}
          style={{ width: 140 }}
        >
          {statusOptions.map(s => (
            <Select.Option key={s} value={s}>{s}</Select.Option>
          ))}
        </Select>
        <RangePicker onChange={handleDateRangeChange} />
        <Button type="primary" onClick={() => loadTasks(1)}>
          Apply Filters
        </Button>
      </div>

      <Button type="primary" onClick={openModalForCreate} style={{ marginBottom: 16 }}>
        Add Task
      </Button>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={tasks}
        loading={loading}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        total={totalCount}
        pageSize={5}
        onChange={loadTasks}
        style={{ marginTop: 16, textAlign: 'right' }}
      />

      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="project" label="Project" rules={[{ required: true }]}>
            <Select>
              {projects.map(p => (
                <Select.Option key={p._id} value={p._id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assignedMembers" label="Assign Members">
            <Select mode="multiple">
              {members.map(m => (
                <Select.Option key={m._id} value={m._id}>
                  {m.name} ({m.designation})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              {statusOptions.map(s => (
                <Select.Option key={s} value={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="deadline" label="Deadline">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TasksPage;
