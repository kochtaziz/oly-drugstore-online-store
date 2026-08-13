const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4000);
const apiKey = process.env.OLY_API_KEY || "";
const dataPath = path.join(__dirname, "data", "products.json");

function readProducts() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-API-Key",
  });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function normalizeProduct(input) {
  const product = input || {};
  const storeId = product.storeId === "tunis" || product.storeId === "STORE-2" ? "tunis" : "bizerte";
  const id = String(product.id || product.barcode || product.name || "").trim();
  if (!id || !product.name) return null;

  return {
    id,
    name:
      typeof product.name === "string"
        ? { fr: product.name, en: product.name, ar: product.name }
        : product.name,
    category: String(product.category || "Other"),
    price: Number(product.price || product.salePrice || 0),
    image: String(product.image || String(product.name).slice(0, 2).toUpperCase()),
    imageUrl: product.imageUrl || "",
    barcode: String(product.barcode || id),
    stock: {
      bizerte: storeId === "bizerte" ? Number(product.quantity || 0) : Number(product.stock?.bizerte || 0),
      tunis: storeId === "tunis" ? Number(product.quantity || 0) : Number(product.stock?.tunis || 0),
    },
  };
}

function mergeProduct(products, incoming) {
  const index = products.findIndex(
    (item) => item.id === incoming.id || item.barcode === incoming.barcode,
  );
  if (index < 0) {
    products.push(incoming);
    return;
  }

  products[index] = {
    ...products[index],
    ...incoming,
    name: incoming.name || products[index].name,
    stock: {
      ...products[index].stock,
      ...incoming.stock,
    },
  };
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.url === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.url === "/api/products" && request.method === "GET") {
    sendJson(response, 200, readProducts());
    return;
  }

  if (request.url === "/api/products" && request.method === "POST") {
    if (apiKey && request.headers["x-api-key"] !== apiKey) {
      sendJson(response, 401, { error: "Invalid API key" });
      return;
    }

    try {
      const body = JSON.parse(await readBody(request));
      const items = Array.isArray(body) ? body : [body];
      const products = readProducts();
      for (const item of items) {
        const product = normalizeProduct(item);
        if (product) mergeProduct(products, product);
      }
      writeProducts(products);
      sendJson(response, 200, { ok: true, count: products.length });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`Oly Drugstore API running on http://localhost:${port}`);
});
