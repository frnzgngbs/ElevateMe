# views.py
from django.contrib.auth import login, authenticate
from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.views import View
from authenticate.models import User

class Registration(View):
    template_name = "login.html"
    template_name2 = "register.html"

    def get(self, request):
        return render(request, self.template_name2)

    def post(self, request):
        try:
            if request.method == "POST":
                username = request.POST.get("username")
                email = request.POST.get("email")
                password = request.POST.get("password")

                user = User(username=username, password=password, email=email)

                user.save()

                print("SAVED!")

                reg_succesful = Login()

                return render(request, 'register.html',
                              {
                                  "state": True
                              })


        except IntegrityError as error:
            print("NOT SAVED!")
            redirect("https://www.youtube.com/")

class Login(View):
    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        if request.method == "POST":
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = User.objects.filter(username=username, password=password).first()

            if user:
                return render(request, 'index.html',
                              {
                                  "username": username,
                              })
        return redirect("authenticate:signin")

def home(request):
    return render(request, 'index.html')


def signin(request):
    return render(request, 'login.html')


def signupForm(request):
    return render(request, "register.html")