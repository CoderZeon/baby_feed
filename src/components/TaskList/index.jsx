import React, { useState, useEffect } from 'react';
import { Card, Button, SwipeAction, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import dayjs from '../../utils/dayjs';
import './index.css';

const initialTasks = [
  {
    id: 1,
    name: '补锌',
    frequencyType: 'daily',
    frequencyCount: 1,
    time: '饭后半小时',
    method: '10ml水冲泡',
    duration: 30,
    startDate: dayjs().format('YYYY-MM-DD'),
    completed: false
  },
  {
    id: 2,
    name: '补益生菌',
    frequencyType: 'daily',
    frequencyCount: 2,
    time: '可以和母乳一起喂',
    method: '40度以下冲泡',
    duration: 7,
    startDate: dayjs().format('YYYY-MM-DD'),
    completed: false
  }
];

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (storedTasks.length === 0) {
      localStorage.setItem('tasks', JSON.stringify(initialTasks));
      storedTasks = initialTasks;
    }
    setTasks(storedTasks);
  }, []);

  const handleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    Toast.show({
      icon: 'success',
      content: '打卡成功'
    });
  };

  const handleAction = (action, taskId) => {
    if (action === 'delete') {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Toast.show({
        icon: 'success',
        content: '删除成功'
      });
    } else if (action === 'edit') {
      navigate(`/edit/${taskId}`);
    }
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>今日任务</h2>
        <span>{dayjs().format('YYYY-MM-DD')}</span>
      </div>

      {tasks.map(task => (
        <SwipeAction
          key={task.id}
          rightActions={[
            {
              key: 'edit',
              text: '编辑',
              color: 'primary',
              onClick: () => handleAction('edit', task.id)
            },
            {
              key: 'delete',
              text: '删除',
              color: 'danger',
              onClick: () => handleAction('delete', task.id)
            }
          ]}
        >
          <Card className="task-card">
            <div className="task-header">
              <h3>{task.name}</h3>
              <span className={`status ${task.completed ? 'completed' : ''}`}>
                {task.completed ? '已完成' : '待完成'}
              </span>
            </div>
            <div className="task-info">
              <p>频次：{task.frequencyCount}次{
                task.frequencyType === 'daily' ? '/天' :
                task.frequencyType === 'weekly' ? '/周' : '/月'
              }</p>
              <p>时间：{task.time}</p>
              <p>方式：{task.method}</p>
            </div>
            {!task.completed && (
              <Button
                color="primary"
                fill="outline"
                onClick={() => handleComplete(task.id)}
                className="complete-btn"
              >
                打卡
              </Button>
            )}
          </Card>
        </SwipeAction>
      ))}

      {tasks.length === 0 && (
        <div className="empty-state">
          <p>暂无任务</p>
          <Button
            color="primary"
            onClick={() => navigate('/add')}
          >
            添加任务
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
