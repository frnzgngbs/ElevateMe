from django.urls import path

from . import views

app_name = "Saving"

urlpatterns = [
    path('generate/save/', views.SaveProblemStatement.as_view(), name="saveModel")
]