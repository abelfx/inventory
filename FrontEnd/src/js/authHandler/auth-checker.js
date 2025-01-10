document.addEventListener("DOMContentLoaded", () => {
  const checker = localStorage.getItem("user");

  if (!checker) {
    window.location.href =
      "/Inventory_Managment_System_2024_25/FrontEnd/src/login.html";
  }
});
