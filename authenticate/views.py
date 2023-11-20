# views.py
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.views import View

class SignUpForm(View):
    template_name = "register.html"

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        if request.method == "POST":

            username = request.POST.get("username")
            password = request.POST.get("password")
            confirm_pass = request.POST.get("confirmpword")
            email = request.POST.get("email")

            if password != confirm_pass:
                return render(request, self.template_name,
                              {
                                  "message": "Password doesn't match",
                                  "State": True
                              })

            user = User.objects.create_user(username, email, password)
            user.save()

            print(f"Username: {username}\n"
                  f"Email: {email}\n"
                  f"Password: {password}")

            return redirect('authenticate:login')


class LoginForm(View):
    template_name = "login.html"
    template_name2 = "home.html"
    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        if request.method == "POST":
            uname = request.POST.get("username")
            passw = request.POST.get("password")

            print(f"Username: {uname}\n"
                  f"Password: {passw}")

            user = authenticate(request, username=uname, password=passw)

            if user is not None:
                login(request, user)

                return render(request, self.template_name2,
                              {
                                  "user": user
                              })

        return redirect('authenticate:login')


@login_required(login_url="authenticate:login")
def home(request):
    return render(request, 'home.html')


def signOut(request):
    logout(request)
    return redirect('authenticate:login')