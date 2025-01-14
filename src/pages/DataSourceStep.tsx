import { useState } from 'react';
    import { Form, Input, Select, Button, message, Modal, Table } from 'antd';
    import type { ColumnsType } from 'antd/es/table';

    const { Option } = Select;

    interface DataSource {
      key: string;
      name: string;
      host: string;
      port: number;
      type: string;
      database: string;
      charset: string;
      description: string;
    }

    const DataSourceStep = () => {
      const [form] = Form.useForm();
      const [createForm] = Form.useForm();
      const [loading, setLoading] = useState(false);
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
      const [dataSources, setDataSources] = useState<DataSource[]>([
        {
          key: '1',
          name: '生产数据库',
          host: '192.168.1.100',
          port: 3306,
          type: 'mysql',
          database: 'production',
          charset: 'utf8mb4',
          description: '主要生产数据库',
        },
        {
          key: '2',
          name: '测试数据库',
          host: '192.168.1.101',
          port: 3306,
          type: 'mysql',
          database: 'test',
          charset: 'utf8mb4',
          description: '测试环境数据库',
        },
      ]);

      const columns: ColumnsType<DataSource> = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '主机地址',
          dataIndex: 'host',
          key: 'host',
        },
        {
          title: '端口',
          dataIndex: 'port',
          key: 'port',
        },
        {
          title: '数据库类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '数据库名称',
          dataIndex: 'database',
          key: 'database',
        },
        {
          title: '操作',
          key: 'action',
          render: () => (
            <Button type="link" onClick={showCreateModal}>
              新建
            </Button>
          ),
        },
      ];

      const onFinish = async (values: any) => {
        setLoading(true);
        try {
          // Simulate connection test
          await new Promise((resolve) => setTimeout(resolve, 1000));
          message.success('连接成功');
        } catch (error) {
          message.error('连接失败');
        } finally {
          setLoading(false);
        }
      };

      const showModal = () => {
        setIsModalVisible(true);
      };

      const showCreateModal = () => {
        setIsCreateModalVisible(true);
      };

      const handleOk = (record: DataSource) => {
        form.setFieldsValue({
          name: record.name,
          host: record.host,
          port: record.port,
          type: record.type,
          database: record.database,
          charset: record.charset,
          description: record.description,
        });
        setIsModalVisible(false);
      };

      const handleCreateOk = () => {
        createForm
          .validateFields()
          .then((values) => {
            const newDataSource = {
              key: String(dataSources.length + 1),
              ...values,
            };
            setDataSources([...dataSources, newDataSource]);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            message.success('数据源创建成功');
          })
          .catch(() => {
            message.error('请填写完整信息');
          });
      };

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const handleCreateCancel = () => {
        setIsCreateModalVisible(false);
        createForm.resetFields();
      };

      return (
        <>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              port: 3306,
              charset: 'utf8mb4',
            }}
          >
            <Form.Item
              label="数据源名称"
              name="name"
              rules={[{ required: true, message: '请输入数据源名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="主机地址"
              name="host"
              rules={[{ required: true, message: '请输入主机地址' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="端口"
              name="port"
              rules={[{ required: true, message: '请输入端口' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="数据库类型"
              name="type"
              rules={[{ required: true, message: '请选择数据库类型' }]}
            >
              <Select>
                <Option value="mysql">MySQL</Option>
                <Option value="postgresql">PostgreSQL</Option>
                <Option value="sqlserver">SQL Server</Option>
                <Option value="oracle">Oracle</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="数据库名称"
              name="database"
              rules={[{ required: true, message: '请输入数据库名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="字符集" name="charset">
              <Select>
                <Option value="utf8mb4">utf8mb4</Option>
                <Option value="utf8">utf8</Option>
                <Option value="latin1">latin1</Option>
              </Select>
            </Form.Item>
            <Form.Item label="描述" name="description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                测试连接
              </Button>
              <Button onClick={showModal}>选择已有数据源</Button>
            </Form.Item>
          </Form>

          <Modal
            title="选择数据源"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={800}
          >
            <Table
              columns={columns}
              dataSource={dataSources}
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleOk(record),
              })}
              rowClassName="cursor-pointer"
            />
          </Modal>

          <Modal
            title="新建数据源"
            open={isCreateModalVisible}
            onOk={handleCreateOk}
            onCancel={handleCreateCancel}
          >
            <Form form={createForm} layout="vertical">
              <Form.Item
                label="数据源名称"
                name="name"
                rules={[{ required: true, message: '请输入数据源名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="主机地址"
                name="host"
                rules={[{ required: true, message: '请输入主机地址' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="端口"
                name="port"
                rules={[{ required: true, message: '请输入端口' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="数据库类型"
                name="type"
                rules={[{ required: true, message: '请选择数据库类型' }]}
              >
                <Select>
                  <Option value="mysql">MySQL</Option>
                  <Option value="postgresql">PostgreSQL</Option>
                  <Option value="sqlserver">SQL Server</Option>
                  <Option value="oracle">Oracle</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="数据库名称"
                name="database"
                rules={[{ required: true, message: '请输入数据库名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="字符集" name="charset">
                <Select>
                  <Option value="utf8mb4">utf8mb4</Option>
                  <Option value="utf8">utf8</Option>
                  <Option value="latin1">latin1</Option>
                </Select>
              </Form.Item>
              <Form.Item label="描述" name="description">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    export default DataSourceStep;
