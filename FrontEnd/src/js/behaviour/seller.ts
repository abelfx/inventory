document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('http://localhost:3000/api/getProducts', {
        credentials: 'include', 
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
  
      const products = await response.json();
  
     
      const totalProductsElement = document.querySelector('#total-products')!;
      totalProductsElement.textContent = products.length.toString();
 
      const productTableBody = document.querySelector('#product-table-body')!;
      productTableBody.innerHTML = products
        .map(
          (product) => `
            <tr>
              <td>${product.name}</td>
              <td>${product.description}</td>
              <td>$${product.price}</td>
              <td>${product.quantityInStock}</td>
            </tr>
          `
        )
        .join('');
    } catch (error) {
      console.error('An error occurred while fetching products:', error);
    }
  });
  