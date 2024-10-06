import React, { useState } from 'react';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 1,
      name: 'To Do',
      tasks: [{ id: 1, content: 'Task 1' }, { id: 2, content: 'Task 2' }],
      newTaskContent: '', // Отдельное состояние для каждой колонки
    },
    {
      id: 2,
      name: 'In Progress',
      tasks: [],
      newTaskContent: '',
    },
    {
      id: 3,
      name: 'Done',
      tasks: [],
      newTaskContent: '',
    },
  ]);

  const [draggedTask, setDraggedTask] = useState(null);

  const handleTaskInputChange = (event, columnId) => {
    const value = event.target.value;

    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, newTaskContent: value };
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  const handleTaskSubmit = (event, columnId) => {
    event.preventDefault();

    const updatedColumns = columns.map((column) => {
      if (column.id === columnId && column.newTaskContent.trim()) {
        return {
          ...column,
          tasks: [...column.tasks, { id: Date.now(), content: column.newTaskContent }],
          newTaskContent: '', // Очищаем поле ввода после добавления задачи
        };
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  const handleDragStart = (event, task, columnId) => {
    setDraggedTask({ task, columnId });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, targetColumnId) => {
    event.preventDefault();

    if (!draggedTask) return;

    const sourceColumnId = draggedTask.columnId;
    const task = draggedTask.task;

    if (sourceColumnId === targetColumnId) return; // Не перетаскиваем задачу на ту же колонку

    const updatedColumns = columns.map((column) => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter((t) => t.id !== task.id),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setDraggedTask(null);
  };

  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, column.id)}
          >
            <div className="column-header">
              <span>{column.name}</span>
              <button className="edit-icon">✏️</button>
            </div>
            <div className="kanban-droppable">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="kanban-item"
                  draggable
                  onDragStart={(event) => handleDragStart(event, task, column.id)}
                >
                  {task.content}
                  <button className="edit-icon">✏️</button>
                </div>
              ))}
            </div>
            <div className="form-container">
              <form onSubmit={(event) => handleTaskSubmit(event, column.id)}>
                <input
                  type="text"
                  value={column.newTaskContent}
                  onChange={(event) => handleTaskInputChange(event, column.id)}
                  placeholder="Введите задачу"
                  className="task-input"
                />
                <button type="submit" className="create-task-btn">
                  Добавить задачу
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
