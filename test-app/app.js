const users = [{ email: 'qa.lead@example.com', password: 'Automation123!', name: 'QA Lead' }];
const products = [
  { name: 'Aurora Keyboard', category: 'Accessories', price: 129 },
  { name: 'Pulse Mouse', category: 'Accessories', price: 79 },
  { name: 'Dock Pro', category: 'Hardware', price: 219 }
];
const taxRate = 0.0825;
const state = { user: null, cart: [] };
const money = value => `$${value.toFixed(2)}`;
const byTestId = id => document.querySelector(`[data-testid="${id}"]`);

function renderProducts() {
  const search = byTestId('product-search').value.toLowerCase();
  const category = byTestId('category-filter').value;
  const list = byTestId('product-list');
  list.innerHTML = '';
  products
    .filter(product => product.name.toLowerCase().includes(search))
    .filter(product => category === 'All' || product.category === category)
    .forEach(product => {
      const card = document.createElement('article');
      card.className = 'product';
      card.dataset.testid = 'product-card';
      card.innerHTML = `
        <h3 data-testid="product-name">${product.name}</h3>
        <p>${product.category}</p>
        <p class="price">${money(product.price)}</p>
        <button data-testid="add-to-cart">Add to cart</button>
      `;
      card.querySelector('button').addEventListener('click', () => addToCart(product));
      list.appendChild(card);
    });
}

function addToCart(product) {
  state.cart = [product];
  byTestId('cart-count').textContent = String(state.cart.length);
  renderCart();
}

function renderCart() {
  byTestId('cart-line-items').innerHTML = state.cart
    .map(item => `<p data-testid="cart-line-item">${item.name} - ${money(item.price)}</p>`)
    .join('');
  byTestId('cart-subtotal').textContent = money(state.cart.reduce((sum, item) => sum + item.price, 0));
}

byTestId('login-submit').addEventListener('click', () => {
  const email = byTestId('login-email').value;
  const password = byTestId('login-password').value;
  const user = users.find(candidate => candidate.email === email && candidate.password === password);
  if (!user) {
    byTestId('login-error').textContent = 'Invalid credentials';
    return;
  }
  state.user = user;
  byTestId('account-name').textContent = user.name;
  byTestId('login-panel').classList.add('hidden');
  byTestId('app-panel').classList.remove('hidden');
  renderProducts();
});

byTestId('product-search').addEventListener('input', renderProducts);
byTestId('category-filter').addEventListener('change', renderProducts);
byTestId('open-cart').addEventListener('click', () => byTestId('cart-panel').classList.toggle('hidden'));
byTestId('checkout-button').addEventListener('click', () => byTestId('checkout-panel').classList.remove('hidden'));
byTestId('checkout-panel').addEventListener('submit', event => {
  event.preventDefault();
  const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);
  byTestId('order-number').textContent = `QA-${Date.now().toString().slice(-6)}`;
  byTestId('receipt-customer').textContent = byTestId('checkout-name').value;
  byTestId('receipt-total').textContent = money(subtotal + subtotal * taxRate);
  byTestId('receipt-panel').classList.remove('hidden');
});
