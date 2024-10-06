import React, { useState } from 'react';
import './IdeasFeed.css';

const IdeasFeed = () => {
  const ideas = [
    {
      id: 1,
      title: 'Идея 1',
      description: 'Описание идеи 1',
      images: ['/images/project-examples/1.jpeg'],
    },
    {
      id: 2,
      title: 'Идея 2',
      description: 'Описание идеи 2',
      images: ['/images/project-examples/2.jpg'],
    },
  ];

  const [selectedIdea, setSelectedIdea] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ideaDescription, setIdeaDescription] = useState('');
  const [files, setFiles] = useState([]);

  // Открыть модальное окно при нажатии на лайк
  const handleLike = (idea) => {
    setSelectedIdea(idea);
    setShowModal(true);
  };

  // Закрыть модальное окно
  const closeModal = () => {
    setShowModal(false);
    setSelectedIdea(null);
    setMessage('');
  };

  // Отправить сообщение автору идеи
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    console.log(`Сообщение для автора идеи "${selectedIdea.title}": ${message}`);
    closeModal(); // Закрываем окно после отправки
  };

  // Обработка создания новой идеи
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmitIdea = (event) => {
    event.preventDefault();
    if (!ideaDescription) {
      alert("Описание идеи обязательно");
      return;
    }
    console.log('Идея отправлена:', { ideaDescription, files });
    // Очищаем форму после отправки
    setIdeaDescription('');
    setFiles([]);
  };

  return (
    <div className="ideas-container">
      <div className="ideas-feed">
        {ideas.map((idea) => (
          <div key={idea.id} className="ideas-post-item">
            <h2>{idea.title}</h2>
            <div className="images">
              {idea.images.map((imgSrc, idx) => (
                <img key={idx} src={imgSrc} alt={`Референс ${idx + 1}`} />
              ))}
            </div>
            <p className="post-description">{idea.description}</p>
            <div className="actions">
              <button className="like" aria-label="Лайк" onClick={() => handleLike(idea)}></button>
              <button className="dislike" aria-label="Дизлайк"></button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для сообщения автору */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Отправьте сообщение автору</h2>
            <form onSubmit={handleSubmitMessage}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите сообщение автору"
                rows="5"
                required
              ></textarea>
              <button type="submit" className="form-button">Отправить</button>
              <button type="button" className="form-button cancel-button" onClick={closeModal}>
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Окно создания новой идеи */}
      <div className="idea-creation-container">
        <h2>Создать идею</h2>
        <form onSubmit={handleSubmitIdea} className="idea-creation-form">
          <textarea
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            placeholder="Опишите вашу идею"
            rows="5"
            required
          ></textarea>
          <label className="drag-drop-label">
            Перетащите фото сюда или нажмите для загрузки
            <input type="file" accept="image/*" multiple={false} onChange={handleFileChange} />
          </label>
          {files.length > 0 && (
            <div className="file-preview">
              <img src={URL.createObjectURL(files[0])} alt="Preview" />
              <button type="button" onClick={() => setFiles([])}>Удалить</button>
            </div>
          )}
          <button type="submit" className="create-idea-btn">
            Создать идею
          </button>
        </form>
      </div>
    </div>
  );
};

export default IdeasFeed;
