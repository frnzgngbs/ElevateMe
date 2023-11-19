from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=200, null=False, unique=True)
    email = models.EmailField(max_length=100, null=False, unique=True)
    password = models.CharField(max_length=100, null=False)
