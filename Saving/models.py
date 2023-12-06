from django.db import models

from django.contrib.auth.models import User

class VennDiagram(models.Model):
    field1 = models.TextField()
    field2 = models.TextField()
    field3 = models.TextField(null=True, blank=True)
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class TwoVennDiagram(VennDiagram):
    pass
    def __str__(self):
        return f"{self.field1} | {self.field2}"

class ThreeVennDiagram(VennDiagram):
    def __str__(self):
        return f"{self.field1} | {self.field2} | {self.field3}"

class ProblemStatement(models.Model):
    statement = models.TextField()
    class Meta:
        abstract = True

class TwoProblemStatement(ProblemStatement):
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE)
    venn_fk = models.ForeignKey(TwoVennDiagram, on_delete=models.CASCADE)

    def __str__(self):
        return self.statement

class ThreeProblemStatement(ProblemStatement):
    user_fk = models.ForeignKey(User, on_delete=models.CASCADE)
    venn_fk = models.ForeignKey(ThreeVennDiagram, on_delete=models.CASCADE)
    def __str__(self):
        return self.statement

