# Oly Drugstore Online Store

Customer ordering website prototype for Oly Drugstore.

The goal is to let customers browse products, choose a store, select delivery or pickup, choose a payment method, and send the order through WhatsApp so the cashier can confirm and prepare it.

## Version 1 Scope

- Product catalog based on sample Oly POS products
- Store selection for Bizerte and Tunis
- Store-aware stock display
- Out-of-stock handling
- Cart and checkout flow
- Customer fields: full name, phone, city, address, notes
- Delivery modes: local delivery, distance delivery, pickup
- Payment modes: pay on delivery, card placeholder, pay in store for pickup
- French, English, and Arabic UI
- Tobacco category enabled
- WhatsApp order message generation

## Store Locations

| Store | Address |
| --- | --- |
| Oly Drugstore Bizerte | 07 Rue 2 Mars 1934, Bizerte 7000 |
| Oly Drugstore Tunis | V43J+R99, Tunis |

## Production Architecture Recommendation

Do not connect the public website directly to the POS local XML file.

Recommended structure:

1. The POS app remains local and fast inside each store.
2. Each POS app syncs product, stock, store status, and product image data to a backend when online.
3. If a POS app is offline, that store is shown as closed online.
4. The website reads products and stock from the backend.
5. Website orders are saved to the backend.
6. The POS app shows incoming online orders in an Online Orders tab.
7. The cashier confirms, prepares, cancels, or marks the order as delivered/picked up.

## Next POS Changes Needed

- Add product image path/file support to the Product model
- Add online visibility status per product
- Add store online heartbeat/sync status
- Add Online Orders tab
- Add order status workflow: New, Confirmed, Preparing, Ready, Delivered, Cancelled
- Add backend sync when internet is available

## Development

```powershell
npm run dev
```

## Build

```powershell
npm run build
```
