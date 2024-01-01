
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from Saving.models import TwoProblemStatement, ThreeProblemStatement


# This method is only use for redirecting to that page
def ranking(request):
    return render(request, "Ranking.html")

class ShowLists(View):
    @method_decorator(login_required(login_url="authenticate:login"))
    def get(self, request, setting):
        pass

    def post(self, request, setting):
        global data
        if request.method == "POST":
            if setting == 2:
                auth = request.session.get('auth')
                user = User.objects.get(username=auth["username"])

                twoPS = TwoProblemStatement.objects.filter(user_fk=user)

                data = [
                    {
                        'id': ps.id,
                        'statement': ps.statement,
                        'user_fk': ps.user_fk.id,
                        'venn_fk': ps.venn_fk.id if ps.venn_fk else None,
                    }
                    for ps in twoPS
                ]
                data = {'data': data}
                return JsonResponse(data)
            elif setting == 3:
                auth = request.session.get('auth')
                user = User.objects.get(username=auth["username"])

                threePS = ThreeProblemStatement.objects.filter(user_fk=user)
                data = [
                    {
                        'id': ps.id,
                        'statement': ps.statement,
                        'user_fk': ps.user_fk.id,
                        'venn_fk': ps.venn_fk.id if ps.venn_fk else None,
                    }
                    for ps in threePS
                ]

                data = {'data': data}
                return JsonResponse(data)

        return HttpResponse("FAILED")