document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('.buttons input[type="button"]');
    buttons.forEach((btn) => {
        if (btn.value === "Home") {
            btn.classList.add("button-clicked");
        }
    });

    function handleButtonClick() {
        buttons.forEach((btn) => {
            btn.addEventListener("click", function () {
                buttons.forEach((b) => {
                    if (b !== this) {
                        b.classList.remove("button-clicked");
                        b.classList.add("button1");
                    }
                });

                if (!this.classList.contains("button-clicked")) {
                    this.classList.remove("button1");
                    this.classList.add("button-clicked");
                } else {
                    this.classList.remove("button-clicked");
                    this.classList.add("button1");
                }
            });
        });
    }

    handleButtonClick();
});

const popupButton = document.getElementById("pop-up");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const closeButton = document.getElementById("closeButton");

popupButton.addEventListener("click", function () {
    overlay.style.display = "block";
    popup.style.display = "block";
});

closeButton.addEventListener("click", function () {
    overlay.style.display = "none";
    popup.style.display = "none";
});

/*const generateForm = document.getElementById('generate-form');
const saveButton = document.querySelector('.save');
const psLine = document.getElementById('ps-form'); // Assuming the ID is 'ps-form'

generateForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Your logic to handle form submission (AJAX request, data processing, etc.)

    // Show the Save button after form submission
    saveButton.style.display = 'block';
    generateForm.style.display = 'none'; // Optionally hide the form after submission
    psLine.style.display = 'none'; // Hide the text with ID 'ps-form'
});*/

function toggleDiagram(diagramId) {
  const diagrams = document.getElementsByClassName('venn-container');
  for (let i = 0; i < diagrams.length; i++) {
    diagrams[i].style.display = 'none';
  }
  document.getElementById(diagramId).style.display = 'block';

  const field3Input = document.getElementById('field3');
  const field3 = document.getElementById('field3_head')
  if (diagramId === 'venn-2') {
    field3Input.disabled = true;
    field3Input.value = '';
    field3Input.hidden = true;
    field3.hidden = true;
  } else {
    field3Input.disabled = false;
  }

  const selectDiv2 = document.querySelector('#venn2filter');
  const selectDiv3 = document.querySelector('#venn3filter');

  selectDiv2.addEventListener('click', () => {
      venn3filter.style.transform = ''
      venn2filter.style.backgroundColor = '#186f65';
      venn2filter.style.color = 'white';
      venn3filter.style.backgroundColor = 'white';
      venn3filter.style.borderColor = '#186f65'
      venn3filter.style.color = 'black';
  });

  selectDiv3.addEventListener('click', () =>{
      venn2filter.style.transform = ''
      venn3filter.style.backgroundColor = '#186f65';
      venn3filter.style.color = 'white';
      venn2filter.style.backgroundColor = 'white';
      venn2filter.style.borderColor = '#186f65'
      venn2filter.style.color = 'black';
    });

}

<!-- your_template.html -->
<!-- ... Your existing HTML code ... -->
document.addEventListener("DOMContentLoaded", function () {
    const generateForm = document.getElementById('generateForm');
    const vennRadioButtons = document.getElementsByName('venn_settings');

    function updateFormAction() {
        const selectedVennSetting = [...vennRadioButtons].find(radio => radio.checked);

        if (selectedVennSetting) {
            const url = '/filter/' + selectedVennSetting.value + '/';
            generateForm.action = url;
        }
    }

    // Attach the change event listener to update the form action
    vennRadioButtons.forEach(radio => radio.addEventListener('change', updateFormAction));
});
