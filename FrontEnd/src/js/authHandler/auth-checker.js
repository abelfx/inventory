// Simplified version without the __awaiter and __generator helpers
document.addEventListener("DOMContentLoaded", function () {
  // Don't run auth check on login page
  if (window.location.pathname.includes("login.html")) {
    return;
  }

  // Check auth status on page load
  async function checkAuthStatus() {
    try {
      // First check sessionStorage
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      const user = sessionStorage.getItem("user");

      if (!isAuthenticated || !user) {
        console.log("No session found, checking server auth...");
        const response = await fetch("http://127.0.0.1:3000/api/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Auth check response:", data); // Debug log

          if (data.isAuthenticated) {
            // Update session storage
            sessionStorage.setItem("isAuthenticated", "true");
            sessionStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role if needed
            const currentPath = window.location.pathname;
            if (
              data.user.role === "seller" &&
              !currentPath.includes("Dashboard.html")
            ) {
              window.location.href =
                "/Inventory_Managment_System_2024_25/FrontEnd/src/Dashboard.html";
            } else if (
              data.user.role === "buyer" &&
              !currentPath.includes("Buyerdashborad.html")
            ) {
              window.location.href =
                "/Inventory_Managment_System_2024_25/FrontEnd/src/Buyerdashborad.html";
            }
          } else {
            console.log("Not authenticated, redirecting to login...");
            sessionStorage.clear();
            window.location.href =
              "/Inventory_Managment_System_2024_25/FrontEnd/src/login.html";
          }
        } else {
          console.log("Auth check failed, redirecting to login...");
          sessionStorage.clear();
          window.location.href =
            "/Inventory_Managment_System_2024_25/FrontEnd/src/login.html";
        }
      } else {
        console.log("Session found, user is authenticated");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      sessionStorage.clear();
      window.location.href =
        "/Inventory_Managment_System_2024_25/FrontEnd/src/login.html";
    }
  }

  // Initialize
  checkAuthStatus();
});
