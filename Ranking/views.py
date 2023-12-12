from django.shortcuts import render

# This method is only use for redirecting to that page
def ranking(request):
    return render(request, "Ranking.html")
