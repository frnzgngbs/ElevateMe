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

    containerElement.innerHTML = '';

    if (data.data) {
        console.log('twoPS data exists:', data.data);

        var csrfToken = getCSRFToken();

        var formElement = document.createElement('form');
        formElement.action = "/add-to-table/";
        formElement.method = "post";
        formElement.id = "form";

        var csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = csrfToken;
        formElement.appendChild(csrfInput);

        data.data.forEach(function (item) {
            // Create new elements for each item
            var cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.id = item.id;

            var checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.classList.add('checkbox');
            checkboxInput.name = 'checkbox_group';
            checkboxInput.value = item.statement;

            var cardTextDiv = document.createElement('div');
            cardTextDiv.classList.add('card-text');
            cardTextDiv.contentEditable = true;
            cardTextDiv.textContent = item.statement;

            cardDiv.appendChild(checkboxInput);
            cardDiv.appendChild(cardTextDiv);

            formElement.appendChild(cardDiv);
        });

        var submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit';
        submitButton.className = "add-button"
        formElement.appendChild(submitButton);

        containerElement.appendChild(formElement);
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

/*window.onload = function () {
    const thElements = document.querySelectorAll('.psRubrics th');
    const cardTable = document.querySelector('.cardTable');
    const tdElements = cardTable.querySelectorAll('td');

    const getColumnMaxWidths = () => {
        const columnMaxWidths = Array.from({ length: thElements.length }, () => 0);

        tdElements.forEach((td, index) => {
            const columnIndex = index % thElements.length;
            const tdWidth = td.clientWidth;
            const padding = parseInt(window.getComputedStyle(td).getPropertyValue('padding-left')) + parseInt(window.getComputedStyle(td).getPropertyValue('padding-right'));
            const border = parseInt(window.getComputedStyle(td).getPropertyValue('border-left-width')) + parseInt(window.getComputedStyle(td).getPropertyValue('border-right-width'));
            const totalWidth = tdWidth + padding + border;

            if (totalWidth > columnMaxWidths[columnIndex]) {
                columnMaxWidths[columnIndex] = totalWidth;
            }
        });

        return columnMaxWidths;
    };

    const columnWidths = getColumnMaxWidths();

    thElements.forEach((th, index) => {
        const padding = parseInt(window.getComputedStyle(th).getPropertyValue('padding-left')) + parseInt(window.getComputedStyle(th).getPropertyValue('padding-right'));
        th.style.width = `${columnWidths[index] - padding}px`;
    });

    tdElements.forEach((td, index) => {
        const columnIndex = index % thElements.length;
        const padding = parseInt(window.getComputedStyle(td).getPropertyValue('padding-left')) + parseInt(window.getComputedStyle(td).getPropertyValue('padding-right'));
        td.style.width = `${columnWidths[columnIndex] - padding}px`;
    });
};*/


