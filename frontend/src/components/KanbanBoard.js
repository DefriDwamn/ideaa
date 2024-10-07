import React, { useState, useEffect } from 'react';
import './KanbanBoard.css';
import API from '../api/axios';

const KanbanBoard = ({ project }) => {
  const [columns, setColumns] = useState([
    { id: 'todo', name: 'To Do', tasks: [] },
    { id: 'in_progress', name: 'In Progress', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] },
  ]);
  const [ideaDescription, setIdeaDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      fetchTasks();
      setIdeaDescription(project.idea.text);
    }
  }, [project]);

  const fetchTasks = async () => {
    try {
      const response = await API.get(`/projects/${project.id}/tasks/`);
      const tasks = response.data;
      const updatedColumns = columns.map((column) => ({
        ...column,
        tasks: tasks.filter((task) => task.status === column.id),
      }));
      setColumns(updatedColumns);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const handleSaveIdeaDescription = async () => {
    try {
      await API.put(`/ideas/${project.idea}/`, { text: ideaDescription });
      alert('Описание идеи обновлено.');
    } catch (error) {
      console.error('Ошибка при обновлении описания идеи:', error);
    }
  };

  // Код для добавления задач и обработки перетаскивания остаётся прежним

  return (
    <div className="kanban-board">
      <div className="idea-description">
        <textarea
          value={ideaDescription}
          onChange={(e) => setIdeaDescription(e.target.value)}
          rows="3"
        ></textarea>
        <button onClick={handleSaveIdeaDescription} className="save-description-btn">
          Сохранить описание
        </button>
      </div>
      <div className="kanban-columns">
        {columns.map((column) => (
          <div key={column.id} className="kanban-column">
            <div className="column-header">
              <span>{column.name}</span>
              <button className="edit-icon">✏️</button>
            </div>
            <div className="kanban-droppable">
              {column.tasks.map((task) => (
                <div key={task.id} className="kanban-item">
                  {task.description}
                  <button className="edit-icon">✏️</button>
                </div>
              ))}
            </div>
            <div className="form-container">
              <form /* Форма добавления задач сюда */ />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
