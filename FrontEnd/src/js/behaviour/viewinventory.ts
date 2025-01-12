interface Product {
  name: string;
  description: string;
  category: string;
  price: number;
  quantityInStock: number;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
  supplierId: number;
}

const productListContainer: HTMLElement =
  document.getElementById("product-list")!;

let products: Product[] = [];

// Fetch products from API
async function fetchProducts(): Promise<void> {
  try {
    const response: Response = await fetch(
      "http://localhost:3000/api/getProducts",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error(error);
    alert("Failed to load products");
  }
}

// Display products
function displayProducts(products: Product[]): void {
  productListContainer.innerHTML = "";

  products.forEach((product: Product) => {
    const productCard: HTMLDivElement = document.createElement("div");
    productCard.classList.add("col-md-4");
    productCard.classList.add("mb-4");

    productCard.innerHTML = `
        <div class="product-card" style="width: 320px; height: 520px">
          <h5 class="product-title mt-3">${product.name}</h5>
          <p class="product-desc">
            ${product.description}
          </p>
          <p class="stock-info">Stock Left: ${product.quantityInStock}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="text-muted">Category: ${product.category}</p>
          <p class="text-muted">Added on: ${new Date(
            product.createdAt
          ).toLocaleDateString()}</p>
        </div>
      `;

    productListContainer.appendChild(productCard);
  });
}

// Call fetchProducts when the page loads
fetchProducts();
