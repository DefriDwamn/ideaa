from rest_framework import serializers
from .models import Project, Task

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'idea', 'name', 'members', 'created_at')

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user in instance.members.all():
            return super().update(instance, validated_data)
        raise serializers.ValidationError("You don't have permission to edit this project.")

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'description', 'assigned_to', 'status', 'deadline', 'created_at', 'project')
        read_only_fields = ('created_at', 'project')