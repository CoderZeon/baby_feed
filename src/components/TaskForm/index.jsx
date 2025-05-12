import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Stepper, Selector, Toast, Radio, Space } from 'antd-mobile';
import dayjs from '../../utils/dayjs';
import './index.css';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [durationType, setDurationType] = useState('fixed');

  const frequencyOptions = [
    { label: '每日', value: 'daily' },
    { label: '每周', value: 'weekly' },
    { label: '每月', value: 'monthly' },
  ];

  React.useEffect(() => {
    if (id) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const currentTask = tasks.find(t => t.id === Number(id));
      if (currentTask) {
        setDurationType(currentTask.duration === Infinity ? 'permanent' : 'fixed');
        form.setFieldsValue({
          ...currentTask,
          duration: currentTask.duration === Infinity ? undefined : currentTask.duration
        });
      }
    }
  }, [id, form]);

  const onFinish = (values) => {
    const task = {
      ...values,
      duration: durationType === 'permanent' ? Infinity : values.duration,
      id: id ? Number(id) : Date.now(),
      startDate: dayjs().format('YYYY-MM-DD'),
      completedDates: {}
    };

    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    if (id) {
      const updatedTasks = existingTasks.map(t => 
        t.id === Number(id) ? task : t
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Toast.show({
        icon: 'success',
        content: '修改成功'
      });
    } else {
      localStorage.setItem('tasks', JSON.stringify([...existingTasks, task]));
      Toast.show({
        icon: 'success',
        content: '添加成功'
      });
    }

    navigate('/tasks');
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <div className="task-form">
      <div className="form-header">
        <h2>{id ? '编辑任务' : '新增任务'}</h2>
      </div>
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        footer={
          <div className="form-buttons">
            <Button
              block
              color="default"
              fill="outline"
              size="large"
              onClick={handleCancel}
              className="cancel-button"
            >
              取消
            </Button>
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              className="submit-button"
            >
              {id ? '保存修改' : '添加任务'}
            </Button>
          </div>
        }
      >
        <Form.Item
          name="name"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>

        <Form.Item
          name="frequencyType"
          label="频次类型"
          rules={[{ required: true, message: '请选择频次类型' }]}
        >
          <Selector
            options={frequencyOptions}
            columns={3}
          />
        </Form.Item>

        <Form.Item
          name="frequencyCount"
          label="频次次数"
          rules={[{ required: true, message: '请输入频次次数' }]}
          initialValue={1}
        >
          <Stepper min={1} />
        </Form.Item>

        <Form.Item
          name="time"
          label="操作时间"
          rules={[{ required: true, message: '请输入操作时间' }]}
        >
          <Input placeholder="如：饭后半小时" />
        </Form.Item>

        <Form.Item
          name="method"
          label="操作方式"
          rules={[{ required: true, message: '请输入操作方式' }]}
        >
          <Input placeholder="如：10ml水冲泡" />
        </Form.Item>

        <div className="duration-section">
          <div className="duration-type-selector">
            <p className="duration-label">持续时间</p>
            <Radio.Group
              value={durationType}
              onChange={(val) => setDurationType(val)}
            >
              <div className="duration-radio-group">
                <Radio value='fixed'>固定天数</Radio>
                <Radio value='permanent'>永久持续</Radio>
              </div>
            </Radio.Group>
          </div>
          
          {durationType === 'fixed' && (
            <Form.Item
              name="duration"
              rules={[{ required: true, message: '请输入持续时间' }]}
              initialValue={1}
            >
              <Stepper min={1} />
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
};

export default TaskForm;
