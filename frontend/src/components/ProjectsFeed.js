import React, { useState } from 'react';
import './ProjectsFeed.css';
import KanbanBoard from './KanbanBoard'; // Импорт компонента KanbanBoard

const ProjectsFeed = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: 'Проект 1',
    },
    {
      id: 2,
      name: 'Проект 2',
    },
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project); // При клике на проект, сохраняем его в состоянии
  };

  return (
    <div className="projects-container">
      {selectedProject ? (
        <KanbanBoard project={selectedProject} /> // Показываем канбан-доску, если выбран проект
      ) : (
        <div className="project-feed">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-post-item"
              onClick={() => handleProjectClick(project)} // Переход на канбан-доску при клике
            >
              <h2>{project.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsFeed;
