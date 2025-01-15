import { useState } from 'react';
import { Table, Tabs, InputNumber, Button, Tooltip, message, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

interface TestData {
  key: string;
  [key: string]: any;
}

interface TableData {
  key: string;
  name: string;
  description: string;
  encoding: string;
  columns: {
    name: string;
    description: string;
  }[];
  testData: TestData[];
}

const DataPreviewStep = () => {
  const [activeTableKey, setActiveTableKey] = useState('1');
  const [rowCount, setRowCount] = useState(10);

  const tables: TableData[] = [
    {
      key: '1',
      name: 'users',
      description: '用户信息表',
      encoding: 'utf8mb4',
      columns: [
        {
          name: 'id',
          description: '用户ID',
        },
        {
          name: 'name',
          description: '用户名',
        },
      ],
      testData: [
        {
          key: '1',
          id: 1,
          name: 'John Doe',
        },
        {
          key: '2',
          id: 2,
          name: 'Jane Smith',
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
          name: 'id',
          description: '订单ID',
        },
        {
          name: 'user_id',
          description: '用户ID',
        },
      ],
      testData: [
        {
          key: '1',
          id: 1001,
          user_id: 1,
        },
        {
          key: '2',
          id: 1002,
          user_id: 2,
        },
      ],
    },
  ];

  const handleGenerate = () => {
    // Simulate data generation
    message.success(`已生成 ${rowCount} 条测试数据`);
  };

  const handleDownload = () => {
    // Simulate download
    message.success('测试数据下载成功');
  };

  const columns: ColumnsType<TestData> =
    tables
      .find((table) => table.key === activeTableKey)
      ?.columns.map((column) => ({
        title: (
          <Tooltip title={column.name}>
            <span>{column.description}</span>
          </Tooltip>
        ),
        dataIndex: column.name,
        key: column.name,
      })) || [];

  const items: TabsProps['items'] = tables.map((table) => ({
    key: table.key,
    label: table.name,
    children: (
      <div style={{ padding: '24px' }}>
        <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="表名">{table.name}</Descriptions.Item>
          <Descriptions.Item label="描述">{table.description}</Descriptions.Item>
          <Descriptions.Item label="编码">{table.encoding}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginBottom: '16px' }}>
          <InputNumber
            min={1}
            max={1000}
            defaultValue={10}
            value={rowCount}
            onChange={(value) => setRowCount(value || 10)}
            style={{ width: '120px', marginRight: '8px' }}
          />
          <Button type="primary" onClick={handleGenerate} style={{ marginRight: '8px' }}>
            重新生成
          </Button>
          <Button onClick={handleDownload}>下载测试数据</Button>
        </div>
        <Table
          columns={columns}
          dataSource={table.testData}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    ),
  }));

  return (
    <Tabs activeKey={activeTableKey} items={items} onChange={(key) => setActiveTableKey(key)} />
  );
};

export default DataPreviewStep;
