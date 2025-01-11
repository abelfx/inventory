document.addEventListener("DOMContentLoaded", () => {
  // Get all the radio buttons and the image element
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const genderImage = document.getElementById("genderImage");

  // Add event listeners to the radio buttons
  genderRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const selectedValue = event.target.value;

      // Change the image source based on the selected value
      if (selectedValue === "male") {
        genderImage.src = "./images/male.jpg";
      } else if (selectedValue === "female") {
        genderImage.src = "./images/female.jpg";
      }
    });
  });
});
