from django.shortcuts import render, redirect
from django.views import View


# Create your views here.
def FiveWhys(request):
    root_problem = request.session.get('root_problem')


    return render(request, "Whys.html",
                  {
                      "context": root_problem
                  })


class RootProblemStatement(View):
    def get(self, request):
        pass

    def post(self,request):
        if request.method == "POST":
            root_problem = request.POST.get('radiobutton_group')

            request.session['root_problem'] = root_problem

            return redirect('Whys:5-whys')