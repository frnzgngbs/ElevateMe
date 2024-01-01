const radioButton1 = document.getElementById('radio2')
const radioButton2 = document.getElementById('radio3')
const div1 = document.getElementById('venn2')
const div2 = document.getElementById('venn3')

function getCSRFToken() {
    var csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
        console.log('CSRF Token:', csrfToken.content);
        return csrfToken.content;
    }
    console.error('CSRF Token not found in the meta tag.');
    return null;
}

function updateFormElements(data, value) {
    var containerElement = value === "2" ? document.getElementById('vennDiagram2Container') : document.getElementById('vennDiagram3Container');

    // Clear existing content
    containerElement.innerHTML = '';

    if (data.data) {
        console.log('twoPS data exists:', data.data);
        if (value === "2") {
            data.data.forEach(function (item) {
                // Create new elements for each item
                var cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                cardDiv.id = item.id;

                var checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.classList.add('checkbox');
                checkboxInput.name = 'checkbox_group';

                var cardTextDiv = document.createElement('div');
                cardTextDiv.classList.add('card-text');
                cardTextDiv.contentEditable = true;
                cardTextDiv.textContent = item.statement;

                var addButton = document.createElement('button');
                addButton.classList.add('add-button');
                addButton.type = 'submit';
                addButton.name = 'button';
                addButton.value = item.id;
                addButton.textContent = 'Add';

                // Append elements to the container
                cardDiv.appendChild(checkboxInput);
                cardDiv.appendChild(cardTextDiv);
                cardDiv.appendChild(addButton);

                containerElement.appendChild(cardDiv);
            });
        }
        else if(value === "3") {
            data.data.forEach(function (item) {
                // Create new elements for each item
                var cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                cardDiv.id = item.id;

                var checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.classList.add('checkbox');
                checkboxInput.name = 'checkbox_group';

                var cardTextDiv = document.createElement('div');
                cardTextDiv.classList.add('card-text');
                cardTextDiv.contentEditable = true;
                cardTextDiv.textContent = item.statement;

                var addButton = document.createElement('button');
                addButton.classList.add('add-button');
                addButton.type = 'submit';
                addButton.name = 'button';
                addButton.value = item.id;
                addButton.textContent = 'Add';

                // Append elements to the container
                cardDiv.appendChild(checkboxInput);
                cardDiv.appendChild(cardTextDiv);
                cardDiv.appendChild(addButton);

                containerElement.appendChild(cardDiv);
            });
        }
    }
}

function fetchAndPopulateData(value) {
    var csrfToken = getCSRFToken();

    $.ajax({
        url: `/ranking/${value}/`,
        type: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);

            updateFormElements(data, value);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

function showVenn() {
    if (radioButton1.checked) {
        div1.style.display = 'block';
        div2.style.display = 'none';

        var value = radioButton1.value;
        fetchAndPopulateData(value);
    } else if (radioButton2.checked) {
        div1.style.display = 'none';
        div2.style.display = 'block';

        value = radioButton2.value;
        fetchAndPopulateData(value);
    } else {
        div1.style.display = 'none';
        div2.style.display = 'none';
    }
}

radioButton1.addEventListener('click', showVenn);
radioButton2.addEventListener('click', showVenn);

// Initial load
showVenn();
