import { useState } from 'react';
import { Descriptions, Table, Select, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface TableInfo {
  key: string;
  name: string;
  description: string;
  rowCount: number;
}

const ConfirmationStep = ({ onExecute }: { onExecute: () => void }) => {
  const [exportFormat, setExportFormat] = useState('json');

  const dataSourceInfo = {
    name: '生产数据库',
    host: '192.168.1.100',
    port: 3306,
    type: 'MySQL',
    database: 'production',
    charset: 'utf8mb4',
    description: '主要生产数据库',
  };

  const tables: TableInfo[] = [
    {
      key: '1',
      name: 'users',
      description: '用户信息表',
      rowCount: 1000,
    },
    {
      key: '2',
      name: 'orders',
      description: '订单信息表',
      rowCount: 5000,
    },
  ];

  const columns: ColumnsType<TableInfo> = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '生成条数',
      dataIndex: 'rowCount',
      key: 'rowCount',
    },
  ];

  const handleExecute = () => {
    message.success(`测试数据将以 ${exportFormat} 格式生成`);
    onExecute();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Descriptions title="数据源信息" bordered style={{ marginBottom: '24px' }}>
        <Descriptions.Item label="名称">{dataSourceInfo.name}</Descriptions.Item>
        <Descriptions.Item label="主机地址">{dataSourceInfo.host}</Descriptions.Item>
        <Descriptions.Item label="端口">{dataSourceInfo.port}</Descriptions.Item>
        <Descriptions.Item label="数据库类型">{dataSourceInfo.type}</Descriptions.Item>
        <Descriptions.Item label="数据库名称">{dataSourceInfo.database}</Descriptions.Item>
        <Descriptions.Item label="字符集">{dataSourceInfo.charset}</Descriptions.Item>
        <Descriptions.Item label="描述">{dataSourceInfo.description}</Descriptions.Item>
      </Descriptions>

      <Table
        columns={columns}
        dataSource={tables}
        pagination={false}
        style={{ marginBottom: '24px' }}
      />

      <div style={{ marginBottom: '24px' }}>
        <span style={{ marginRight: '8px' }}>导出格式:</span>
        <Select
          value={exportFormat}
          style={{ width: 120 }}
          onChange={(value) => setExportFormat(value)}
        >
          <Select.Option value="json">JSON 文件</Select.Option>
          <Select.Option value="csv">CSV 文件</Select.Option>
          <Select.Option value="xml">XML 文件</Select.Option>
          <Select.Option value="sql">SQL 文件</Select.Option>
        </Select>
      </div>

      <Button type="primary" onClick={handleExecute}>
        执行
      </Button>
    </div>
  );
};

export default ConfirmationStep;
