from django.db import models
from users.models import User

class Idea(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ideas')
    text = models.TextField()
    image = models.ImageField(upload_to='idea_images/', blank=True, null=True)
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    idea = models.ForeignKey('Idea', on_delete=models.CASCADE, related_name='likes')
    comment = models.TextField(default='',blank=True)
    type = models.CharField(max_length=10, choices=(("like", "Like"), ("dislike", "Dislike")))

    def __str__(self):
        return f"{self.user.email} - {self.type} - {self.idea.text[:20]}"