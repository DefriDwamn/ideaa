import React, { useState } from 'react';
import './MainContent.css';
import IdeasFeed from './IdeasFeed';
import ProjectsFeed from './ProjectsFeed';

const MainContent = () => {
  const [currentView, setCurrentView] = useState('ideas');

  return (
    <div className="main-content">
      <div className="side-menu">
        <div className="menu-item" onClick={() => setCurrentView('ideas')}>
          <img src="/images/newspaper-icon.png" alt="Идеи" />
        </div>
        <div className="menu-item" onClick={() => setCurrentView('projects')}>
          <img src="/images/folder-icon.png" alt="Задачи" />
        </div>
      </div>
      {currentView === 'ideas' && <IdeasFeed />}
      {currentView === 'projects' && <ProjectsFeed />}
    </div>
  );
};

export default MainContent;
