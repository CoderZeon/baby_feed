import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Calendar from './components/Calendar';
import TaskManagement from './components/TaskManagement';
import TaskForm from './components/TaskForm';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Calendar />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="tasks/add" element={<TaskForm />} />
        <Route path="tasks/edit/:id" element={<TaskForm />} />
      </Route>
    </Routes>
  );
};

export default App;
