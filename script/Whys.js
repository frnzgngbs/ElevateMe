
document.addEventListener('DOMContentLoaded', function () {
    // Function to get CSRF token
    function getCSRFToken() {
        var csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
            return csrfToken.content;
        }
        console.error('CSRF Token not found in the meta tag.');
        return null;
    }

    // Function to display five whys
    function displayFiveWhys(data) {
        var whysContainer = document.querySelector(".generatedWhys-container");
        whysContainer.innerHTML = '';

        var csrfToken = getCSRFToken();
        if (data.fiveWhys) {
            var formElement = document.createElement('form');
            formElement.action = "/root-problem/";
            formElement.method = "post";
            formElement.id = "form";

            var csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            formElement.appendChild(csrfInput);

            data.fiveWhys.forEach(function (item) {
                let whysID = 0;

                var whyCardDiv = document.createElement('div');
                whyCardDiv.classList.add('whyCards');
                whyCardDiv.id = whysID;

                var checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.classList.add('checkbox');
                checkboxInput.name = 'checkbox_group';
                checkboxInput.value = item.statement;

                var cardTextDiv = document.createElement('div');
                cardTextDiv.classList.add('card-text');
                cardTextDiv.contentEditable = true;
                cardTextDiv.textContent = item.statement;

                cardTextDiv.addEventListener('input', function () {
                    checkboxInput.value = cardTextDiv.textContent;
                });

                whyCardDiv.appendChild(checkboxInput);
                whyCardDiv.appendChild(cardTextDiv);

                formElement.appendChild(whyCardDiv);
                whysID++;
            });

            var genHmwButtonContainer = document.createElement('div');
            genHmwButtonContainer.classList.add('genHmwButton-container');

            var nextButton = document.createElement('button');
            nextButton.type = 'submit';
            nextButton.classList.add('generateHMW-Button');
            nextButton.textContent = 'Next';

            genHmwButtonContainer.appendChild(nextButton);
            formElement.appendChild(genHmwButtonContainer);

            whysContainer.appendChild(formElement);

            console.log(data.fiveWhys)


        }
    }

    // Function to fetch and populate data
    function fetchAndPopulateData(value) {
        var csrfToken = getCSRFToken();

        $.ajax({
            url: `/generate-5-whys/${value}/`,
            type: 'post',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            dataType: 'json',
            success: function (data) {
                // Save the retrieved data to local storage
                console.log(data)
                displayFiveWhys(data);

                var formElement = document.getElementById('form');
                var formInputs = formElement.querySelectorAll('.checkbox');
                formInputs.forEach(function (input) {
                    let ctr = 0;
                    data[ctr++].statement = input.value;
                    console.log(data[ctr].statement);
                });

                sessionStorage.setItem('fiveWhysData', JSON.stringify(data));
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    var generateWhysButton = document.querySelector('.generateWhys-Button');
    generateWhysButton.addEventListener('click', function () {
        var contextValue = generateWhysButton.getAttribute('data-context');
        fetchAndPopulateData(contextValue);
    });


    var savedData = sessionStorage.getItem('fiveWhysData');
    if (savedData) {
        displayFiveWhys(JSON.parse(savedData));
    }

});