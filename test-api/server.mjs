import http from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.API_PORT ?? 5173);
const taxRate = 0.0825;
const users = [
  { id: 'usr-1001', email: 'qa.lead@example.com', password: 'Automation123!', role: 'qa-admin', displayName: 'QA Lead' },
  { id: 'usr-2001', email: 'locked@example.com', password: 'Automation123!', role: 'locked', displayName: 'Locked User' }
];
const products = [
  { id: 'prd-100', name: 'Aurora Keyboard', category: 'Accessories', price: 129, inventory: 18, active: true },
  { id: 'prd-101', name: 'Pulse Mouse', category: 'Accessories', price: 79, inventory: 0, active: true },
  { id: 'prd-200', name: 'Dock Pro', category: 'Hardware', price: 219, inventory: 7, active: true }
];

const json = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'x-correlation-id': randomUUID(),
    ...headers
  });
  response.end(JSON.stringify(body));
};

const parseBody = request =>
  new Promise(resolve => {
    let raw = '';
    request.on('data', chunk => {
      raw += chunk;
    });
    request.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({ __invalidJson: true });
      }
    });
  });

const authenticate = request => {
  const token = request.headers.authorization?.replace('Bearer ', '');
  return users.find(user => token === `token-${user.id}`);
};

function handleGraphql(body) {
  const query = String(body.query ?? '');
  const variables = body.variables ?? {};
  if (query.includes('products')) {
    const filteredProducts = products.filter(product => !variables.category || product.category === variables.category);
    return { data: { products: filteredProducts } };
  }
  if (query.includes('createOrder')) {
    const product = products.find(candidate => candidate.id === variables.productId);
    if (!product) {
      return { errors: [{ message: 'Product not found', extensions: { code: 'NOT_FOUND' } }] };
    }
    const quantity = Number(variables.quantity ?? 1);
    const subtotal = product.price * quantity;
    return {
      data: {
        createOrder: {
          id: `ord-${randomUUID().slice(0, 8)}`,
          status: 'CONFIRMED',
          subtotal,
          total: Number((subtotal + subtotal * taxRate).toFixed(2))
        }
      }
    };
  }
  return { errors: [{ message: 'Unsupported operation', extensions: { code: 'BAD_REQUEST' } }] };
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
  if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname === '/api/health') {
    if (request.method === 'HEAD') {
      response.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        'x-correlation-id': randomUUID()
      });
      return response.end();
    }
    return json(response, 200, { status: 'UP', service: 'qa-cart-api', version: '1.0.0' });
  }
  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await parseBody(request);
    const user = users.find(candidate => candidate.email === body.email && candidate.password === body.password);
    if (!user || user.role === 'locked') {
      return json(response, 401, { code: 'AUTH_FAILED', message: 'Invalid or locked credentials' });
    }
    return json(response, 200, {
      token: `token-${user.id}`,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role }
    });
  }
  if (request.method === 'GET' && url.pathname === '/api/products') {
    const category = url.searchParams.get('category');
    const inStock = url.searchParams.get('inStock');
    const filteredProducts = products
      .filter(product => !category || product.category === category)
      .filter(product => inStock !== 'true' || product.inventory > 0);
    return json(response, 200, { data: filteredProducts, meta: { count: filteredProducts.length } });
  }
  if (request.method === 'POST' && url.pathname === '/api/orders') {
    const user = authenticate(request);
    if (!user) {
      return json(response, 401, { code: 'UNAUTHORIZED', message: 'Bearer token is required' });
    }
    const body = await parseBody(request);
    const product = products.find(candidate => candidate.id === body.productId);
    if (!product) {
      return json(response, 404, { code: 'PRODUCT_NOT_FOUND', message: `Product ${body.productId} was not found` });
    }
    if (Number(body.quantity) > product.inventory) {
      return json(response, 409, { code: 'INSUFFICIENT_INVENTORY', available: product.inventory });
    }
    const subtotal = product.price * Number(body.quantity);
    return json(response, 201, {
      id: `ord-${randomUUID().slice(0, 8)}`,
      status: 'CONFIRMED',
      customerId: user.id,
      subtotal,
      total: Number((subtotal + subtotal * taxRate).toFixed(2))
    });
  }
  if (request.method === 'POST' && url.pathname === '/graphql') {
    const body = await parseBody(request);
    return json(response, 200, handleGraphql(body));
  }
  return json(response, 404, { code: 'NOT_FOUND', message: `${request.method} ${url.pathname} is not supported` });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`QA Cart API listening on http://127.0.0.1:${port}`);
});
