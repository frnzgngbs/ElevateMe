from django.urls import path
from .views import VennDiagramFilter, GeneratePS

app_name = 'homepage'

urlpatterns = [
    path('field/', VennDiagramFilter.as_view(), name="displayFields"),
    path('generate/', GeneratePS.as_view(), name="generatePS")
]
