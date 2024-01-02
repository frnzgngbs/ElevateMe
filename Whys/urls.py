from django.urls import path
from . import views

app_name = "Whys"

urlpatterns = [
    path('5-whys/', views.FiveWhys, name="5-whys"),
    path('ranked-problems-statement/', views.RootProblemStatement.as_view(), name="ranked-problem-statement")
]