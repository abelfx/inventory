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
  
  const productListContainer = document.getElementById('product-list')!;
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
  
  let products: Product[] = [];
  
  // Fetch products from API
  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/getProducts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
  
      products = await response.json();
      populateCategories();
      displayProducts(products);
    } catch (error) {
      console.error(error);
      alert('Failed to load products');
    }
  }
  
  // Populate category filter
  function populateCategories() {
    const categories = Array.from(new Set(products.map((product) => product.category)));
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Display products
  function displayProducts(products: Product[]) {
    productListContainer.innerHTML = '';
  
    products.forEach((product) => {
      const productCard = document.createElement('div');
      productCard.classList.add('col-md-4');
      productCard.classList.add('mb-4');
  
      productCard.innerHTML = `
        <div class="product-card" style="width: 320px; height: 520px">
          <img
            src="${product.imageURL}"
            alt="Product Image"
            class="product-img"
            style="height: 200px; object-fit: cover"
          />
          <h5 class="product-title mt-3">${product.name}</h5>
          <p class="product-desc">
            ${product.description}
          </p>
          <p class="stock-info">Stock Left: ${product.quantityInStock}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="text-muted">Category: ${product.category}</p>
          <p class="text-muted">Added on: ${new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
      `;
  
      productListContainer.appendChild(productCard);
    });
  }
  
  // Filter products based on search input and selected category
  function filterProducts() {
    let filteredProducts = products;
  
    // Filter by search input (name or category)
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }
  
    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }
  
    displayProducts(filteredProducts);
  }
  
  // Event listeners for search input and category filter
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  
  // Call fetchProducts when the page loads
  fetchProducts();
  