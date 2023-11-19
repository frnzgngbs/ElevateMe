from django.urls import path
from . import views

app_name = 'authenticate'

urlpatterns = [
    path('signup/', views.Registration.as_view(), name='register'),
    path('signUp/', views.Registration.as_view(), name='signup'),
    path('home/', views.Login.as_view(), name='home'),
    path('', views.signin, name="signin")
]

