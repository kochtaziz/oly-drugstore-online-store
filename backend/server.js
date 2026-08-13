const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4000);
const apiKey = process.env.OLY_API_KEY || "";
const dataPath = path.join(__dirname, "data", "products.json");
const ordersPath = path.join(__dirname, "data", "orders.json");
const uploadsDir = path.join(__dirname, "uploads", "products");
fs.mkdirSync(uploadsDir, { recursive: true });

function readProducts() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function readOrders() {
  if (!fs.existsSync(ordersPath)) return [];
  return JSON.parse(fs.readFileSync(ordersPath, "utf8"));
}

function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

function writeOrders(orders) {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
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

function sendText(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-API-Key",
  });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 6_000_000) {
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendFile(response, filePath) {
  if (!fs.existsSync(filePath)) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === ".png" ? "image/png" :
    ext === ".webp" ? "image/webp" :
    ext === ".gif" ? "image/gif" :
    "image/jpeg";
  response.writeHead(200, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=31536000",
  });
  fs.createReadStream(filePath).pipe(response);
}

function normalizeProduct(input) {
  const product = input || {};
  const storeId = product.storeId === "tunis" || product.storeId === "STORE-2" ? "tunis" : "bizerte";
  const id = String(product.id || product.barcode || product.name || "").trim();
  if (!id || !product.name) return null;

  const normalized = {
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

  if (product.imageBase64) {
    const ext = String(product.imageExtension || ".jpg").toLowerCase().replace(/[^a-z0-9.]/g, "");
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    const fileName = id.replace(/[^a-z0-9_-]/gi, "-").toLowerCase() + safeExt;
    fs.writeFileSync(path.join(uploadsDir, fileName), Buffer.from(String(product.imageBase64), "base64"));
    normalized.imageUrl = "/uploads/products/" + fileName;
  }

  return normalized;
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

function normalizeStoreId(value) {
  return value === "tunis" || value === "STORE-2" ? "tunis" : "bizerte";
}

function createOrder(input) {
  const order = input || {};
  const orders = readOrders();
  const id = "ORD-" + String(orders.length + 1).padStart(6, "0");
  const now = new Date().toISOString();
  const normalized = {
    id,
    createdAt: now,
    updatedAt: now,
    status: "new",
    storeId: normalizeStoreId(order.storeId),
    storeName: String(order.storeName || ""),
    customer: {
      fullName: String(order.customer?.fullName || ""),
      phone: String(order.customer?.phone || ""),
      city: String(order.customer?.city || ""),
      address: String(order.customer?.address || ""),
      notes: String(order.customer?.notes || order.notes || ""),
    },
    deliveryType: String(order.deliveryType || "delivery"),
    deliveryProcess: String(order.deliveryProcess || ""),
    paymentMethod: String(order.paymentMethod || "delivery"),
    paymentText: String(order.paymentText || ""),
    total: Number(order.total || 0),
    items: Array.isArray(order.items) ? order.items : [],
  };
  orders.unshift(normalized);
  writeOrders(orders);
  return normalized;
}

function csvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function ordersCsv(orders) {
  const lines = ["id\tcreatedAt\tstoreId\tstatus\tcustomer\tphone\tcity\ttotal\tpayment\tdelivery\titems"];
  for (const order of orders) {
    const items = (order.items || [])
      .map((item) => `${item.name || item.barcode} x${item.quantity}`)
      .join(", ");
    lines.push([
      order.id,
      order.createdAt,
      order.storeId,
      order.status,
      order.customer?.fullName,
      order.customer?.phone,
      order.customer?.city,
      Number(order.total || 0).toFixed(3),
      order.paymentText || order.paymentMethod,
      order.deliveryProcess || order.deliveryType,
      items,
    ].map(csvEscape).join("\t"));
  }
  return lines.join("\n");
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

  if (request.url.startsWith("/uploads/products/") && request.method === "GET") {
    const fileName = path.basename(request.url);
    sendFile(response, path.join(uploadsDir, fileName));
    return;
  }

  if (request.url === "/api/products" && request.method === "GET") {
    sendJson(response, 200, readProducts());
    return;
  }

  if (request.url.startsWith("/api/orders.csv") && request.method === "GET") {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const wantedStore = url.searchParams.get("storeId");
    const orders = readOrders().filter((order) => {
      if (!wantedStore) return true;
      return normalizeStoreId(wantedStore) === normalizeStoreId(order.storeId);
    });
    sendText(response, 200, ordersCsv(orders));
    return;
  }

  if (request.url === "/api/orders" && request.method === "GET") {
    sendJson(response, 200, readOrders());
    return;
  }

  if (request.url === "/api/orders" && request.method === "POST") {
    try {
      const body = JSON.parse(await readBody(request));
      const order = createOrder(body);
      sendJson(response, 201, { ok: true, order });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (request.url === "/api/orders/status" && request.method === "POST") {
    if (apiKey && request.headers["x-api-key"] !== apiKey) {
      sendJson(response, 401, { error: "Invalid API key" });
      return;
    }
    try {
      const body = JSON.parse(await readBody(request));
      const orders = readOrders();
      const order = orders.find((item) => item.id === body.id);
      if (!order) {
        sendJson(response, 404, { error: "Order not found" });
        return;
      }
      order.status = String(body.status || order.status);
      order.updatedAt = new Date().toISOString();
      writeOrders(orders);
      sendJson(response, 200, { ok: true, order });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
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
