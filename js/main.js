"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Martin Sohlberg
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");


// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];

/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {
    errors = [];
    // Kontrollera formulärets obligatoriska fält
    if (fullnameInput.value.trim() === "") {
        errors.push("Du måste fylla i ditt namn.");
    }
    if (emailInput.value.trim() === ""){
        errors.push("Du måste fylla i din email-adress.");
    }
    if (phoneInput.value.trim() === "") {
        errors.push("Du måste fylla i ditt telefonnummer.");
    }
    // Visa eventuella felmeddelanden
    displayErrors();

    // Returnera resultatet (true eller false) av valideringen
    return errors.length === 0;
}


/**
 * Visar felmeddelanden på sidan.
 */
function displayErrors() {
    // Rensa tidigare felmeddelanden
    errorList.innerHTML = "";

    // Skriv ut aktuella felmeddelanden till DOM
    for (let i = 0; i < errors.length; i++) {
        const li = document.createElement("li");
        li.textContent = errors[i];
        errorList.appendChild(li);
    }
}


/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {
    // Hämta information från formuläret
    const name = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const font = fontSelect.value;

    // Uppdatera studentkortet
    previewFullname.textContent = name;
    previewEmail.textContent = email;
    previewPhone.textContent = phone;
    previewFullname.style.fontFamily = font;
    previewEmail.style.fontFamily = font;
    previewPhone.style.fontFamily = font;
    
    // Ville ha att enbart texten skulle ändra typsnitt och att titeln på studentkorten är kvar i
    // orginal typsnittet. Lagt koden som ändrar hela kortet som kommentar här nedanför:
    // document.querySelector("#preview .card").style.fontFamily = font;

    // Lägg till studentkortet i historiken
    history.unshift({ name: name, email: email, phone: phone, font: font });

    // Spara och uppdatera historiken
    saveHistory();
    renderHistory();
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory() {
    // Spara history i localStorage
    localStorage.setItem("history", JSON.stringify(history));
}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    // Hämta eventuell sparad historik
    const saved = localStorage.getItem("history");
    if (saved) {
        history = JSON.parse(saved);
    }

    // Uppdatera history
}


/**
 * Visar historiken på sidan.
 */
function renderHistory() {
    // Rensa tidigare visad historik
    historySection.innerHTML = "";

    // Skriv ut innehållet i history till DOM
    for (let i = 0; i < history.length; i++) {
       const item = document.createElement("div");
       item.style.fontFamily = history[i].font;
       item.style.borderBottom = "1px solid #ccc";
       item.style.paddingBottom = "10px";
       item.style.marginBottom = "10px";
       const name = document.createElement("p");
       name.textContent = history[i].name;
       const email = document.createElement("p");
       email.textContent = history[i].email;
       const phone = document.createElement("p");
       phone.textContent = history[i].phone;
       item.appendChild(name);
       item.appendChild(email);
       item.appendChild(phone);
       historySection.appendChild(item);
    }
}


/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {
    // Återställ formulär och studentkort
    form.reset();
    previewFullname.style.fontFamily = "";
    previewEmail.style.fontFamily = "";
    previewPhone.style.fontFamily = "";

    // Rensa eventuella felmeddelanden
    errors = [];
    displayErrors();
}


/**
 * Raderar hela historiken.
 */
function deleteHistory() {
    // Radera sparad historik
    localStorage.removeItem("history");
    // Uppdatera history och visningen på sidan
    history = [];
    renderHistory();
}


// Eventlyssnare

// När formuläret skickas:
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // - validera inmatningen
    if (validateForm()) {
        // - skapa studentkort om valideringen lyckas
        createStudentCard();
    }
});

// När användaren klickar på "Rensa"
clearButton.addEventListener("click", clearForm);

// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", deleteHistory);

// När sidan laddas:
window.addEventListener("load", function () {
    // - läs in och visa eventuell tidigare historik
    loadHistory();
    renderHistory();
});
