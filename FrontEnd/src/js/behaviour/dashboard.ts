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


//display the add data 

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch product data from backend
    const response = await fetch('http://localhost:3000/api/getProducts', {
      credentials: 'include', 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product data');
    }

    const products = await response.json();

    // Find the table body where the product rows will be inserted
    const productTableBody = document.querySelector('#product-table-body');

    // Ensure that we have a valid table body element
    if (productTableBody) {
      // Insert the product rows dynamically
      productTableBody.innerHTML = products
        .map(
          (product) => `
            <tr>
              <th scope="row">${product.productId}</th>
              <td>${product.name}</td>
              <td>${product.description}</td>
              <td>${product.quantityInStock}</td>
              <td>$${product.price}</td>
              <td>
                <button class="btn btn-sm btn-warning">
                  <i class="fa-solid fa-pencil-alt"></i> Edit
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteConfirmationModal"
                >
                  <i class="fa-solid fa-trash-alt"></i> Remove
                </button>
              </td>
            </tr>
          `
        )
        .join('');
    }
  } catch (error) {
    console.error('An error occurred while fetching products:', error);
  }
});
    