import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar, Popup, Input, Button, Toast } from 'antd-mobile';
import { getCustomTitle, setCustomTitle } from '../../utils/storage';
import './index.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState(getCustomTitle());
  const [inputValue, setInputValue] = useState(title);

  const tabs = [
    {
      key: '/',
      title: '打卡日历',
      icon: '🌈'
    },
    {
      key: '/tasks',
      title: '任务管理',
      icon: '🎯'
    }
  ];

  const handleTitleChange = () => {
    if (!inputValue.trim()) {
      Toast.show({
        content: '标题不能为空',
        position: 'center',
      });
      return;
    }
    if (inputValue.length > 12) {
      Toast.show({
        content: '标题不能超过12个字',
        position: 'center',
      });
      return;
    }
    setTitle(inputValue);
    setCustomTitle(inputValue);
    setShowPopup(false);
    Toast.show({
      icon: 'success',
      content: '修改成功',
    });
  };

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="page-title" onClick={() => setShowPopup(true)}>
          <span className="title-text">{title}</span>
          <span className="edit-hint">✏️ 编辑</span>
        </div>
        <div className="header-decoration">
          <span>✨</span>
          <span>🌟</span>
          <span>🎈</span>
          <span>🎨</span>
          <span>🎭</span>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
      <TabBar className="custom-tab-bar" activeKey={location.pathname} onChange={key => navigate(key)}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>

      <Popup
        visible={showPopup}
        onMaskClick={() => setShowPopup(false)}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '24px 20px',
        }}
      >
        <div className="title-edit-popup">
          <h3>✨ 修改标题</h3>
          <div className="input-container">
            <Input
              placeholder="请输入标题（不超过12个字）"
              value={inputValue}
              onChange={setInputValue}
              maxLength={12}
            />
          </div>
          <div className="popup-buttons">
            <Button
              onClick={() => setShowPopup(false)}
              className="cancel-btn"
            >
              取消
            </Button>
            <Button
              onClick={handleTitleChange}
              className="confirm-btn"
            >
              确定
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Layout;
