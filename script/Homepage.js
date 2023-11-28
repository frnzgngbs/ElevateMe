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

<!-- Your HTML content -->


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
