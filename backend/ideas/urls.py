from django.urls import path
from .views import IdeaListView, IdeaDetailView, ApproveLikeView, LikeCreateView, DislikeCreateView, FilteredIdeasView

urlpatterns = [
    path('', IdeaListView.as_view(), name='idea-list'),
    path('<int:pk>/', IdeaDetailView.as_view(), name='idea-detail'),
    path('<int:pk>/like/', LikeCreateView.as_view(), name='like-create'),  
    path('<int:pk>/dislike/', DislikeCreateView.as_view(), name='dislike-create'),
    path('filtered/', FilteredIdeasView.as_view(), name='filtered-ideas'),
    path('<int:like_id>/approve_like/', ApproveLikeView.as_view(), name='approve-like'),
]
