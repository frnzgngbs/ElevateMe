from django.urls import path
from . import views

app_name = 'authenticate'

urlpatterns = [
    path('register/', views.SignUpForm.as_view(), name='register'),
    path('login/', views.LoginForm.as_view(), name='login'),
    path('home/', views.home, name='home'),
    path('signout/', views.signOut, name='signout'),
]