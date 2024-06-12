import { createClient, print } from 'redis';
import { promisify } from 'util';

const express = require('express');

const listProducts = [
  { Id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { Id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { Id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

const redisClient = createClient();
function reserveStockById(itemId, stock) {
  redisClient.set(itemId, stock, print);
}

const asyncGet = promisify(redisClient.get).bind(redisClient);

async function getCurrentReservedStockById(itemId) {
  const reservedStock = parseInt(await asyncGet(itemId));
  if (isNaN(reservedStock)) return 0;
  return reservedStock;
}

/**
 * @param {number} id 
 */
function getItemById(id) {
  return listProducts.find(product => product.Id === id);
}

const app = express();
const port = 1245;

app.get('/', (_, res) => {
  res.status(200).json('Welcome to my express redis app');
});

app.get('/list_products', (_, res) => {
  const out = [];

  listProducts.forEach((product) => {
    out.push({
      itemId: product.Id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock,
    });
  });

  res.send(JSON.stringify(out));
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const item = getItemById(parseInt(itemId));
  if (!item) {
    res.send(JSON.stringify({ "status": "Product not found" }));
    return;
  }
  const reservedStock = await getCurrentReservedStockById(itemId);
  const currQty = item.stock - reservedStock;

  const out = {
    itemId: item.Id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: currQty,
  };

  res.send(JSON.stringify(out));
});

app.get('/reserve_product/:itemId', async (req, res) => {
  let { itemId } = req.params;
  itemId = parseInt(itemId);

  const item = getItemById(itemId);

  if (!item) {
    res.send(JSON.stringify({ "status": "Product not found" }));
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  if (item.stock < 1) {
    res.send(JSON.stringify({
      "status": "Not enough stock available",
      "itemId": itemId,
    }));
    return;
  }
  item.stock -= 1;

  reserveStockById(itemId, reservedStock + 1);

  res.send(JSON.stringify({
    "status": "Reservation confirmed",
    "itemId": itemId,
  }));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
