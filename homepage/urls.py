from django.urls import path
from . import views

app_name = 'homepage'

urlpatterns = [
    path('home/', views.Homepage.as_view(), name="home"),
    path('filter/<str:venn_settings>/', views.VennDiagramFilter.as_view(), name="filter"),
    path('generate/', views.GeneratePS.as_view(), name="generatePS"),
    path('save/', views.savePage, name="save"),
]