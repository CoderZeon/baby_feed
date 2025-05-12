import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar, Card, Button, Toast, Dialog } from 'antd-mobile';
import dayjs from '../../utils/dayjs';
import './index.css';

const Calendar = () => {
  const now = dayjs();
  const [selectedDate, setSelectedDate] = useState(now);
  const [currentMonth, setCurrentMonth] = useState(now);
  const [tasks, setTasks] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    const dateTasks = tasks.filter(task => {
      const startDate = dayjs(task.startDate);
      const endDate = task.duration === Infinity ? dayjs().add(100, 'year') : startDate.add(task.duration, 'day');
      return dayjs(selectedDate).isBetween(startDate, endDate, 'day', '[]') ||
             dayjs(selectedDate).isSame(startDate, 'day') ||
             dayjs(selectedDate).isSame(endDate, 'day');
    });
    setSelectedDateTasks(dateTasks);
  }, [selectedDate, tasks]);

  const handleComplete = async (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task };
        if (!updatedTask.completedDates) {
          updatedTask.completedDates = {};
        }
        updatedTask.completedDates[selectedDate.format('YYYY-MM-DD')] = true;
        return updatedTask;
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

  const handleCancelComplete = async (taskId) => {
    const result = await Dialog.confirm({
      content: '确定要取消这次打卡吗？',
      confirmText: '确定',
      cancelText: '取消'
    });

    if (result) {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task };
          if (updatedTask.completedDates) {
            delete updatedTask.completedDates[selectedDate.format('YYYY-MM-DD')];
          }
          return updatedTask;
        }
        return task;
      });
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Toast.show({
        icon: 'success',
        content: '已取消打卡'
      });
    }
  };

  const isTaskCompleted = (task) => {
    return task.completedDates?.[selectedDate.format('YYYY-MM-DD')];
  };

  const getDateExtra = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const dateTasks = tasks.filter(task => {
      const startDate = dayjs(task.startDate);
      const endDate = task.duration === Infinity ? dayjs().add(100, 'year') : startDate.add(task.duration, 'day');
      return dayjs(date).isBetween(startDate, endDate, 'day', '[]') ||
             dayjs(date).isSame(startDate, 'day') ||
             dayjs(date).isSame(endDate, 'day');
    });

    if (dateTasks.length === 0) return;

    const completedTasks = dateTasks.filter(task => 
      task.completedDates?.[formattedDate]
    );

    return {
      className: completedTasks.length === dateTasks.length ? 
        'calendar-date-completed' : 'calendar-date-pending'
    };
  };

  return (
    <div className="calendar-view">
      <div className="calendar-container">
        <AntCalendar
          selectionMode="single"
          defaultValue={now.toDate()}
          value={selectedDate.toDate()}
          onChange={(val) => setSelectedDate(dayjs(val))}
          onPageChange={(val) => setCurrentMonth(dayjs(val))}
          getDateExtra={getDateExtra}
        />
      </div>

      <div className="daily-tasks">
        {selectedDateTasks.map(task => (
          <Card key={task.id} className="task-card">
            <div className="task-content">
              <div className="task-header">
                <h3>{task.name}</h3>
                <span className={`status ${isTaskCompleted(task) ? 'completed' : ''}`}>
                  {isTaskCompleted(task) ? '已完成' : '待完成'}
                </span>
              </div>
              <div className="task-info">
                <p>频次：{task.frequencyCount}次{
                  task.frequencyType === 'daily' ? '/天' :
                  task.frequencyType === 'weekly' ? '/周' : '/月'
                }</p>
                <p>时间：{task.time}</p>
                <p>方式：{task.method}</p>
                <p>持续：{task.duration === Infinity ? '永久持续' : `${task.duration}天`}</p>
              </div>
            </div>
            <div className="task-actions">
              {isTaskCompleted(task) ? (
                <Button
                  onClick={() => handleCancelComplete(task.id)}
                  className="cancel-btn"
                >
                  取消打卡
                </Button>
              ) : (
                <Button
                  onClick={() => handleComplete(task.id)}
                  className="complete-btn"
                >
                  打卡
                </Button>
              )}
            </div>
          </Card>
        ))}

        {selectedDateTasks.length === 0 && (
          <div className="empty-state">
            <p>当日无任务安排</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
