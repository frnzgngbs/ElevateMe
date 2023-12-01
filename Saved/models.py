from django.db import models

from django.contrib.auth.models import User
# Create your models here.
class ProblemStatement(models.Model):
    statement = models.TextField()
    class Meta:
        abstract = True


class TwoVenn(ProblemStatement):
    fk = models.ForeignKey(User, on_delete=models.CASCADE)

class ThreeVenn(ProblemStatement):
    fk = models.ForeignKey(User, on_delete=models.CASCADE)


