from django.urls import path

from . import views

app_name = 'HMW'

urlpatterns = [
    path('HMW/', views.HMWPage, name="HMW"),
    path('root-problem/', views.GeneratePotentialRootProblem.as_view(), name="root-problem"),
]