import { useState } from 'react';
    import { Steps, Button, Modal, Form, Input } from 'antd';
    import type { StepsProps } from 'antd';
    import DataSourceStep from './pages/DataSourceStep';
    import TableDetailStep from './pages/TableDetailStep';
    import DataPreviewStep from './pages/DataPreviewStep';
    import ConfirmationStep from './pages/ConfirmationStep';
    import ExecutionResultStep from './pages/ExecutionResultStep';

    const steps: StepsProps['items'] = [
      {
        title: '数据源',
        content: <DataSourceStep />,
      },
      {
        title: '表详情',
        content: <TableDetailStep />,
      },
      {
        title: '数据预览',
        content: <DataPreviewStep />,
      },
      {
        title: '信息确认',
        content: <ConfirmationStep />,
      },
      {
        title: '执行结果',
        content: <ExecutionResultStep />,
      },
    ];

    function App() {
      const [current, setCurrent] = useState(0);
      const [isModalOpen, setIsModalOpen] = useState(false);

      const next = () => {
        if (current === 0) {
          setIsModalOpen(true);
          return;
        }
        setCurrent(current + 1);
      };

      const prev = () => {
        setCurrent(current - 1);
      };

      const handleModalOk = () => {
        setIsModalOpen(false);
        setCurrent(current + 1);
      };

      const handleModalCancel = () => {
        setIsModalOpen(false);
      };

      return (
        <div style={{ padding: '24px' }}>
          <Steps current={current} items={steps} />
          <div style={{ marginTop: '24px' }}>{steps[current].content}</div>
          <div style={{ marginTop: '24px' }}>
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
          </div>

          <Modal
            title="任务配置"
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            <Form layout="vertical">
              <Form.Item label="配置名称" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="语言" name="language" initialValue={navigator.language}>
                <Input />
              </Form.Item>
              <Form.Item label="备注" name="remark">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      );
    }

    export default App;
