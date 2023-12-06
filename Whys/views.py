from django.shortcuts import render

# Create your views here.
def FiveWhys(request):
    return render(request, "Whys.html")