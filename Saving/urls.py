from django.urls import path

from . import views

app_name = "Saving"

urlpatterns = [
    path('generate/save/', views.SaveProblemStatement.as_view(), name="saveModel"),
    path('save/', views.Save.as_view(), name="savePage"),
    path('save/<str:operation>/', views.SaveOperation.as_view(), name="saveOperation")
]