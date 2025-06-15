// loginHandler.js
document.addEventListener("DOMContentLoaded", () => {
  let csrfToken = "";

  // Fetch a fresh CSRF token
  async function fetchCsrfToken() {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/csrf-token", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch CSRF token");
      const { csrfToken: token } = await res.json();
      csrfToken = token;
    } catch (err) {
      console.error("Error fetching CSRF token:", err);
    }
  }

  // Check auth on page load (only if storage is empty)
  async function checkAuthStatus() {
    if (sessionStorage.getItem("isAuthenticated") === "true") {
      // already logged in
      return;
    }
    await fetchCsrfToken();
    try {
      const res = await fetch("http://127.0.0.1:3000/api/check-auth", {
        credentials: "include",
        headers: { "X-CSRF-Token": csrfToken },
      });
      if (!res.ok) return; // remain on login page
      const data = await res.json();
      if (data.isAuthenticated) {
        // prime storage so you don't bounce
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("role", data.user.role);
        // direct to dashboard:
        const dest =
          data.user.role === "seller"
            ? "Dashboard.html"
            : "Buyerdashborad.html";
        window.location.href = `/Inventory_Managment_System_2024_25/FrontEnd/src/${dest}`;
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  }

  // Your form submit handler
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await fetchCsrfToken(); // ensure we have it

    try {
      const res = await fetch("http://127.0.0.1:3000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        if (res.status === 403) return window.location.reload();
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      // **NEW**: mark authenticated
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("role", data.user.role);

      // redirect by role
      const dest =
        data.user.role === "seller" ? "Dashboard.html" : "Buyerdashborad.html";
      window.location.href = `/Inventory_Managment_System_2024_25/FrontEnd/src/${dest}`;
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    }
  }

  // wire it up
  checkAuthStatus();
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  else console.error("loginForm not found");
});
