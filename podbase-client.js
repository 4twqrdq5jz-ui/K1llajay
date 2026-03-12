/**
 * Podbase API Client
 * Handles all Podbase product store interactions
 */

class PodbaseClient {
  constructor(apiBaseUrl = '') {
    this.apiBaseUrl = apiBaseUrl || window.location.origin;
  }

  /**
   * Fetch all Podbase products
   */
  async getProducts() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/podbase/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Podbase products:', error);
      throw error;
    }
  }

  /**
   * Fetch single product details
   */
  async getProduct(productId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/podbase/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Check product inventory/stock
   */
  async getInventory(productId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/podbase/inventory/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching inventory for ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/podbase/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating Podbase order:', error);
      throw error;
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/podbase/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Display product grid on the page
   */
  async renderProductGrid(containerId, options = {}) {
    try {
      const products = await this.getProducts();
      const container = document.getElementById(containerId);
      
      if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
      }

      const gridHTML = this.buildProductGridHTML(products, options);
      container.innerHTML = gridHTML;

      // Attach event listeners
      this.attachProductEventListeners();

      return products;
    } catch (error) {
      console.error('Error rendering product grid:', error);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `<p style="color: red;">Error loading products: ${error.message}</p>`;
      }
    }
  }

  /**
   * Build HTML for product grid
   */
  buildProductGridHTML(products, options = {}) {
    const {
      columns = 3,
      showPrice = true,
      showInventory = true,
      imageHeight = '300px'
    } = options;

    let html = `<div style="display: contents;">`;

    products.forEach(product => {
      const image = product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image';
      const price = product.price || product.pricing?.retail_price || 'N/A';
      const inStock = product.inventory?.available > 0 ? 'In Stock' : 'Out of Stock';

      html += `
        <div class="product-card" data-product-id="${product.id}" style="
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          aspect-ratio: 1;
          background: rgba(0,0,0,0.5);
          cursor: pointer;
          transition: transform 0.3s, filter 0.3s;
        " onmouseenter="this.style.transform='scale(1.05)'; this.style.filter='brightness(1.2)'" onmouseleave="this.style.transform='scale(1)'; this.style.filter='brightness(1)'">
          <img src="${image}" alt="${product.name}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "/>
          <div class="product-overlay" style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 15px;
            box-sizing: border-box;
            opacity: 0;
            transition: opacity 0.3s;
          " onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0'">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; color: white; letter-spacing: 1px;">${product.name}</h3>
            <p style="margin: 0 0 10px 0; color: rgba(255,255,255,0.8); font-size: 12px; letter-spacing: 1px;">
              ${product.description?.substring(0, 40) || 'Premium Product'}...
            </p>
            ${showPrice ? `<p style="font-size: 14px; font-weight: bold; color: #ffd700; margin: 5px 0;">$${price}</p>` : ''}
            ${showInventory ? `<p style="font-size: 11px; color: ${product.inventory?.available > 0 ? '#00ff00' : '#ff6666'}; margin: 5px 0;">${inStock}</p>` : ''}
            <button class="add-to-cart-btn" data-product-id="${product.id}" style="
              width: 100%;
              padding: 8px;
              margin-top: 10px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 3px;
              cursor: pointer;
              font-weight: bold;
              transition: opacity 0.3s;
              font-family: 'sitefont', monospace;
              font-size: 11px;
              letter-spacing: 1px;
              text-transform: uppercase;
            " onmouseenter="this.style.opacity='0.8'" onmouseleave="this.style.opacity='1'">Add to Cart</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Attach event listeners to product cards
   */
  attachProductEventListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.borderColor = 'rgba(255,255,255,0.5)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.borderColor = 'rgba(255,255,255,0.2)';
      });
    });

    // Add to cart button listeners
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.getAttribute('data-product-id');
        this.handleAddToCart(productId);
      });
    });
  }

  /**
   * Handle add to cart action
   */
  handleAddToCart(productId) {
    // You can dispatch a custom event or call a cart management function
    const event = new CustomEvent('podbase-add-to-cart', { detail: { productId } });
    document.dispatchEvent(event);
    alert(`Product ${productId} added to cart!`);
  }
}

// Initialize global instance
const podbaseClient = new PodbaseClient();
