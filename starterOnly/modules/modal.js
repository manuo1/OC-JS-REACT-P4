import { post, createFormPostRequest } from "./api.js";

// DOM Elements
const modalbg = document.querySelector(".bground");
const signupBtn = document.querySelectorAll(".btn-signup");
const closeBtn = document.querySelector(".close");
// DOM Elements : form
const form = document.forms["reserve"];
const firstName = document.getElementById("first");
const lastName = document.getElementById("last");
const email = document.getElementById("email");
const birthdate = document.getElementById("birthdate");
const quantity = document.getElementById("quantity");
const locationChoices = document.querySelectorAll('input[name="location"]');
const termsCheckbox = document.getElementById("checkbox1");
const confirmationMessage = document.querySelector(".confirmation-message");
const failureMessage = document.querySelector(".failure-message");
const headerLogo = document.querySelector(".header-logo");

// Email Regex
// Validate if the email matches the regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// /^[a-zA-Z0-9._%+-]+@    // part before @ can contain letters, numbers, . _ % + -
// +@[a-zA-Z0-9.-]+\.     // part between @ and . can contain letters, numbers, . -
// +\.[a-zA-Z]{2,}$/      // last part can contain letters and must have at least 2 characters
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// https://jsonplaceholder.typicode.com/
// Free fake and reliable API for testing and prototyping
const postFormUrl = "https://jsonplaceholder.typicode.com/posts";

// inputs const
const firstNameMinLength = 2;
const lastNameMinLength = 2;
const contestQuantityMinValue = 0;
const contestQuantityMaxValue = 99;

// Displays a modal element and hides the others.
// between form, confirmationMessage, failureMessage
function showModalElement(elementToShow) {
  const elements = [form, confirmationMessage, failureMessage];
  elements.forEach((element) => {
    if (element === elementToShow) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}

// ---------------------------------------- LAUNCH ----------------------------------------

// launch modal event
signupBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
  showModalElement(form);
  form.reset();
  headerLogo.classList.add("open-modal");
}

// ---------------------------------------- CLOSE ----------------------------------------

// Function to hide the modal
function closeModal() {
  modalbg.style.display = "none";
  form.reset();
  headerLogo.classList.remove("open-modal");
  hideAllErrors();
}
// Event listener to close the modal when the close button (X) is clicked
closeBtn.addEventListener("click", closeModal);

// Event listener to close the modal when clicking outside of the modal content
window.addEventListener("click", function (event) {
  if (event.target == modalbg) {
    closeModal();
  }
});

// ---------------------------------------- FORM INPUTS VALIDATORS ----------------------------------------

// First Name Validation
// -- First Name field has a minimum of 2 characters / is not empty.
// ignoring leading and trailing spaces.
function firstNameIsValid() {
  return firstName.value.trim().length >= firstNameMinLength;
}

// Last Name Validation
// -- Last name field has a minimum of 2 characters / is not empty.
// ignoring leading and trailing spaces.
function lastNameIsValid() {
  return lastName.value.trim().length >= lastNameMinLength;
}

// Email Validation
// -- Email address is valid.
// Check with regular expression
function emailIsValid() {
  return emailRegex.test(email.value);
}

// Birth date Validation
function birthdateIsValid() {
  return birthdate.value;
}

// Contests Quantity Validation
// -- For the number of contests, a numeric value is entered.
// Valid if it is a number & quantity between 0 and 99 (inclusive)
function contestQuantityIsValid() {
  if (quantity.value === "") return false;
  const numberValue = Number(quantity.value);
  return (
    Number.isInteger(numberValue) && numberValue >= contestQuantityMinValue && numberValue <= contestQuantityMaxValue
  );
}

// Location Validation
// -- A radio button is selected.
// Checks if at least one of the location radio buttons is selected
function locationIsSelected() {
  return Array.from(locationChoices).some((locationRadio) => locationRadio.checked);
}

// Terms and conditions Validation
// -- The terms and conditions box is checked, the other box is optional / can be left unchecked.
function termsCheckboxIsChecked() {
  return termsCheckbox.checked;
}

// Error messages
const firstNameErrorMessage = "Veuillez entrer 2 caractères ou plus pour le champ du prénom.";
const lastNameErrorMessage = "Veuillez entrer 2 caractères ou plus pour le champ du nom.";
const emailErrorMessage = "Veuillez entrer une adresse email valide.";
const birthdateErrorMessage = "Vous devez entrer votre date de naissance.";
const contestQuantityErrorMessage = "Vous devez entrer un chiffre entre 0 et 99 (inclus).";
const locationErrorMessage = "Vous devez choisir une option.";
const termsCheckboxErrorMessage = "Vous devez vérifier que vous acceptez les termes et conditions.";
const unknownError = "Erreur inconnue";

// Mapping form input elements to their corresponding validators and error messages
// [Form Input Element, [Validator, Error Message]]
const validationMap = new Map([
  [firstName, [firstNameIsValid, firstNameErrorMessage]],
  [lastName, [lastNameIsValid, lastNameErrorMessage]],
  [email, [emailIsValid, emailErrorMessage]],
  [birthdate, [birthdateIsValid, birthdateErrorMessage]],
  [quantity, [contestQuantityIsValid, contestQuantityErrorMessage]],
  [locationChoices, [locationIsSelected, locationErrorMessage]],
  [termsCheckbox, [termsCheckboxIsChecked, termsCheckboxErrorMessage]],
]);

// Return error message for the form input element
function getErrorMessage(formInputElement) {
  return validationMap.get(formInputElement)?.[1] || unknownError;
}

// Return validator function for the form input element
function getValidator(formInputElement) {
  // validator or default function that always returns false
  return validationMap.get(formInputElement)?.[0] || (() => false);
}

// ---------------------------------------- SHOW OR HIDE FORM VALIDATION ERRORS ----------------------------------------

// Display the error message on the appropriate form element
function showError(formInputElement) {
  const formElement = getErrorDisplayElement(formInputElement);
  formElement.setAttribute("data-error", getErrorMessage(formInputElement));
  formElement.setAttribute("data-error-visible", "true");
}

// Hide the error message on the appropriate form element
function hideError(formInputElement) {
  const formElement = getErrorDisplayElement(formInputElement);
  formElement.removeAttribute("data-error");
  formElement.setAttribute("data-error-visible", "false");
}

// Return the form element where the error message will be displayed
function getErrorDisplayElement(formInputElement) {
  // If the form input element is a radio button
  // return the first radio button's closest form element containing the input
  if (formInputElement === locationChoices) {
    return locationChoices[0].closest(".formData");
  }
  // For other input elements, return the closest form element containing the input
  return formInputElement.closest(".formData");
}

// Manage error display
function manageErrorDisplay(formInputElement) {
  // If the changed element is one of the radio buttons for "location",
  // apply error display to the entire group of radio buttons instead of individual ones.
  if (Array.from(locationChoices).includes(formInputElement)) {
    formInputElement = locationChoices;
  }
  // If the changed element exists in validationMap,
  // check if it's valid and either hide or show the error message accordingly.
  if (validationMap.has(formInputElement)) {
    getValidator(formInputElement)() ? hideError(formInputElement) : showError(formInputElement);
  }
}

// Manage error display on form input change
form.addEventListener("input", (event) => {
  manageErrorDisplay(event.target);
});

// Manage error display on form change (e.g., radio buttons or checkboxes)
form.addEventListener("change", (event) => {
  manageErrorDisplay(event.target);
});

// On form submission, manage error display for all form elements
form.addEventListener("submit", (_) => {
  validationMap.forEach((_, formInputElement) => {
    manageErrorDisplay(formInputElement);
  });
});

// Hide all errors
function hideAllErrors() {
  validationMap.forEach((_, formInputElement) => {
    hideError(formInputElement);
  });
}

// ---------------------------------------- FORM SUBMIT VALIDATION ----------------------------------------

// Check if all form element validators return true
function form_is_valid() {
  // Array of all validators of the validation map
  const validators = Array.from(validationMap.values()).map(([validator, _]) => validator);
  // Check if all validators are valid
  return validators.every((validator) => validator());
}

// Displays the confirmation modal message
function showModalConfirmationMessage() {
  showModalElement(confirmationMessage);
  document.getElementById("btn-close-success").addEventListener("click", closeModal);
}

// Displays the failure modal message
function showModalFailureMessage() {
  showModalElement(failureMessage);
  document.getElementById("btn-close-failure").addEventListener("click", closeModal);
}

// Handles the form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  // -- Form must be valid when the user clicks "Submit"
  if (form_is_valid()) {
    const postResult = await post(createFormPostRequest(postFormUrl, form));
    if (postResult.ok) {
      showModalConfirmationMessage();
    } else {
      showModalFailureMessage();
    }
  }
}

export { handleFormSubmit };
