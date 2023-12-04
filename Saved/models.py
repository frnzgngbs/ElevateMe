from django.db import models

from django.contrib.auth.models import User
# Create your models here.

class VennDiagram(models.Model):
    field1 = models.TextField()
    field2 = models.TextField()
    field3 = models.TextField()
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE)


class ProblemStatement(models.Model):
    statement = models.TextField()
    class Meta:
        abstract = True
class TwoProblemStatement(ProblemStatement):
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE)
    venn_fk = models.ForeignKey(VennDiagram, on_delete=models.CASCADE)

class ThreeProblemStatement(ProblemStatement):
    fk = models.ForeignKey(User, on_delete=models.CASCADE)
    venn_fk = models.ForeignKey(VennDiagram, on_delete=models.CASCADE)


