import openai
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.views import View


# Create your views here.
def FiveWhys(request):
    root_problem = request.session.get('ranked_problem')


    return render(request, "Whys.html",
                  {
                      "rankedPS": root_problem,
                  })


class RootProblemStatement(View):
    def get(self, request):
        pass

    def post(self,request):
        if request.method == "POST":
            root_problem = request.POST.get('radiobutton_group')

            request.session['ranked_problem'] = root_problem

            return redirect('Whys:5-whys')


def GenerateFiveWhys(request, value):
    global data
    if request.method == "POST":


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


    return HttpResponse("POST")



def openAiFiveWhy(value):
    openai.api_key = "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"

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
        "role": "user",
        "content": f"Now subject the {value} to a 5-Why analysis. "
                   f"Generate five whys  to uncover the underlying issue behind {value}."
                   f"Please dont include any explanation just generate all the whys statement. "

    }])

    print(completion)

    response_list = completion.choices[0].message.content.split('\n')

    questions_dict = {}

    for i, question in enumerate(response_list, start=1):
        # Split each question and take the second part (after the dot)
        question_without_number = question.split('. ', 1)[1].strip()
        questions_dict[i] = question_without_number

    return questions_dict
