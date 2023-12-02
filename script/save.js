let cardCounter = 1; // Initialize a counter for unique card IDs

function addCard(containerId) {
    const container = document.getElementById(`${containerId}Container`);
    const cardText = "Your Text Here"; // You can customize the default text
    createCard(`card${cardCounter}`, cardText, container);
    cardCounter++;
}

function deleteCard(cardId) {
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
        cardElement.remove();
    }
}

function createCard(id, text, container) {
    // Create card elements
    const card = document.createElement("div");
    card.className = "card";
    card.id = id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";

    const cardText = document.createElement("div");
    cardText.className = "card-text";
    cardText.contentEditable = true;
    cardText.textContent = text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteCard(id);
    };

    // Append elements to the card
    card.appendChild(checkbox);
    card.appendChild(cardText);
    card.appendChild(deleteButton);

    // Append the card to the specified container
    container.appendChild(card);
}
