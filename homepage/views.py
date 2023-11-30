import openai

from django.views import View
from django.shortcuts import render, redirect


# Generate problem statement

class VennDiagramFilter(View):
    template_name = "homepage.html"

    def get(self, request):
        context = request.session.get('venn_scopes')
        return render(request, self.template_name, context)

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

            request.session['venn_scopes'] = context

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
            filter = request.POST.get("filter")

            print(field1)
            print(field2)
            print(field3)
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


def generateAi(field1, field2, field3, filter):
    openai.api_key = "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"

    if filter != "":
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
            "role": "user",
            "content": f"List five problem statements where these three scopes intersect. The three scopes are:"
                       f"{field1}, {field2}, {field3}, make sure not to include the numbering for "
                       f"the problem statement. I do not need an explanation; just give me the problem statement "
                       f"directly. Please make each problem statement unique."
        }])
    else:
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{
            "role": "user",
            "content": f"List five problem statements where these three scopes intersect. The three scopes are:"
                       f"{field1}, {field2}, {field3}, make sure not to include the numbering for "
                       f"the problem statement. I do not need an explanation; just give me the problem statement "
                       f"directly. Please make each problem statement unique. Apply filter: {filter}"
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
