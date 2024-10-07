from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from projects.models import Project
from .models import Idea, Like
from .serializers import IdeaSerializer, LikeSerializer
import random

class IdeaListView(generics.ListCreateAPIView):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        idea = serializer.save(author=self.request.user)
        project = Project.objects.create(idea=idea, name=f'Project for idea {idea.id}')
        project.members.add(self.request.user)
        
class IdeaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        idea = super().get_object()
        if idea.author != self.request.user:
            raise PermissionDenied("You do not have permission to edit or delete this idea.")
        return idea
    
    def perform_update(self, serializer):
        serializer.save(author=self.request.user)

class LikeCreateView(generics.CreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        idea_id = self.kwargs.get('pk')  
        try:
            idea = Idea.objects.get(pk=idea_id)
        except Idea.DoesNotExist:
            raise ValidationError({'detail': 'Idea does not exist.'})

        if Like.objects.filter(user=user, idea=idea).exists():
            raise ValidationError({'detail': 'You have already liked/disliked this idea.'})

        if idea.author == user:
            raise ValidationError({'detail': 'You cannot like your own idea.'})

        сomment = self.request.data.get('comment')
        if not сomment:
            raise ValidationError({'detail': 'Comment is required when liking an idea.'})

        serializer.save(user=user, idea=idea, comment=сomment, type='like')  # Здесь указываем тип "like"


class DislikeCreateView(generics.CreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        idea_id = self.kwargs.get('pk') 
        try:
            idea = Idea.objects.get(pk=idea_id)
        except Idea.DoesNotExist:
            raise ValidationError({'detail': 'Idea does not exist.'})

        if Like.objects.filter(user=user, idea=idea).exists():
            raise ValidationError({'detail': 'You have already liked/disliked this idea.'})

        if idea.author == user:
            raise ValidationError({'detail': 'You cannot dislike your own idea.'})

        serializer.save(user=user, idea=idea, type='dislike')  # Здесь указываем тип "dislike"
        
class FilteredIdeasView(generics.ListAPIView):
    serializer_class = IdeaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        ideas = Idea.objects.filter(is_hidden=False).exclude(author=user)

        liked_or_disliked_ideas = Like.objects.filter(user=user).values_list('idea_id', flat=True)

        ideas = ideas.exclude(id__in=liked_or_disliked_ideas)

        exclude_ids = self.request.query_params.get('exclude')
        if exclude_ids:
            exclude_ids = [int(id.strip()) for id in exclude_ids.split(',') if id.strip().isdigit()]
            ideas = ideas.exclude(id__in=exclude_ids)
        
        return ideas

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        count = queryset.count()

        limit = request.query_params.get('limit', 10)

        try:
            limit = int(limit)
        except ValueError:
            return Response({"error": "Invalid limit parameter. Must be an integer."}, status=400)

        if count > limit:
            random_ideas = random.sample(list(queryset), limit)
        else:
            random_ideas = queryset

        serializer = self.get_serializer(random_ideas, many=True)
        return Response(serializer.data)
    
class ApproveLikeView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, like_id):
        try:
            like = Like.objects.get(id=like_id)
        except Like.DoesNotExist:
            raise ValidationError({"detail": "Like not found."})

        idea = like.idea
        project = idea.project

        if idea.author != request.user:
            raise ValidationError({"detail": "You do not have permission to approve this like."})

        if project.idea.author == like.user:
            raise ValidationError({"detail": "Author cannot be added to their own project."})

        if project.members.filter(id=like.user.id).exists():
            raise ValidationError({"detail": "User is already a member of this project."})

        project.members.add(like.user)
        return Response({"detail": f"User {like.user.name} added to the project."})