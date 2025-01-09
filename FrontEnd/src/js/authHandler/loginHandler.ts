const loginForm = document.querySelector<HTMLFormElement>("form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(loginForm);
    const emailOrUsername = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    // Validate inputs
    if (!emailOrUsername || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Send POST request to the backend login endpoint
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailOrUsername,
          password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();

        // Use the cookie and user role to determine where to redirect
        const userRole = result.role;
        console.log(userRole);
        if (userRole === "seller") {
          window.location.href =
            "/Inventory_Managment_System_2024_25/FrontEnd/src/Dashboard.html";
        } else if (userRole === "buyer") {
          window.location.href =
            "/Inventory_Managment_System_2024_25/FrontEnd/src/Dashboard.html";
        } else {
          alert("Invalid user role received.");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please check your connection and try again.");
    }
  });
}

// Utility function to check if the user is already logged in
const checkAuth = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth-check", {
      method: "GET",
      credentials: "include", // Send cookies with the request
    });

    if (response.ok) {
      const user = await response.json();
      const userRole = user.role;

      // Redirect based on the role if already logged in
      if (userRole === "seller") {
        window.location.href = "/seller-dashboard.html";
      } else if (userRole === "buyer") {
        window.location.href = "/buyer-dashboard.html";
      }
    }
  } catch (error) {
    console.warn("User is not authenticated:", error);
    // Stay on the login page
  }
};

// Check authentication when the page loads
checkAuth();
