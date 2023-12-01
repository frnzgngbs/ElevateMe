from django.urls import path

from . import views

app_name = 'homepage'

urlpatterns = [
    path('filter/', views.VennDiagramFilter.as_view(), name="filter"),
    path('generate/', views.GeneratePS.as_view(), name="generatePS")
]