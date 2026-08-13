# Oly Drugstore API

This lightweight API is the first sync layer between the POS and the customer website.

## Run Locally

```powershell
cd backend
npm run dev
```

The API runs on:

```text
http://localhost:4000
```

## Connect The Website Locally

```powershell
$env:NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
npm run dev
```

If `NEXT_PUBLIC_API_BASE_URL` is missing or the API is offline, the website falls back to its built-in catalog.

## Connect The POS

The POS syncs product saves to:

```text
http://localhost:4000/api/products
```

The POS can also pull online orders from:

```text
http://localhost:4000/api/orders.csv?storeId=STORE-1
```

When a POS product has a local image selected, the POS can upload it to:

```text
/uploads/products
```

The storefront can display those images through `NEXT_PUBLIC_API_BASE_URL`.

Change the API target with:

```powershell
$env:OLY_API_URL="https://your-production-api.example.com"
```

If the API is offline, the POS still saves products locally.

## API

```text
GET  /api/health
GET  /api/products
POST /api/products
GET  /api/orders
GET  /api/orders.csv?storeId=STORE-1
POST /api/orders
POST /api/orders/status
```

For a public production API, set `OLY_API_KEY` on both the API server and the POS machine.
For production, replace the JSON files with a managed database or host this backend on a small server with persistent storage.
