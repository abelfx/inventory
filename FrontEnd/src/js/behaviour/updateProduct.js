document.addEventListener("DOMContentLoaded", () => {
  // Function to open the update modal and populate the form with product data
  window.openUpdateModal = function (productId) {
    // Show the modal
    const modal = new bootstrap.Modal(
      document.getElementById("updateProductModal")
    );
    modal.show();

    // Fetch the product data based on productId (static data for demo purposes)
    // In a real scenario, replace this with a fetch call to your API
    const productData = {
      name: "Sample Product",
      description: "This is a sample product.",
      category: "Electronics",
      price: 99.99,
      quantityInStock: 50,
      imageURL: "https://via.placeholder.com/150",
      supplierId: 123,
    };

    // Populate the form fields with the fetched data
    document.getElementById("updateName").value = productData.name;
    document.getElementById("updateDescription").value =
      productData.description;
    document.getElementById("updateCategory").value = productData.category;
    document.getElementById("updatePrice").value = productData.price;
    document.getElementById("updateQuantityInStock").value =
      productData.quantityInStock;
    document.getElementById("updateImageURL").value = productData.imageURL;
    document.getElementById("updateSupplierId").value = productData.supplierId;
  };

  // Function to submit the updated product data
  window.submitUpdate = function () {
    // Gather the updated form data
    const updatedData = {
      name: document.getElementById("updateName").value,
      description: document.getElementById("updateDescription").value,
      category: document.getElementById("updateCategory").value,
      price: parseFloat(document.getElementById("updatePrice").value),
      quantityInStock: parseInt(
        document.getElementById("updateQuantityInStock").value,
        10
      ),
      imageURL: document.getElementById("updateImageURL").value,
      supplierId: parseInt(
        document.getElementById("updateSupplierId").value,
        10
      ),
    };

    // Assuming the productId is globally available or can be accessed somehow
    const productId = 12345; // This should be dynamically passed

    // Send the updated data to the API (PUT request)
    fetch(`http://localhost:3000/api/updateProduct/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Product updated successfully!");
        console.log("API Response:", data);

        // Optionally, close the modal here
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("updateProductModal")
        );
        modal.hide();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      });
  };
});
