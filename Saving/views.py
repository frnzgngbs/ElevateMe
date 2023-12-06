from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.views import View

from Saving.models import TwoVennDiagram, TwoProblemStatement, ThreeProblemStatement, ThreeVennDiagram
# Basically this class will handle the storing of venn diagram scope, and problem statement.
class SaveProblemStatement(View):
    def get(self, request):
        pass

    # So if the user attempts to Saving, Saving the venn diagram and then the problem statement.
    def post(self, request):
        venn_diagram = request.session.get('venn_scopes')
        checked_checkboxes = request.POST.getlist('checkbox_group')

        auth = request.session.get('auth')
        user = User.objects.get(username=auth["username"])

        if request.method == "POST":
            field1 = venn_diagram['field1']
            field2 = venn_diagram['field2']
            field3 = venn_diagram['field3']

            setting = venn_diagram['settings']
            if setting == "2":
                # Set the value of field3 to null if its TwoVennDiagram setting.
                # Save it to our TwoVennDiagram as well as the Problem statement associated with it.
                two_venn = TwoVennDiagram(field1=field1, field2=field2, field3=field3, user_fk=user)
                two_venn.save()

                # Do something with the checked checkboxes
                for checkbox_value in checked_checkboxes:
                    problem_statement = TwoProblemStatement(statement=checkbox_value, user_fk=user, venn_fk=two_venn)
                    problem_statement.save()

            elif setting == "3":
                three_ven = ThreeVennDiagram(field1=field1, field2=field2, field3=field3, user_fk=user)
                three_ven.save()

                for checkbox_value in checked_checkboxes:
                    problem_statement = ThreeProblemStatement(statement=checkbox_value, user_fk=user, venn_fk=three_ven)
                    problem_statement.save()

            return redirect('homepage:home')
        return redirect('homepage:home')

# def Save(request):
#     return render(request, 'save.html')

class Save(View):
    def get(self, request):
        auth = request.session.get('auth')
        user = User.objects.get(username=auth["username"])

        twoPS = TwoProblemStatement.objects.filter(user_fk=user)
        threePS = ThreeProblemStatement.objects.filter(user_fk=user)

        context = {
            'twoPS_data': twoPS,
            'threePS_data': threePS
        }


        return render(request, 'save.html', context)

    def post(self, request):
        pass
