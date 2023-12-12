from django.urls import path

from . import views

app_name = 'Ranking'

urlpatterns = [
    path('ranking/', views.ranking, name="ranking")
]