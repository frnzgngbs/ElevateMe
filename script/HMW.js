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

        if (data.fiveHMWs) {
            var formElement = document.createElement('form');
            formElement.action = "/elevator-pitch/";
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

            let nextButton = document.createElement('button');
            nextButton.type = 'submit';
            nextButton.classList.add('generateHMW-Button');
            nextButton.textContent = 'Elevator Pitch';

            genHmwButtonContainer.appendChild(nextButton);
            formElement.appendChild(genHmwButtonContainer);

            hmwContainer.appendChild(formElement);


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
        alert("Button Clicked");
        fetchAndPopulateData(contextValue);
    });

    var savedData = sessionStorage.getItem('fiveHMWsData');
    if (savedData) {
        displayFiveHMWs(JSON.parse(savedData));
    }

});



document.addEventListener('DOMContentLoaded', function () {
    // ... (existing code)

    var generateHMWsButton = document.querySelector('.generateWhys-Button');
    generateHMWsButton.addEventListener('click', function () {
        var contextValue = generateHMWsButton.getAttribute('data-context');
        alert("Button Clicked");
        fetchAndPopulateData(contextValue);
    });

    var savedData = sessionStorage.getItem('fiveHMWsData');
    if (savedData) {
        displayFiveHMWs(JSON.parse(savedData));
    }

});

function showPopup() {
    var popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'block';
}

function hidePopup() {
    var popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = 'none';
}

document.addEventListener('click', function (event) {
    var popupContainer = document.getElementById('popupContainer');
    var generateHMWsButton = document.querySelector('.generateHMW-Button');

    if (!popupContainer.contains(event.target) && event.target !== generateHMWsButton) {
        popupContainer.style.display = 'none';
    }
});
