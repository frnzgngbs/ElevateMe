import openai
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views import View


def HMWPage(request):
    context = request.session.get('root_problem')
    return render(request, "hmw.html",
                  {
                      "context": context
                  })

class GeneratePotentialRootProblem(View):
    def get(self,request):
        pass

    def post(self, request):
        if request.method == "POST":
            listOfWhys = request.POST.getlist("checkbox_group")

            root_problem = openAiFiveHMW(listOfWhys)

            request.session['root_problem'] = root_problem
        return redirect("HMW:HMW")


def openAiFiveHMW(listOfWhys):
    openai.api_key = "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"
    reasons_combined = ", ".join(listOfWhys)
    message = (f"Before generating the potential root problem, summarize the whole"
               f"idea of the whys, and afterwards, generate a potential root problem based on the following WHY's: {reasons_combined}"
               f"The potential root problem generated should contain the affected people or groups and their impact."
               f"Summarized the whole point of the generated potential root problem and if it is too long. I suggest"
               f"to have it in 1-sentence format and give it directly, as it should not be in question form.")

    print(message)
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
        "role": "user",
        "content": message
    }])

    print(completion)

    if ":" in completion.choices[0].message.content:
        cut_parts = completion.choices[0].message.content.split(":")
        return cut_parts[1]
    else:
        return completion.choices[0].message.content
