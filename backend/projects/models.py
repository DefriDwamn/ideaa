from django.db import models
from users.models import User
from ideas.models import Idea
from django.utils import timezone

class Project(models.Model):
    idea = models.OneToOneField(Idea, on_delete=models.CASCADE, related_name='project')
    name = models.CharField(max_length=255, default='Unnamed Project')
    members = models.ManyToManyField(User, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)

    def add_member(self, user):
        self.members.add(user)


class Task(models.Model):
    STATUS_CHOICES = (
        ("todo", "ToDo"),
        ("in_progress", "In Progress"),
        ("done", "Done"),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    description = models.TextField()
    assigned_to = models.ManyToManyField(User, related_name='tasks')  # Можно назначать несколько пользователей
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="todo")
    deadline = models.DateTimeField(default=timezone.now)  # Поле для дедлайна
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description