
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

            let whysID = 0;

            var csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            formElement.appendChild(csrfInput);

            var checkboxes = []; // Array to store checkbox elements

            data.fiveWhys.forEach(function (item) {
                var whyCardDiv = document.createElement('div');
                whyCardDiv.classList.add('whyCards');
                whyCardDiv.id = whysID;

                var checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.classList.add('checkbox');
                checkboxInput.name = 'checkbox_group';
                checkboxInput.value = item.statement;

                checkboxes.push(checkboxInput); // Add checkbox to the array

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
            nextButton.textContent = 'Potential Root';

            genHmwButtonContainer.appendChild(nextButton);
            formElement.appendChild(genHmwButtonContainer);

            // Add form submit event listener
            formElement.addEventListener('submit', function (event) {
                // Check if at least one checkbox is checked
                if (!checkboxes.some(checkbox => checkbox.checked)) {
                    // If none is checked, prevent form submission
                    event.preventDefault();
                    alert('Please select at least one checkbox.');
                } else {
                    clearLocalStorage()
                }
            });

            whysContainer.appendChild(formElement);

            console.log(data.fiveWhys);
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

})

function clearLocalStorage() {
    sessionStorage.removeItem('fiveHMWsData');
}



