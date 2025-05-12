import React, { useState, useEffect } from 'react';
import { Card, Progress } from 'antd-mobile';
import dayjs from '../../utils/dayjs';
import './index.css';

const Statistics = () => {
  const [stats, setStats] = useState({
    daily: { total: 0, completed: 0 },
    weekly: { total: 0, completed: 0 },
    monthly: { total: 0, completed: 0 }
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const today = dayjs();
    const startOfWeek = today.startOf('week');
    const startOfMonth = today.startOf('month');

    const statistics = {
      daily: { total: 0, completed: 0 },
      weekly: { total: 0, completed: 0 },
      monthly: { total: 0, completed: 0 }
    };

    tasks.forEach(task => {
      const startDate = dayjs(task.startDate);
      const endDate = startDate.add(task.duration, 'day');
      const isTaskActive = today.isBetween(startDate, endDate, 'day', '[]') ||
                          today.isSame(startDate, 'day') ||
                          today.isSame(endDate, 'day');

      if (!isTaskActive) return;

      switch (task.frequencyType) {
        case 'daily':
          statistics.daily.total += task.frequencyCount;
          if (task.completedDates?.[today.format('YYYY-MM-DD')]) {
            statistics.daily.completed += task.frequencyCount;
          }
          break;
        case 'weekly':
          if (today.isBetween(startOfWeek, startOfWeek.endOf('week'), 'day', '[]')) {
            statistics.weekly.total += task.frequencyCount;
            // 统计本周完成次数
            Object.keys(task.completedDates || {}).forEach(date => {
              if (dayjs(date).isBetween(startOfWeek, startOfWeek.endOf('week'), 'day', '[]')) {
                statistics.weekly.completed += task.frequencyCount;
              }
            });
          }
          break;
        case 'monthly':
          if (today.isBetween(startOfMonth, startOfMonth.endOf('month'), 'day', '[]')) {
            statistics.monthly.total += task.frequencyCount;
            // 统计本月完成次数
            Object.keys(task.completedDates || {}).forEach(date => {
              if (dayjs(date).isBetween(startOfMonth, startOfMonth.endOf('month'), 'day', '[]')) {
                statistics.monthly.completed += task.frequencyCount;
              }
            });
          }
          break;
      }
    });

    setStats(statistics);
  };

  const getCompletionRate = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getStatusColor = (rate) => {
    if (rate >= 80) return '#52c41a';
    if (rate >= 50) return '#1677ff';
    return '#f76707';
  };

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h2>完成情况统计</h2>
        <span>{dayjs().format('YYYY年MM月DD日')}</span>
      </div>

      <Card className="stat-card">
        <div className="stat-title">今日任务</div>
        <div className="stat-content">
          <div className="stat-progress">
            <Progress
              percent={getCompletionRate(stats.daily.completed, stats.daily.total)}
              style={{
                '--fill-color': getStatusColor(getCompletionRate(stats.daily.completed, stats.daily.total))
              }}
            />
          </div>
          <div className="stat-details">
            <div className="stat-item">
              <span className="label">总任务</span>
              <span className="value">{stats.daily.total}次</span>
            </div>
            <div className="stat-item">
              <span className="label">已完成</span>
              <span className="value">{stats.daily.completed}次</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="stat-card">
        <div className="stat-title">本周任务</div>
        <div className="stat-content">
          <div className="stat-progress">
            <Progress
              percent={getCompletionRate(stats.weekly.completed, stats.weekly.total)}
              style={{
                '--fill-color': getStatusColor(getCompletionRate(stats.weekly.completed, stats.weekly.total))
              }}
            />
          </div>
          <div className="stat-details">
            <div className="stat-item">
              <span className="label">总任务</span>
              <span className="value">{stats.weekly.total}次</span>
            </div>
            <div className="stat-item">
              <span className="label">已完成</span>
              <span className="value">{stats.weekly.completed}次</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="stat-card">
        <div className="stat-title">本月任务</div>
        <div className="stat-content">
          <div className="stat-progress">
            <Progress
              percent={getCompletionRate(stats.monthly.completed, stats.monthly.total)}
              style={{
                '--fill-color': getStatusColor(getCompletionRate(stats.monthly.completed, stats.monthly.total))
              }}
            />
          </div>
          <div className="stat-details">
            <div className="stat-item">
              <span className="label">总任务</span>
              <span className="value">{stats.monthly.total}次</span>
            </div>
            <div className="stat-item">
              <span className="label">已完成</span>
              <span className="value">{stats.monthly.completed}次</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Statistics;
