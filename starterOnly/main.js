import { handleFormSubmit } from "./modules/modal.js";
import { toggleNavLinksResponsiveMenu } from "./modules/menu.js";

// Handles the display of navigation links in responsive mode (small screens)
document.querySelector(".icon").addEventListener("click", toggleNavLinksResponsiveMenu);

// Handles the form submission
document.forms["reserve"].addEventListener("submit", async function (event) {
  handleFormSubmit(event);
});
