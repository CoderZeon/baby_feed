import dayjs from 'dayjs';

export const initialTasks = [
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
  },
  {
    id: 3,
    name: '游泳',
    frequencyType: 'weekly',
    frequencyCount: 2,
    time: '白天饭后半小时',
    method: '游泳桶接37度左右水游15min',
    duration: 365,
    startDate: dayjs().format('YYYY-MM-DD'),
    completed: false
  },
  {
    id: 4,
    name: '户外活动',
    frequencyType: 'daily',
    frequencyCount: 3,
    time: '白天任何时间',
    method: '每次1小时每天不少于3小时',
    duration: 365,
    startDate: dayjs().format('YYYY-MM-DD'),
    completed: false
  }
];
