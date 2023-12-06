from django.urls import path
from . import views

app_name = "Whys"

urlpatterns = [
    path('5-whys/', views.FiveWhys, name="5-whys")
]