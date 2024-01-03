import re

import openai
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views import View


def HMWPage(request):
    elevator = request.session.get('elevator_pitch')
    context = request.session.get('root_problem')
    return render(request, "hmw.html",
                  {
                      "context": context,
                      "elevator_pitch": elevator
                  })

class GeneratePotentialRootProblem(View):
    def get(self,request):
        pass

    def post(self, request):
        if request.method == "POST":
            listOfWhys = request.POST.getlist("checkbox_group")
            try:
                root_problem = openAiFiveWhys(listOfWhys)
            except Exception as e:
                return redirect('homepage:errorPage')
            request.session['root_problem'] = root_problem
        return redirect("HMW:HMW")


def openAiFiveWhys(listOfWhys):
    openai.api_key = "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"
    reasons_combined = ", ".join(listOfWhys)
    message = (f"Before generating the potential root problem, summarize the whole"
               f"point of the whys, and afterwards, generate a potential root problem based on the following WHY's: {reasons_combined}"
               f"The potential root problem generated should contain the affected people or groups and their impact."
               f"Summarized the generated potential root problem and don't make it too long I suggest"
               f"to have it in 1-sentence format, as it should not be in question form.")

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

class GenerateFiveHMW(View):
    def get(self, request):
        pass

    def post(self, request, value):
        if request.method == "POST":
            try:
                listOfHMWs = openAIFiveHMWs(value)
                elevator_pitch = request.session.get('elevator_pitch')
                if elevator_pitch:
                    del request.session['elevator_pitch']
                data = [
                    {
                        'statement': ps
                    }
                    for ps in listOfHMWs.values()
                ]
                return JsonResponse({"fiveHMWs": data})
            except Exception as e:
                print(e)


        return HttpResponse("ASDAD")

def openAIFiveHMWs(root_problem):
    openai.api_key = "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"

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
        "role": "user",
        "content": (f"Given the potential root problem which is {root_problem}, understand the idea of the given "
                    f"root potential problem, and generate 5-How Might We statement. Take note that you should only "
                    f"generate 5-HMWs and nothing else.")
    }])

    print(completion)

    response_list = completion.choices[0].message.content.split('\n')

    questions_dict = {}

    for i, question in enumerate(response_list, start=1):
        # Split each question and take the second part (after the dot)
        question_without_number = question.split('. ', 1)[1].strip()
        questions_dict[i] = question_without_number

    return questions_dict


class GenerateElevatorPitch(View):
    def get(self, request):
        pass


    def post(self, request):
        if request.method == "POST":
            HMW = request.POST.getlist('checkbox_group')
            root_problem = request.session.get('root_problem')
            elevator = openAIElevatorPitch(HMW, root_problem)

            print("\n\n")
            print(elevator)
            print("\n\n\n")
            capitalized_words_to_avoid = ['FOR', 'WHO', 'WE PROVIDE', 'THAT', 'UNLIKE', 'OUR SOLUTION', 'THAT']

            pattern = '|'.join(r'\b{}\b'.format(re.escape(word)) for word in capitalized_words_to_avoid)

            # Split the elevator string using the pattern
            result = re.split(pattern, elevator)

            # Filter out empty strings from the result
            result = [phrase.strip() for phrase in result if phrase.strip()]

            request.session['elevator_pitch'] = result

            print(len(result))

            for i in result:
                print(i)

        return redirect('HMW:HMW')



def openAIElevatorPitch(HMW, root_problem):
    openai.api_key = "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"
    hmw_combined = ", ".join(HMW)

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
        "role": "user",
        "content": f"Create an elevator pitch based on the given HMW Statement: {hmw_combined} and root potential problem {root_problem}. Use the Information "
                   "Technology Services Marketing Association template to craft your elevator pitch. The template "
                   "consists the; FOR [the target consumer], WHO [specific needs, requirements, demands, criteria], "
                   "WE PROVIDE [solution/description], THAT [gives specific benefits/value to clients], UNLIKE [the "
                   "competition], WHO [provide a solution, features, functions, benefits], OUR SOLUTION [better "
                   "approach, solution, functions, benefits, technology], THAT [offers a better customer experience]."
                   "In generating, Please follow on what are capitalized when given the data in generating."
    }])


    return completion.choices[0].message.content