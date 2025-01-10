import "bootstrap";
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addItem") as HTMLButtonElement;
  const addForm = document.getElementById("popupOverlay") as HTMLElement;
  const cancelForm = document.getElementById(
    "cancelAddFrom"
  ) as HTMLButtonElement;

  addButton.addEventListener("click", (event: Event) => {
    event.preventDefault();
    console.log("this works");
    addForm.style.display = "flex";
  });

  cancelForm.addEventListener("click", (event: Event) => {
    event.preventDefault();
    console.log("this also works");
    addForm.style.display = "none";
  });

  const form = document.querySelector("#addForm form") as HTMLFormElement;

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const productData = {
      name: (document.querySelector("#name") as HTMLInputElement).value.trim(),
      description: (
        document.querySelector("#description") as HTMLInputElement
      ).value.trim(),
      catagory: (
        document.querySelector("#catagory") as HTMLInputElement
      ).value.trim(),
      price: parseFloat(
        (document.querySelector("#price") as HTMLInputElement).value
      ),
      quantityInStock: parseInt(
        (document.querySelector("#quantityInStock") as HTMLInputElement).value,
        10
      ),
      imageURL: (
        document.querySelector("#imageURL") as HTMLInputElement
      ).value.trim(),
      supplierId: parseInt(
        (document.querySelector("#supplierId") as HTMLInputElement).value,
        10
      ),
    };

    try {
      // Send data to API
      const response = await fetch("http://localhost:3000/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Product added successfully!");
        console.log("API Response:", result);
        form.reset(); // Clear the form
      } else {
        const error = await response.json();
        alert("Failed to add product. " + error.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  });
});

// Define the product interface
interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  quantityInStock: number;
  price: number;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch product data from the backend
    const response = await fetch("http://localhost:3000/api/getProducts", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }

    // Parse the response as an array of products
    const products: Product[] = await response.json();

    // Find the table body where the product rows will be inserted
    const productTableBody = document.querySelector<HTMLTableSectionElement>(
      "#product-table-body"
    );

    // Ensure that we have a valid table body element
    if (productTableBody) {
      // Insert the product rows dynamically
      productTableBody.innerHTML = products
        .map(
          (product) => `
            <tr data-product-id="${product._id}">
              <th scope="row">${product.productId}</th>
              <td>${product.name}</td>
              <td>${product.description}</td>
              <td>${product.quantityInStock}</td>
              <td>$${product.price}</td>
              <td>
                <button class="btn btn-sm btn-warning edit-btn data-product-id="${product._id}">
                  <i class="fa-solid fa-pencil-alt"></i> Edit
                </button>
                <button
                  class="btn btn-sm btn-danger delete-btn"
                >
                  <i class="fa-solid fa-trash-alt"></i> Remove
                </button>
              </td>
            </tr>
          `
        )
        .join("");
    }

    // Add event listener for edit buttons
    const editButtons =
      document.querySelectorAll<HTMLButtonElement>(".edit-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", (event: MouseEvent) => {
        const buttonElement = event.target as HTMLElement;
        const productId = buttonElement.dataset.productId;

        const productToEdit = products.find(
          (product) => product._id === productId
        );
        if (productToEdit) {
          // Populate the popup fields with product data
          //   (document.getElementById("updateName") as HTMLInputElement).value =
          //     productToEdit.name;
          //   (
          //     document.getElementById("updateDescription") as HTMLTextAreaElement
          //   ).value = productToEdit.description;

          //   (document.getElementById("updatePrice") as HTMLInputElement).value =
          //     productToEdit.price.toString();
          //   (
          //     document.getElementById("updateQuantityInStock") as HTMLInputElement
          //   ).value = productToEdit.quantityInStock.toString();

          // Show the popup
          const popupOverlay = document.getElementById("UpdatepopupOverlay");
          if (popupOverlay) {
            popupOverlay.style.display = "block";
          }
        }
      });
    });

    // Hide the popup when cancel button is clicked
    const cancelButton = document.getElementById("cancelUpdateForm");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        const popupOverlay = document.getElementById("UpdatepopupOverlay");
        if (popupOverlay) {
          popupOverlay.style.display = "none";
        }
      });
    }

    // Add event listeners to delete buttons
    const deleteButtons =
      document.querySelectorAll<HTMLButtonElement>(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event: MouseEvent) => {
        const row = (event.target as HTMLElement).closest<HTMLTableRowElement>(
          "tr"
        ); // Find the closest table row
        console.log("hello world");
        if (!row) {
          console.error("Row not found for delete button click.");
          return;
        }

        const productId = row.dataset.productId; // Get the product's ID from the dataset

        if (!productId) {
          console.error("Product ID not found in row dataset.");
          return;
        }

        // Show confirmation modal (if you have one) or directly delete
        if (confirm("Are you sure you want to delete this product?")) {
          try {
            // Send DELETE request to the backend
            const deleteResponse = await fetch(
              `http://localhost:3000/api/deleteProduct/${productId}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (!deleteResponse.ok) {
              throw new Error("Failed to delete product");
            }

            // Remove the row from the table on success
            row.remove();
            alert("Product deleted successfully!");
          } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
          }
        }
      });
    });
  } catch (error) {
    console.error("An error occurred while fetching products:", error);
  }
});
