// Function to get CSRF token
async function getCsrfToken() {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/csrf-token", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to get CSRF token: ${response.status}`);
    }
    const data = await response.json();
    if (!data.csrfToken) {
      throw new Error("No CSRF token in response");
    }
    return data.csrfToken;
  } catch (error) {
    console.error("Error getting CSRF token:", error);
    throw error;
  }
}
// Function to validate CSRF token
function validateCsrfToken(token) {
  if (!token || typeof token !== "string" || token.length < 10) {
    throw new Error("Invalid CSRF token");
  }
  return true;
}
document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("addItem");
  const addForm = document.getElementById("popupOverlay");
  const cancelForm = document.getElementById("cancelAddFrom");

  if (!addButton || !addForm || !cancelForm) {
    console.error("Required elements not found:", {
      addButton,
      addForm,
      cancelForm,
    });
    return;
  }

  addButton.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Opening add product form");
    addForm.style.display = "flex";
  });

  cancelForm.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Closing add product form");
    addForm.style.display = "none";
  });

  const form = document.querySelector("#addForm form");
  if (!form) {
    console.error("Add product form not found");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const productData = {
      name: document.querySelector("#name").value.trim(),
      description: document.querySelector("#description").value.trim(),
      catagory: document.querySelector("#catagory").value.trim(),
      price: parseFloat(document.querySelector("#price").value),
      quantityInStock: parseInt(
        document.querySelector("#quantityInStock").value,
        10
      ),
      supplierId: parseInt(document.querySelector("#supplierId").value, 10),
    };

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("http://127.0.0.1:3000/api/addProduct", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        form.reset();
        addForm.style.display = "none";
        location.reload();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });
});
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const csrfToken = await getCsrfToken();
    const response = await fetch("http://127.0.0.1:3000/api/getProducts", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch products");
    }
    const products = await response.json();
    const productTableBody = document.querySelector("#product-table-body");
    if (productTableBody) {
      let count = 1;
      productTableBody.innerHTML = products
        .map(
          (product) => ` 
<tr data-product-id="${product._id}"> 
<th scope="row">${count++}</th> 
<td>${product.name}</td> 
<td>${product.description}</td> 
<td>${product.quantityInStock}</td> 
<td>$${product.price}</td> 
<td> 
<button class="btn btn-sm btn-warning edit-btn" data-product-id="${
            product._id
          }"> 
<i class="fa-solid fa-pencil-alt"></i> Edit 
</button> 
<button class="btn btn-sm btn-danger delete-btn"> 
<i class="fa-solid fa-trash-alt"></i> Remove 
</button> 
</td> 
</tr> 
`
        )
        .join("");
      const exportBtn = document.getElementById("export-btn");
      exportBtn.addEventListener("click", function () {
        if (!products.length) {
          alert("No data available to export.");
          return;
        }
        const headers = [
          "Product ID",
          "Name",
          "Description",
          "Quantity",
          "Price",
        ];
        const rows = products.map((product) => [
          product.productId,
          product.name,
          product.description,
          product.quantityInStock.toString(),
          `$${product.price.toFixed(2)}`,
        ]);
        const csvContent = [headers, ...rows]
          .map((row) => row.map((value) => `"${value}"`).join(","))
          .join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
      const editButtons = document.querySelectorAll(".edit-btn");
      editButtons.forEach((button) => {
        button.addEventListener("click", async function (event) {
          const productId = event.target.getAttribute("data-product-id");
          if (!productId) return;
          try {
            const csrfToken = await getCsrfToken();
            const productResponse = await fetch(
              `http://127.0.0.1:3000/api/getProduct/${productId}`,
              {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRF-Token": csrfToken,
                },
              }
            );
            if (!productResponse.ok) {
              const err = await productResponse.json();
              throw new Error(err.message || "Failed to fetch product details");
            }
            const product = await productResponse.json();
            document.querySelector("#updateName").value = product.name;
            document.querySelector("#updateDescription").value =
              product.description;
            document.querySelector("#updateCategory").value = product.catagory;
            document.querySelector("#updatePrice").value = product.price;
            document.querySelector("#updateQuantityInStock").value =
              product.quantityInStock;
            document.querySelector("#updateSupplierId").value =
              product.supplierId;
            document.getElementById("UpdatepopupOverlay").style.display =
              "block";
          } catch (error) {
            console.error("Error fetching product details:", error);
            alert(error.message || "Failed to fetch product details");
          }
        });
      });
      const deleteButtons = document.querySelectorAll(".delete-btn");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async function (event) {
          const row = event.target.closest("tr");
          if (!row) {
            console.error("Row not found for delete button click.");
            return;
          }
          const productId = row.dataset.productId;
          if (!productId) {
            console.error("Product ID not found in row dataset.");
            return;
          }
          if (!confirm("Are you sure you want to delete this product?")) {
            return;
          }
          try {
            const csrfToken = await getCsrfToken();
            const deleteResponse = await fetch(
              `http://127.0.0.1:3000/api/deleteProduct/${productId}`,
              {
                method: "DELETE",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRF-Token": csrfToken,
                },
              }
            );
            if (!deleteResponse.ok) {
              const err = await deleteResponse.json();
              throw new Error(err.message || "Failed to delete product");
            }
            row.remove();
            alert("Product deleted successfully!");
          } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.message || "Failed to delete product");
          }
        });
      });
    }
  } catch (error) {
    console.error("An error occurred while fetching products:", error);
    alert(error.message || "Failed to fetch products");
  }
});
// Handle the update product form submission
const updateProductForm = document.getElementById("updateProductForm");
if (updateProductForm) {
  updateProductForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const productId = document
      .querySelector("[data-product-id]")
      .getAttribute("data-product-id");
    const productData = {
      name: document.querySelector("#updateName").value,
      description: document.querySelector("#updateDescription").value,
      catagory: document.querySelector("#updateCategory").value,
      price: parseFloat(document.querySelector("#updatePrice").value),
      quantityInStock: parseInt(
        document.querySelector("#updateQuantityInStock").value,
        10
      ),
      supplierId: parseInt(
        document.querySelector("#updateSupplierId").value,
        10
      ),
    };
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(
        `http://127.0.0.1:3000/api/updateProduct/${productId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(productData),
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update product");
      }
      const data = await response.json();
      alert("Product updated successfully!");
      location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message || "Failed to update product");
    }
  });
}
// Close the Update Popup on Cancel
document
  .getElementById("cancelUpdateForm")
  .addEventListener("click", function () {
    document.getElementById("UpdatepopupOverlay").style.display = "none";
  });
// Add product form submission
document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const csrfToken = await getCsrfToken();
      const formData = new FormData(e.target);
      const productData = Object.fromEntries(formData.entries());
      const response = await fetch("http://127.0.0.1:3000/api/addProduct", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to add product");
      }
      alert("Product added successfully!");
      e.target.reset();
      loadProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });
// Load products
async function loadProducts() {
  try {
    const csrfToken = await getCsrfToken();
    const response = await fetch("http://127.0.0.1:3000/api/getProducts", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to load products");
    }
    const products = await response.json();
  } catch (error) {
    console.error("Error loading products:", error);
    alert(error.message || "Failed to load products");
  }
}
// Update product
async function updateProduct(id, productData) {
  try {
    const csrfToken = await getCsrfToken();
    const response = await fetch(
      `http://127.0.0.1:3000/api/updateProduct/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(productData),
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update product");
    }
    alert("Product updated successfully!");
    loadProducts();
  } catch (error) {
    console.error("Error updating product:", error);
    alert(error.message || "Failed to update product");
  }
}
// Delete product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }
  try {
    const csrfToken = await getCsrfToken();
    const response = await fetch(
      `http://127.0.0.1:3000/api/deleteProduct/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to delete product");
    }
    alert("Product deleted successfully!");
    loadProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
    alert(error.message || "Failed to delete product");
  }
}
// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
