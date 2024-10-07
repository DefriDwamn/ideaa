import React, { useState, useEffect } from 'react';
import './ProjectsFeed.css';
import KanbanBoard from './KanbanBoard';
import API from '../api/axios';

const ProjectsFeed = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот проект и связанную с ним идею?')) {
      return;
    }

    try {
      // Сначала получаем проект по его ID
      const response = await API.get(`/projects/${projectId}/`);
      const ideaId = response.data.idea; // Извлекаем ID связанной идеи

      // Удаляем сначала идею, затем проект
      await API.delete(`/ideas/${ideaId}/`);

      alert('Проект и связанная с ним идея успешно удалены.');
      setSelectedProject(null);
      fetchProjects(); // Обновляем список проектов после удаления
    } catch (error) {
      console.error('Ошибка при удалении проекта или идеи:', error);
    }
  };

  const handleHideIdea = async (ideaId) => {
    if (!window.confirm('Вы уверены, что хотите скрыть эту идею?')) {
      return;
    }

    try {
      // Отправляем запрос на обновление идеи, устанавливая её как скрытую
      await API.patch(`/ideas/${ideaId}/`, { is_hidden: true });
      alert('Идея успешно скрыта.');
      setSelectedProject(null);
      fetchProjects(); // Обновляем список проектов после скрытия идеи
    } catch (error) {
      console.error('Ошибка при скрытии идеи:', error);
    }
  };

  return (
    <div className="projects-container">
      {selectedProject ? (
        <div className="kanban-container">
          <button onClick={() => setSelectedProject(null)}>Вернуться к списку проектов</button>
          <KanbanBoard project={selectedProject} />
          <div className="project-actions">
            <button
              className="delete-button"
              onClick={() => handleDeleteProject(selectedProject.id)}
            >
              Удалить проект
            </button>
            <button
              className="hide-button"
              onClick={() => handleHideIdea(selectedProject.idea)}
            >
              Скрыть идею
            </button>
          </div>
        </div>
      ) : (
        <div className="project-feed">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-post-item"
              onClick={() => handleProjectClick(project)}
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
