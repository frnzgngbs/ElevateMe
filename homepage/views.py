import json

from django.http import JsonResponse
from django.views import View
from django.shortcuts import render, redirect

# Generate problem statement

class VennDiagramFilter(View):
    template_name = "homepage.html"
    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        if request.method == "POST":
            field1 = request.POST.get("field1")
            field2 = request.POST.get("field2")
            field3 = request.POST.get("field3")

            context = {
                'field1': field1,
                'field2': field2,
                'field3': field3,
            }

            return render(request, self.template_name, context)

        return redirect("authenticate:home")

class GeneratePS(View):
    def get(self, request):
        return render(request, "homepage.html")

    def post(self, request):
        if request.method == "POST":
            field1 = request.POST.get("field1_text")
            field2 = request.POST.get("field2_text")
            field3 = request.POST.get("field3_text")

            print(field1)
            print(field2)
            print(field3)
            # Perform any additional processing with the data if needed

            # Pass the fields to the template
            return render(request, 'homepage.html', {'field1': field1, 'field2': field2, 'field3': field3})

        return redirect('authenticate:home')


    def generateAi(self, field1, field2, field):
        pass
