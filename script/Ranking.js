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

document.addEventListener('DOMContentLoaded', function () {
    // Function to calculate and update the total for a row
    function updateTotal(row) {
        var impact = getSelectedValue('impact', row);
        var capability = getSelectedValue('capability', row);
        var devcost = getSelectedValue('devcost', row);
        var needs = getSelectedValue('needs', row);
        var innovation = getSelectedValue('innovation', row);
        var marketsize = getSelectedValue('marketsize', row);

        var total = impact + capability + devcost + needs + innovation + marketsize;

        // Update the total cell in the row
        row.querySelector('.total p').textContent = total;

        return total; // Return the total for ranking
    }

    // Function to get the selected value from a dropdown
    function getSelectedValue(dropdownId, row) {
        var dropdown = row.querySelector('#' + dropdownId);
        return parseInt(dropdown.options[dropdown.selectedIndex].value, 10);
    }

    // Function to update the rank for a specific row
    function updateRank(row, total, allRows) {
        var rankCell = row.querySelector('.rank p');

        // Count the number of rows with a higher total
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

        // Set the rank based on the count
        rankCell.textContent = higherTotalCount + 1;
    }

    // Function to update session data with the current table state
    function updateSessionData() {
        var table = document.querySelector('.cardTable');
        var rows = Array.from(table.querySelectorAll('tr'));

        // Create an array to store table data
        var tableData = [];

        // Iterate through each row to collect data
        rows.forEach(function (currentRow, index) {
            var rowData = {};

            // Skip the header row
            if (index > 0) {
                rowData.total = updateTotal(currentRow);
                rowData.rank = parseInt(currentRow.querySelector('.rank p').textContent, 10);

                // Collect selected values from the row's dropdowns
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

            // Iterate through each row to apply stored data
            var rows = document.querySelector('.cardTable').querySelectorAll('tr');

            tableData.forEach(function (data, index) {
                var row = rows[index]; // Remove the adjustment to skip header row

                // Log information for debugging
                console.log('Processing row:', row, 'Data:', data);

                if (row) {
                    // Set the selected values for each dropdown
                    data.dropdownValues.forEach(function (dropdownData) {
                        var dropdown = row.querySelector('#' + dropdownData.id);
                        if (dropdown) {
                            dropdown.value = dropdownData.value;
                        }
                    });

                    // Update total and rank
                    var totalCell = row.querySelector('.total p');
                    var rankCell = row.querySelector('.rank p');

                    if (totalCell && rankCell) {
                        totalCell.textContent = data.total;
                        rankCell.textContent = data.rank;
                    } else {
                        console.error('Total and Rank cells not found for row:', row);
                    }
                } else {
                    console.error('Row not found for index:', index);
                }
            });
        }
    }

    restoreTableData();

    // Function to be called when the dropdown changes
    function handleDropdownChange(event) {
        var dropdown = event.target;
        var row = dropdown.closest('tr');
        var total = updateTotal(row);

        // Rank rows after each dropdown change
        var allRows = Array.from(document.querySelectorAll('.cardTable tr'));
        allRows.forEach(function (otherRow) {
            updateTotal(otherRow);
        });

        allRows.forEach(function (otherRow) {
            var otherTotal = updateTotal(otherRow);
            updateRank(otherRow, otherTotal, allRows);
        });

        // Update session data when rank is updated
        updateSessionData();
    }

    // Attach the event listeners to all dropdowns
    var dropdowns = document.querySelectorAll('.cardTable select');
    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', handleDropdownChange);
    });

    // Check if session data exists and apply it to the table
    var tableDataString = sessionStorage.getItem('tableData');
    if (tableDataString) {
        var tableData = JSON.parse(tableDataString);

        // Iterate through each row to apply stored data
        tableData.forEach(function (data, index) {
            var row = document.querySelector('.cardTable').querySelectorAll('tr')[index + 1];

            // Update the total and rank
            row.querySelector('.total p').textContent = data.total;
            row.querySelector('.rank p').textContent = data.rank;

            // Update the dropdowns with stored values
            Object.keys(data).forEach(function (columnName) {
                if (columnName !== 'total' && columnName !== 'rank') {
                    var cell = row.querySelector('.' + columnName);
                    if (cell) {
                        if (cell.classList.contains('total') || cell.classList.contains('rank')) {
                            // Do nothing for total and rank cells
                        } else if (cell.classList.contains('chkbox')) {
                            // Update the radio button if it's a checkbox cell
                            cell.checked = data[columnName];
                        } else {
                            // Update the cell content for other cells
                            cell.textContent = data[columnName];
                        }
                    }
                }
            });
        });
    }
});


radioButton1.addEventListener('click', showVenn);
radioButton2.addEventListener('click', showVenn);

// Initial load
showVenn();

