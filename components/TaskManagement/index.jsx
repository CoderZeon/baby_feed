import React, { useState, useEffect } from 'react';
import { Button, Card, Dialog, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import dayjs from '../../utils/dayjs';
import './index.css';

const TaskManagement = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  const handleDelete = async (taskId) => {
    const result = await Dialog.confirm({
      content: '确定要删除这个任务吗？',
      confirmText: '删除',
      cancelText: '取消',
    });

    if (result) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Toast.show({
        icon: 'success',
        content: '删除成功'
      });
    }
  };

  const getTaskStatus = (task) => {
    const startDate = dayjs(task.startDate);
    const endDate = startDate.add(task.duration, 'day');
    const now = dayjs();

    if (now.isBefore(startDate)) {
      return { text: '未开始', className: 'not-started' };
    } else if (now.isAfter(endDate)) {
      return { text: '已结束', className: 'ended' };
    } else {
      return { text: '进行中', className: 'active' };
    }
  };

  return (
    <div className="task-management">
      <div className="management-header">
        <h2>任务管理</h2>
        <Button 
          color="primary"
          onClick={() => navigate('/tasks/add')}
        >
          新增任务
        </Button>
      </div>

      <div className="tasks-container">
        {tasks.map(task => {
          const status = getTaskStatus(task);
          return (
            <Card key={task.id} className="task-management-card">
              <div className="task-management-header">
                <h3>{task.name}</h3>
                <span className={`task-status ${status.className}`}>
                  {status.text}
                </span>
              </div>
              
              <div className="task-management-info">
                <p>频次：{task.frequencyCount}次{
                  task.frequencyType === 'daily' ? '/天' :
                  task.frequencyType === 'weekly' ? '/周' : '/月'
                }</p>
                <p>时间：{task.time}</p>
                <p>方式：{task.method}</p>
                <p>持续时间：{task.duration}天</p>
                <p>开始日期：{task.startDate}</p>
              </div>

              <div className="task-management-actions">
                <Button
                  color="primary"
                  fill="outline"
                  onClick={() => navigate(`/tasks/edit/${task.id}`)}
                >
                  编辑
                </Button>
                <Button
                  color="danger"
                  fill="outline"
                  onClick={() => handleDelete(task.id)}
                >
                  删除
                </Button>
              </div>
            </Card>
          );
        })}

        {tasks.length === 0 && (
          <div className="empty-state">
            <p>暂无任务</p>
            <Button
              color="primary"
              onClick={() => navigate('/tasks/add')}
            >
              添加任务
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
