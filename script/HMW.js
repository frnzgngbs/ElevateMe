document.addEventListener('DOMContentLoaded', function () {
    // Function to get CSRF token
    function getCSRFToken() {
        let csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
            return csrfToken.content;
        }
        console.error('CSRF Token not found in the meta tag.');
        return null;
    }

    function displayFiveHMWs(data) {
        var hmwContainer = document.querySelector(".generatedHMW-container");

        hmwContainer.innerHTML = '';

        var csrfToken = getCSRFToken();

        var checkboxes = [];


        if (data.fiveHMWs) {
            var formElement = document.createElement('form');
            formElement.action = "/generate-elevator-pitch/";
            formElement.method = "post";
            formElement.id = "form";

            var csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            formElement.appendChild(csrfInput);

            data.fiveHMWs.forEach(function (item) {
                let whysID = 0;

                var hmwCardDiv = document.createElement('div');
                hmwCardDiv.classList.add('hmwCards');
                hmwCardDiv.id = whysID;

                var checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.classList.add('checkbox');
                checkboxInput.name = 'checkbox_group';
                checkboxInput.value = item.statement;
                checkboxes.push(checkboxInput)

                var cardTextDiv = document.createElement('div');
                cardTextDiv.classList.add('card-text');
                cardTextDiv.contentEditable = true;
                cardTextDiv.textContent = item.statement;

                cardTextDiv.addEventListener('input', function () {
                    checkboxInput.value = cardTextDiv.textContent;
                });

                hmwCardDiv.appendChild(checkboxInput);
                hmwCardDiv.appendChild(cardTextDiv);

                formElement.appendChild(hmwCardDiv);
                whysID++;
            });

            let genHmwButtonContainer = document.createElement('div');
            genHmwButtonContainer.classList.add('genHmwButton-container');

            var generateElevatorbutton = document.createElement('button');
            generateElevatorbutton.type = 'submit';
            generateElevatorbutton.name = "checkbox_group"
            generateElevatorbutton.classList.add('generateElevatorPitch-button');
            generateElevatorbutton.textContent = 'Elevator Pitch';

            genHmwButtonContainer.appendChild(generateElevatorbutton);
            formElement.appendChild(genHmwButtonContainer);

            hmwContainer.appendChild(formElement);

            var showButton = document.createElement('button');
            showButton.classList.add('showElevator-button'); // Adjust the class name as needed
            showButton.textContent = 'Show Button';

            showButton.addEventListener('click', function () {
                showPopup()
            });

            let showButtonContainer = document.createElement('div');
            showButtonContainer.classList.add('genHmwButton-container'); // Corrected class name here
            showButtonContainer.appendChild(showButton)

            formElement.addEventListener('submit', function (event) {
                if (!checkboxes.some(checkbox => checkbox.checked)) {
                    event.preventDefault();
                    alert('Please select at least one checkbox.');
                }
            });

            hmwContainer.appendChild(showButtonContainer);
        }
    }



    function fetchAndPopulateData(value) {
        var csrfToken = getCSRFToken();

        $.ajax({
            url: `/generated-5-hmws/${value}/`,
            type: 'post',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                displayFiveHMWs(data);

                sessionStorage.setItem('fiveHMWsData', JSON.stringify(data));
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    var generateHMWsButton = document.querySelector('.generateWhys-Button');
    generateHMWsButton.addEventListener('click', function () {
        var contextValue = generateHMWsButton.getAttribute('data-context');
        fetchAndPopulateData(contextValue);
    });

    var savedData = sessionStorage.getItem('fiveHMWsData');
    if (savedData) {
        displayFiveHMWs(JSON.parse(savedData));
    }

    function showPopup() {
        var popupContainer = document.getElementById('popupContainer');
        popupContainer.style.display = 'block';
    }

    var close_button = document.getElementById('closeButton')
    close_button.addEventListener('click', function () {
        popupContainer.style.display = 'none';
    })


});
