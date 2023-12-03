import openai
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from django.views import View
from django.shortcuts import render, redirect


class VennDiagramFilter(View):
    template_name = "homepage.html"

    @method_decorator(login_required(login_url="authenticate:login"))
    def get(self, request):
        venn_diagram = request.session.get('venn_scopes')
        generate_response = request.session.get('openai')

        context = {
            "venn_scopes": venn_diagram,
            "generate_response": generate_response
        }

        return render(request, self.template_name, context)

    def post(self, request):
        if request.method == "POST":
            field1 = request.POST.get("field1")
            field2 = request.POST.get("field2")
            field3 = request.POST.get("field3")

            venn_scopes = {
                'field1': field1,
                'field2': field2,
                'field3': field3,
            }

            generate_response = request.session.get('openai')

            request.session['venn_scopes'] = venn_scopes

            context = {
                "venn_scopes": venn_scopes,
                "generate_response": generate_response
            }

            return render(request, self.template_name, context)

        return redirect("authenticate:home")

class GeneratePS(View):
    @method_decorator(login_required(login_url="authenticate:login"))
    def get(self, request):
        return render(request, "homepage.html")

    def post(self, request):
        if request.method == "POST":
            field1 = request.POST.get("field1_text")
            field2 = request.POST.get("field2_text")
            field3 = request.POST.get("field3_text")
            field4 = request.POST.get("filter")

            # Perform any additional processing with the data if needed

            generate_response = generateAi(field1, field2, field3, filter)
            venn_scopes = request.session.get('venn_scopes')

            request.session['openai'] = generate_response

            # Pass the fields to the template
            return render(request, 'homepage.html',
                          {
                              "generate_response": generate_response,
                              "venn_scopes": venn_scopes
                          })

        return redirect('authenticate:home')

class Homepage(View):
    template_name = "homepage.html"
    @method_decorator(login_required(login_url="authenticate:login"))
    def get(self, request):
        venn_diagram = request.session.get('venn_scopes')
        generate_response = request.session.get('openai')

        context = {
            "venn_scopes": venn_diagram,
            "generate_response": generate_response
        }
        return render(request, self.template_name, context)
    def post(self, request):
        pass

def generateAi(field1, field2, field3, field4):
    openai.api_key = "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"

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
        "role": "user",
        "content": f"List five problem statements where these three scopes intersect. The three scopes are:"
                   f"{field1}, {field2}, {field3}, make sure not to include the numbering for "
                   f"the problem statement. I do not need an explanation; just give me the problem statement "
                   f"directly. Please make each problem statement unique. Apply filter: {field4}"

    }])

    print(completion)

    response_list = completion.choices[0].message.content.split('\n')

    # Create a dictionary to store the questions
    questions_dict = {}


    for i, question in enumerate(response_list, start=1):
        # Split each question and take the second part (after the dot)
        question_without_number = question.split('. ', 1)[1].strip()
        questions_dict[i] = question_without_number

    return questions_dict


def savePage(request):
    return render(request, "save.html")