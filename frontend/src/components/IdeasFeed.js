import React, { useState, useEffect, useCallback } from 'react';
import './IdeasFeed.css';
import API from '../api/axios';

const IdeasFeed = () => {
  const [ideas, setIdeas] = useState([]);
  const [ideaDescription, setIdeaDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [excludeIds, setExcludeIds] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);
  const [likeComment, setLikeComment] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await API.get('/ideas/filtered', {
        params: {
          limit,
          exclude: excludeIds.join(','),
        },
      });

      if (response.data.length < limit) {
        setHasMore(false);
      }

      // Обновляем список идей без дублирования
      const uniqueIdeas = response.data.filter(
        (newIdea) => !ideas.some((idea) => idea.id === newIdea.id)
      );
      setIdeas((prevIdeas) => [...prevIdeas, ...uniqueIdeas]);
    } catch (error) {
      console.error('Ошибка загрузки идей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (ideaId) => {
    setCurrentIdeaId(ideaId);
    setShowCommentModal(true);
  };

  const handleSubmitLike = async () => {
    if (!likeComment.trim()) {
      alert('Комментарий обязателен при лайке.');
      return;
    }

    try {
      await API.post(`/ideas/${currentIdeaId}/like/`, { comment: likeComment });
      setIdeas((prev) => prev.filter((idea) => idea.id !== currentIdeaId));
      setExcludeIds((prev) => [...prev, currentIdeaId]);
      setLikeComment('');
      setShowCommentModal(false);
      fetchIdeas();
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const handleDislike = async (ideaId) => {
    try {
      await API.post(`/ideas/${ideaId}/dislike/`);
      setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
      setExcludeIds((prev) => [...prev, ideaId]);
      fetchIdeas();
    } catch (error) {
      console.error('Ошибка при дизлайке:', error);
    }
  };

  const handleSubmitIdea = async (event) => {
    event.preventDefault();
    if (!ideaDescription) {
      alert('Описание идеи обязательно');
      return;
    }

    const formData = {
      text: ideaDescription,
      image: files[0] || null,
    };

    try {
      await API.post('/ideas/', formData);
      alert('Идея создана!');
      setIdeaDescription('');
      setFiles([]);
      setIdeas([]);
      setExcludeIds([]);
      setHasMore(true);
      fetchIdeas();
    } catch (error) {
      console.error('Ошибка при создании идеи:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles([selectedFile]);
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      fetchIdeas();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="ideas-container">
      <div className="ideas-feed">
        {ideas.map((idea) => (
          <div key={idea.id} className="ideas-post-item">
            <h2>{idea.title}</h2>
            <div className="images">
              {idea.image && <img src={idea.image} alt={`Идея ${idea.id}`} />}
            </div>
            <p className="post-description">{idea.text}</p>
            <div className="actions">
              <button className="like" aria-label="Лайк" onClick={() => handleLike(idea.id)}></button>
              <button className="dislike" aria-label="Дизлайк" onClick={() => handleDislike(idea.id)}></button>
            </div>
          </div>
        ))}
        {loading && <p>Загрузка...</p>}
        {!hasMore && <p>Все идеи загружены.</p>}
      </div>

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
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {files.length > 0 && (
            <div className="file-preview">
              <div className="file-preview-item">
                <img src={URL.createObjectURL(files[0])} alt="Preview" />
                <button className="file-preview-remove-btn" onClick={handleRemoveFile}>
                  ✕
                </button>
              </div>
            </div>
          )}
          <button type="submit" className="create-idea-btn">
            Создать идею
          </button>
        </form>
      </div>

      {showCommentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Напишите комментарий к лайку</h2>
            <textarea
              value={likeComment}
              onChange={(e) => setLikeComment(e.target.value)}
              placeholder="Комментарий"
              rows="5"
              required
            ></textarea>
            <button onClick={handleSubmitLike} className="form-button">Отправить</button>
            <button onClick={() => setShowCommentModal(false)} className="cancel-button">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeasFeed;
