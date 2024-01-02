import openai
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.views import View


# Create your views here.
def FiveWhys(request):
    root_problem = request.session.get('root_problem')
    fiveWhys = request.session.get('five-whys')

    print(fiveWhys)

    return render(request, "Whys.html",
                  {
                      "rankedPS": root_problem,
                      "fiveWhys": fiveWhys
                  })


class RootProblemStatement(View):
    def get(self, request):
        pass

    def post(self,request):
        if request.method == "POST":
            root_problem = request.POST.get('radiobutton_group')

            request.session['root_problem'] = root_problem

            return redirect('Whys:5-whys')


def GenerateFiveWhys(request, value):
    global data
    if request.method == "GET":
        try:
            generated_five_whys = openAiFiveWhy(value)

            data = [
                {
                    'statement': ps
                }
                for ps in generated_five_whys.values()
            ]

            request.session['fiveWhys'] = data

            return JsonResponse({
                "fiveWhys": data
            })
        except Exception as e:
            return redirect('homepage:errorPage')

    return HttpResponse("POST")



def openAiFiveWhy(value):
    openai.api_key = "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"

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
        "role": "user",
        "content": f"Now subject the {value} to a 5-Why analysis. "
                   f"Generate five whys  to uncover the underlying issue behind {value}."
                   f"No explanation needed just enumerate all"

    }])

    response_list = completion.choices[0].message.content.split('\n')

    questions_dict = {}

    for i, question in enumerate(response_list, start=1):
        # Split each question and take the second part (after the dot)
        question_without_number = question.split('. ', 1)[1].strip()
        questions_dict[i] = question_without_number

    return questions_dict
