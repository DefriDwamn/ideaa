from django.urls import path
from .views import ProjectListView, TaskListView, ProjectDetailView, TaskDetailView, TaskListCreateView
from .views import AddMemberToProjectView

urlpatterns = [
    # Список проектов (получение всех проектов и создание нового проекта)
    path('', ProjectListView.as_view(), name='project-list'),

    # Получение списка задач с фильтрацией
    path('tasks/', TaskListView.as_view(), name='task-list'),

    # Получение проекта по ID
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # Список задач проекта + создание задачи для конкретного проекта
    path('<int:project_id>/tasks/', TaskListCreateView.as_view(), name='task-list-create'),

    # Детали задачи, обновление и удаление
    path('<int:project_id>/tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),

    # Добавление участника в проект
    path('<int:project_id>/add_member/<int:user_id>/', AddMemberToProjectView.as_view(), name='add-member-to-project'),
]
