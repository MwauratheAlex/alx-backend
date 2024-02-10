import express from 'express';
import { createClient, print } from 'redis';
import { promisify } from 'util';

const listProducts = [
  {itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4},
  {itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10},
  {itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2},
  {itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5},
  {itemId: 5, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 0}
]
function getItemById(id) {
  return listProducts.filter(product => product.itemId === id)[0];
}

const client = createClient();
function reserveStockById(itemId, stock) {
  client.set(itemId, stock, print)
}
const getAsync = promisify(client.get).bind(client);
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(itemId);
  return reservedStock;
}

const app = express();
const port = 1245;

app.get('/', (_, res) => {
  res.status(200).json('Welcome to my express redis app');
});

app.get('/list_products', (_, res) => {
  res.status(200).json(listProducts);
});

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({"status":"Product not found"});
    return;
  }
  const reservedStock = await getCurrentReservedStockById(itemId);
  const out = {
    ...item,
    "currentQuantity": reservedStock ? 
      item.initialAvailableQuantity - reservedStock :
      item.initialAvailableQuantity,
  };
  res.status(200).json(out);
});


app.get('/reserve_product/:itemId(\\d+)', (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({"status":"Product not found"});
    return;
  }

  if (item.initialAvailableQuantity < 1) {
    res.json({ 
      "status":"Not enough stock available","itemId": item.itemId 
    });
    return;
  }

  reserveStockById(item.itemId, item.initialAvailableQuantity);
  res.status(200).json({
    "status":"Reservation confirmed","itemId": item.itemId
  })

});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
});
