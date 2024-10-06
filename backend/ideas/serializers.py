from rest_framework import serializers
from .models import Idea, Like

class IdeaSerializer(serializers.ModelSerializer):
    liked_by = serializers.SerializerMethodField() 

    class Meta:
        model = Idea
        fields = ('id', 'author', 'text', 'image', 'created_at', 'liked_by','is_hidden')  
        read_only_fields = ('author', 'created_at', 'liked_by')
    
    def get_liked_by(self, obj):
        likes = obj.likes.all()
        return [
            {
                "id": like.user.id,
                "name": like.user.name,
                "email": like.user.email,
                "comment": like.comment,  
                "type": like.type,
            }
            for like in likes
        ]
        
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'user', 'idea', 'comment', 'type')
        read_only_fields = ('user', 'idea')

    def validate(self, data):
        if data['type'] == 'like' and not data.get('comment'):
            raise serializers.ValidationError({"comment": "Comment is required for likes."})

        return data