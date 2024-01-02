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

        sessionStorage.clear();
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

document.addEventListener('DOMContentLoaded', function () {
    function updateTotal(row) {
        var impact = getSelectedValue('impact', row);
        var capability = getSelectedValue('capability', row);
        var devcost = getSelectedValue('devcost', row);
        var needs = getSelectedValue('needs', row);
        var innovation = getSelectedValue('innovation', row);
        var marketsize = getSelectedValue('marketsize', row);

        var total = impact + capability + devcost + needs + innovation + marketsize;

        row.querySelector('.total p').textContent = total;

        return total; // Return the total for ranking
    }

    function getSelectedValue(dropdownId, row) {
        var dropdown = row.querySelector('#' + dropdownId);
        return parseInt(dropdown.options[dropdown.selectedIndex].value, 10);
    }

    function updateRank(row, total, allRows) {
        var rankCell = row.querySelector('.rank p');

        setTimeout(function () {
            var higherTotalCount = allRows.reduce(function (count, otherRow) {
                // Skip the current row
                if (otherRow !== row) {
                    var otherTotal = updateTotal(otherRow);
                    if (otherTotal > total) {
                        count++;
                    } else if (otherTotal === total && allRows.indexOf(otherRow) < allRows.indexOf(row)) {
                        count++;
                    }
                }
                return count;
            }, 0);

            rankCell.textContent = higherTotalCount + 1;
        }, 0); // Delay of 0 milliseconds
    }

    function updateSessionData() {
        var table = document.querySelector('.cardTable');
        var rows = Array.from(table.querySelectorAll('tr'));

        // Create an array to store table data
        var tableData = [];

        rows.forEach(function (currentRow, index) {
            var rowData = {};

            if (index >= 0) {
                rowData.total = updateTotal(currentRow);
                rowData.rank = parseInt(currentRow.querySelector('.rank p').textContent, 10);

                var dropdowns = Array.from(currentRow.querySelectorAll('select'));
                rowData.dropdownValues = dropdowns.map(function (dropdown) {
                    return {
                        id: dropdown.id,
                        value: getSelectedValue(dropdown.id, currentRow),
                    };
                });

                tableData.push(rowData);
            }

        });

        // Update session data
        sessionStorage.setItem('tableData', JSON.stringify(tableData));
    }

    // Function to restore table data from sessionStorage during page load
    function restoreTableData() {
        var tableDataString = sessionStorage.getItem('tableData');
        if (tableDataString) {
            var tableData = JSON.parse(tableDataString);

            console.log(tableData);
            var rows = document.querySelector('.cardTable').querySelectorAll('tr');

            tableData.forEach(function (data, index) {
                if (index < rows.length) {
                    var row = rows[index];

                    console.log("DATA: ", data);

                    data.dropdownValues.forEach(function (dropdownData) {
                        var dropdown = row.querySelector('#' + dropdownData.id);
                        if (dropdown) {
                            dropdown.value = dropdownData.value;
                        }
                    });

                    var totalCell = row.querySelector('.total p');
                    var rankCell = row.querySelector('.rank p');

                    if (totalCell && rankCell) {
                        console.log("TOTAL = ",data.total);
                        console.log("DATA = ", data.rank);
                        totalCell.textContent = data.total;
                        rankCell.textContent = data.rank;
                    }
                }
            });
            console.log("STOP");
        }
    }


    restoreTableData();

    // Function to be called when the dropdown changes
    function handleDropdownChange(event) {
        var dropdown = event.target;
        var row = dropdown.closest('tr');
        var total = updateTotal(row);

        var allRows = Array.from(document.querySelectorAll('.cardTable tr'));
        allRows.forEach(function (otherRow) {
            updateTotal(otherRow);
        });

        allRows.forEach(function (otherRow) {
            var otherTotal = updateTotal(otherRow);
            updateRank(otherRow, otherTotal, allRows);
        });

        updateSessionData();
    }

    // Attach the event listeners to all dropdowns
    var dropdowns = document.querySelectorAll('.cardTable select');
    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', handleDropdownChange);
    });


});


radioButton1.addEventListener('click', showVenn);
radioButton2.addEventListener('click', showVenn);

// Initial load
showVenn();
