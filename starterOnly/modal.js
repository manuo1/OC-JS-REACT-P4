function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close");
// DOM Elements : form
const form = document.forms["reserve"];
const firstName = document.getElementById("first");
const lastName = document.getElementById("last");
const email = document.getElementById("email");
const birthdate = document.getElementById("birthdate");
const quantity = document.getElementById("quantity");
const locations = document.getElementsByName("location");
const termsCheckbox = document.getElementById("checkbox1");

// ---------------------------------------- LAUNCH ----------------------------------------

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// ---------------------------------------- CLOSE ----------------------------------------

// close modal event
closeBtn.addEventListener("click", closeModal);

// close modal form with X
function closeModal() {
  modalbg.style.display = "none";
}

// close modal when clicking outside of the modal content
window.addEventListener("click", function (event) {
  if (event.target == modalbg) {
    closeModal();
  }
});

// ---------------------------------------- FORM VALIDATION ----------------------------------------

function validate() {
  let isValid = true;

  // First Name Validation
  // -- First Name field has a minimum of 2 characters / is not empty.
  if (firstName.value.trim().length < 2) {
    isValid = false;
  }

  // Last Name Validation
  // -- Last name field has a minimum of 2 characters / is not empty.
  if (lastName.value.trim().length < 2) {
    isValid = false;
  }

  // Email Validation
  // -- Email address is valid.
  // Validate if the email matches the regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  // /^[a-zA-Z0-9._%+-]+@    // part before @ can contain letters, numbers, . _ % + -
  // +@[a-zA-Z0-9.-]+\.     // part between @ and . can contain letters, numbers, . -
  // +\.[a-zA-Z]{2,}$/      // last part can contain letters and must have at least 2 characters

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    isValid = false;
  }

  // (Is this expected?)
  // Birth date Validation
  // if (!birthdate.value) {
  //   isValid = false;
  // }

  // Contests Validation
  // -- For the number of contests, a numeric value is entered.
  // Not valid if empty value or not a number or quantity not between 0 and 99 (inclusive)
  if (quantity.value === "" || isNaN(quantity.value) || !(quantity.value >= 0 && quantity.value <= 99)) {
    isValid = false;
  }

  // Location Validation
  // -- A radio button is selected.
  let locationSelected = false;
  for (let location of locations) {
    if (location.checked) {
      locationSelected = true;
      break;
    }
  }
  if (!locationSelected) {
    isValid = false;
  }

  // Terms and conditions Validation
  // -- The terms and conditions box is checked, the other box is optional / can be left unchecked.
  if (!termsCheckbox.checked) {
    isValid = false;
  }

  return isValid;
}

// Submit Validation
// -- Form must be valid when the user clicks "Submit"
// Can't submit if the form isn't valid
form.addEventListener("submit", function (event) {
  if (!validate()) {
    event.preventDefault(); // Prevents the default form submission if validation fails
  }
});
