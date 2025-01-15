import { useState } from 'react';
import { Table, Button, Modal, Descriptions, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ExecutionResult {
  key: string;
  startTime: string;
  endTime: string;
  format: string;
  success: boolean;
  errorMessage?: string;
  fileUrl?: string;
  configuration: {
    dataSource: any;
    tables: any[];
    exportFormat: string;
  };
}

const ExecutionResultStep = () => {
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  const results: ExecutionResult[] = [
    {
      key: '1',
      startTime: '2023-10-01 10:00:00',
      endTime: '2023-10-01 10:05:00',
      format: 'json',
      success: true,
      fileUrl: 'https://example.com/data.json',
      configuration: {
        dataSource: {
          name: '生产数据库',
          host: '192.168.1.100',
          port: 3306,
          type: 'MySQL',
          database: 'production',
          charset: 'utf8mb4',
          description: '主要生产数据库',
        },
        tables: [
          {
            name: 'users',
            description: '用户信息表',
            rowCount: 1000,
          },
          {
            name: 'orders',
            description: '订单信息表',
            rowCount: 5000,
          },
        ],
        exportFormat: 'json',
      },
    },
    {
      key: '2',
      startTime: '2023-10-02 14:00:00',
      endTime: '2023-10-02 14:10:00',
      format: 'csv',
      success: false,
      errorMessage: '文件生成失败',
      configuration: {
        dataSource: {
          name: '测试数据库',
          host: '192.168.1.101',
          port: 3306,
          type: 'MySQL',
          database: 'test',
          charset: 'utf8mb4',
          description: '测试环境数据库',
        },
        tables: [
          {
            name: 'products',
            description: '产品信息表',
            rowCount: 2000,
          },
        ],
        exportFormat: 'csv',
      },
    },
  ];

  const handleDownload = (fileUrl: string) => {
    // Simulate download
    window.open(fileUrl, '_blank');
    message.success('文件下载成功');
  };

  const handleViewConfig = (config: any) => {
    setSelectedConfig(config);
    setIsConfigModalVisible(true);
  };

  const handleDelete = (key: string) => {
    // Simulate delete
    message.success('执行结果已删除');
    console.log(
      '%cMos Debug Console: ',
      'color: #F56C6C; font-weight: bold;',
      'TODO: handleDelete',
      key
    );
  };

  const columns: ColumnsType<ExecutionResult> = [
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '生成方式',
      dataIndex: 'format',
      key: 'format',
    },
    {
      title: '状态',
      dataIndex: 'success',
      key: 'success',
      render: (success) => (success ? '成功' : '失败'),
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          {record.success && record.fileUrl && (
            <Button
              type="link"
              onClick={() => handleDownload(record.fileUrl!)}
              style={{ marginRight: 8 }}
            >
              下载
            </Button>
          )}
          <Button
            type="link"
            onClick={() => handleViewConfig(record.configuration)}
            style={{ marginRight: 8 }}
          >
            查看配置
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Table columns={columns} dataSource={results} />

      <Modal
        title="执行配置"
        open={isConfigModalVisible}
        onCancel={() => setIsConfigModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedConfig && (
          <>
            <Descriptions title="数据源信息" bordered style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="名称">{selectedConfig.dataSource.name}</Descriptions.Item>
              <Descriptions.Item label="主机地址">
                {selectedConfig.dataSource.host}
              </Descriptions.Item>
              <Descriptions.Item label="端口">{selectedConfig.dataSource.port}</Descriptions.Item>
              <Descriptions.Item label="数据库类型">
                {selectedConfig.dataSource.type}
              </Descriptions.Item>
              <Descriptions.Item label="数据库名称">
                {selectedConfig.dataSource.database}
              </Descriptions.Item>
              <Descriptions.Item label="字符集">
                {selectedConfig.dataSource.charset}
              </Descriptions.Item>
              <Descriptions.Item label="描述">
                {selectedConfig.dataSource.description}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="表信息" bordered style={{ marginBottom: '24px' }}>
              {selectedConfig.tables.map((table: any) => (
                <Descriptions.Item key={table.name} label={table.name}>
                  {table.description} (生成 {table.rowCount} 条)
                </Descriptions.Item>
              ))}
            </Descriptions>

            <Descriptions title="导出配置" bordered>
              <Descriptions.Item label="导出格式">{selectedConfig.exportFormat}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ExecutionResultStep;
