# views.py
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.shortcuts import render, redirect
from django.views import View

from authenticate.form import SignUpForm


class SignUpView(View):
    template_name = "register.html"

    def get(self, request):
        form = SignUpForm()
        return render(request, self.template_name, {"form": form})

    def post(self, request):
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('authenticate:login')

        return render(request, self.template_name, {"form": form})


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

                return redirect('authenticate:home')

        return redirect('authenticate:login')

@login_required(login_url="authenticate:login")
def home(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('authenticate:login')
        else:
            return render(request, 'Homepage.html')
    else:
        return redirect('authenticate:login')



def signOut(request):
    logout(request)
    return redirect('authenticate:login')