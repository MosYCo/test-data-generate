import { useState, useEffect } from 'react';
    import { Form, Input, Select, Button, Table, Modal, Tabs, message, Switch } from 'antd';
    import type { ColumnsType } from 'antd/es/table';
    import type { TabsProps } from 'antd';

    const { Option } = Select;

    interface ColumnData {
      key: string;
      name: string;
      type: string;
      isForeignKey: boolean;
      foreignKeyTable?: string;
      foreignKeyColumn?: string;
      description: string;
      generationRule: string;
      example: string;
    }

    interface TableData {
      key: string;
      name: string;
      description: string;
      encoding: string;
      columns: ColumnData[];
    }

    const TableDetailStep = () => {
      const [form] = Form.useForm();
      const [editForm] = Form.useForm();
      const [activeTableKey, setActiveTableKey] = useState('1');
      const [isEditModalVisible, setIsEditModalVisible] = useState(false);
      const [editingColumn, setEditingColumn] = useState<ColumnData | null>(null);
      const [isForeignKey, setIsForeignKey] = useState(false);
      const [relatedTableColumns, setRelatedTableColumns] = useState<ColumnData[]>([]);

      const tables: TableData[] = [
        {
          key: '1',
          name: 'users',
          description: '用户信息表',
          encoding: 'utf8mb4',
          columns: [
            {
              key: '1-1',
              name: 'id',
              type: 'int',
              isForeignKey: false,
              description: '用户ID',
              generationRule: '自增',
              example: '1',
            },
            {
              key: '1-2',
              name: 'name',
              type: 'varchar(255)',
              isForeignKey: false,
              description: '用户名',
              generationRule: '随机生成',
              example: 'John Doe',
            },
          ],
        },
        {
          key: '2',
          name: 'orders',
          description: '订单信息表',
          encoding: 'utf8mb4',
          columns: [
            {
              key: '2-1',
              name: 'id',
              type: 'int',
              isForeignKey: false,
              description: '订单ID',
              generationRule: '自增',
              example: '1001',
            },
            {
              key: '2-2',
              name: 'user_id',
              type: 'int',
              isForeignKey: true,
              foreignKeyTable: 'users',
              foreignKeyColumn: 'id',
              description: '用户ID',
              generationRule: '关联用户表',
              example: '1',
            },
          ],
        },
      ];

      const columns: ColumnsType<ColumnData> = [
        {
          title: '列名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '外键',
          dataIndex: 'isForeignKey',
          key: 'isForeignKey',
          render: (value) => (value ? '是' : '否'),
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '生成规则',
          dataIndex: 'generationRule',
          key: 'generationRule',
        },
        {
          title: '样例',
          dataIndex: 'example',
          key: 'example',
        },
        {
          title: '操作',
          key: 'action',
          render: (_, record) => (
            <Button type="link" onClick={() => showEditModal(record)}>
              编辑
            </Button>
          ),
        },
      ];

      const showEditModal = (record: ColumnData) => {
        setEditingColumn(record);
        setIsForeignKey(record.isForeignKey);
        editForm.setFieldsValue(record);
        setIsEditModalVisible(true);
      };

      const handleEditOk = () => {
        editForm
          .validateFields()
          .then((values) => {
            const updatedTables = tables.map((table) => {
              if (table.key === activeTableKey) {
                return {
                  ...table,
                  columns: table.columns.map((column) =>
                    column.key === editingColumn?.key ? { ...column, ...values } : column
                  ),
                };
              }
              return table;
            });
            message.success('列信息更新成功');
            setIsEditModalVisible(false);
          })
          .catch(() => {
            message.error('请填写完整信息');
          });
      };

      const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
      };

      const handleForeignKeyChange = (checked: boolean) => {
        setIsForeignKey(checked);
        if (!checked) {
          editForm.setFieldsValue({
            foreignKeyTable: undefined,
            foreignKeyColumn: undefined,
          });
        }
      };

      const handleForeignKeyTableChange = (tableName: string) => {
        const selectedTable = tables.find((table) => table.name === tableName);
        if (selectedTable) {
          setRelatedTableColumns(selectedTable.columns);
          editForm.setFieldsValue({ foreignKeyColumn: undefined });
        }
      };

      useEffect(() => {
        if (editingColumn?.foreignKeyTable) {
          const selectedTable = tables.find(
            (table) => table.name === editingColumn.foreignKeyTable
          );
          if (selectedTable) {
            setRelatedTableColumns(selectedTable.columns);
          }
        }
      }, [editingColumn, tables]);

      const items: TabsProps['items'] = tables.map((table) => ({
        key: table.key,
        label: table.name,
        children: (
          <div style={{ padding: '24px' }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: table.name,
                description: table.description,
                encoding: table.encoding,
              }}
            >
              <Form.Item label="表名" name="name">
                <Input disabled />
              </Form.Item>
              <Form.Item label="描述" name="description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="编码" name="encoding">
                <Select>
                  <Option value="utf8mb4">utf8mb4</Option>
                  <Option value="utf8">utf8</Option>
                  <Option value="latin1">latin1</Option>
                </Select>
              </Form.Item>
            </Form>
            <Table
              columns={columns}
              dataSource={table.columns}
              pagination={false}
              style={{ marginTop: '24px' }}
            />
          </div>
        ),
      }));

      return (
        <>
          <Tabs
            activeKey={activeTableKey}
            items={items}
            onChange={(key) => setActiveTableKey(key)}
          />

          <Modal
            title="编辑列信息"
            open={isEditModalVisible}
            onOk={handleEditOk}
            onCancel={handleEditCancel}
          >
            <Form form={editForm} layout="vertical">
              <Form.Item
                label="列名"
                name="name"
                rules={[{ required: true, message: '请输入列名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请输入类型' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="是否外键" name="isForeignKey" valuePropName="checked">
                <Switch checked={isForeignKey} onChange={handleForeignKeyChange} />
              </Form.Item>
              {isForeignKey && (
                <>
                  <Form.Item
                    label="关联表"
                    name="foreignKeyTable"
                    rules={[{ required: true, message: '请选择关联表' }]}
                  >
                    <Select onChange={handleForeignKeyTableChange}>
                      {tables.map((table) => (
                        <Option key={table.key} value={table.name}>
                          {table.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="关联列"
                    name="foreignKeyColumn"
                    rules={[{ required: true, message: '请选择关联列' }]}
                  >
                    <Select>
                      {relatedTableColumns.map((column) => (
                        <Option key={column.key} value={column.name}>
                          {column.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              )}
              <Form.Item label="描述" name="description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="生成规则" name="generationRule">
                <Input />
              </Form.Item>
              <Form.Item label="样例" name="example">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </>
      );
    };

    export default TableDetailStep;
