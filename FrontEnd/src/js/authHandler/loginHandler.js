// Simplified version without the __awaiter and __generator helpers
document.addEventListener("DOMContentLoaded", function () {
  // First get CSRF token when page loads
  let csrfToken = "";

  // Function to fetch CSRF token
  async function fetchCsrfToken() {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/csrf-token", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.csrfToken) {
        csrfToken = data.csrfToken;
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }

  // Check auth status on page load
  async function checkAuthStatus() {
    try {
      await fetchCsrfToken();

      const response = await fetch("http://127.0.0.1:3000/api/check-auth", {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          // Redirect based on role
          if (data.user.role === "seller") {
            window.location.href =
              "/Inventory_Managment_System_2024_25/FrontEnd/src/Dashboard.html";
          } else if (data.user.role === "buyer") {
            window.location.href =
              "/Inventory_Managment_System_2024_25/FrontEnd/src/Buyerdashborad.html";
          }
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  }

  // Handle form submission
  async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Make sure we have a fresh CSRF token
      await fetchCsrfToken();

      const response = await fetch("http://127.0.0.1:3000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 403) {
        // CSRF token invalid - refresh and try again
        window.location.reload();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Store user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("role", data.user.role);

        // Redirect based on role
        if (data.user.role === "seller") {
          window.location.href =
            "/Inventory_Managment_System_2024_25/FrontEnd/src/Dashboard.html";
        } else {
          window.location.href =
            "/Inventory_Managment_System_2024_25/FrontEnd/src/Buyerdashborad.html";
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  }

  // Initialize
  checkAuthStatus();

  // Attach form submit handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  } else {
    console.error("Login form not found");
  }
});
