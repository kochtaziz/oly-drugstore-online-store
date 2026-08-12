"use client";

import { FormEvent, useMemo, useState } from "react";

type Language = "fr" | "en" | "ar";
type DeliveryType = "delivery" | "pickup";
type PaymentMethod = "delivery" | "card" | "store";
type StoreId = "bizerte" | "tunis";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  barcode: string;
  stock: Record<StoreId, number>;
};

type CartItem = {
  productId: string;
  quantity: number;
};

const stores: Array<{
  id: StoreId;
  name: string;
  city: string;
  address: string;
  online: boolean;
}> = [
  {
    id: "bizerte",
    name: "Oly Drugstore Bizerte",
    city: "Bizerte",
    address: "07 Rue 2 Mars 1934, Bizerte 7000",
    online: true,
  },
  {
    id: "tunis",
    name: "Oly Drugstore Tunis",
    city: "Tunis",
    address: "V43J+R99, Tunis",
    online: true,
  },
];

const products: Product[] = [
  {
    id: "safia-water-15",
    name: "Safia Water 1.5L",
    category: "Drinks",
    price: 1,
    image: "SA",
    barcode: "619100001",
    stock: { bizerte: 72, tunis: 48 },
  },
  {
    id: "boga-cidre",
    name: "Boga Cidre 24cl",
    category: "Drinks",
    price: 1.6,
    image: "BO",
    barcode: "619100004",
    stock: { bizerte: 48, tunis: 30 },
  },
  {
    id: "apla",
    name: "Apla 24cl",
    category: "Drinks",
    price: 1.5,
    image: "AP",
    barcode: "619100006",
    stock: { bizerte: 48, tunis: 30 },
  },
  {
    id: "saida-biscuits",
    name: "Saida Biscuits",
    category: "Snacks",
    price: 0.9,
    image: "SB",
    barcode: "619100012",
    stock: { bizerte: 70, tunis: 50 },
  },
  {
    id: "maestro-chocolate",
    name: "Maestro Chocolate Bar",
    category: "Snacks",
    price: 1.9,
    image: "MC",
    barcode: "619100014",
    stock: { bizerte: 45, tunis: 30 },
  },
  {
    id: "chips-40g",
    name: "Chips 40g",
    category: "Snacks",
    price: 1.3,
    image: "CH",
    barcode: "619100015",
    stock: { bizerte: 60, tunis: 0 },
  },
  {
    id: "lilas-tissues",
    name: "Lilas Tissues Pack",
    category: "Hygiene",
    price: 1.2,
    image: "LT",
    barcode: "619100017",
    stock: { bizerte: 80, tunis: 60 },
  },
  {
    id: "hand-sanitizer",
    name: "Hand Sanitizer 100ml",
    category: "Hygiene",
    price: 3.5,
    image: "HS",
    barcode: "619100020",
    stock: { bizerte: 35, tunis: 24 },
  },
  {
    id: "toothpaste",
    name: "Toothpaste 75ml",
    category: "Hygiene",
    price: 4.2,
    image: "TP",
    barcode: "619100022",
    stock: { bizerte: 32, tunis: 0 },
  },
  {
    id: "baby-wipes",
    name: "Baby Wipes 72pcs",
    category: "Baby",
    price: 5.5,
    image: "BW",
    barcode: "619100024",
    stock: { bizerte: 24, tunis: 18 },
  },
  {
    id: "diapers",
    name: "Peau Douce Diapers",
    category: "Baby",
    price: 22.5,
    image: "PD",
    barcode: "619100025",
    stock: { bizerte: 12, tunis: 0 },
  },
  {
    id: "detergent",
    name: "Laundry Detergent 1kg",
    category: "Household",
    price: 6.5,
    image: "LD",
    barcode: "619100026",
    stock: { bizerte: 18, tunis: 0 },
  },
  {
    id: "lighter",
    name: "Briquet Lighter",
    category: "Tobacco",
    price: 1,
    image: "BR",
    barcode: "619100028",
    stock: { bizerte: 80, tunis: 60 },
  },
  {
    id: "cigarettes",
    name: "Cigarettes 20 Pack",
    category: "Tobacco",
    price: 10,
    image: "20",
    barcode: "619100029",
    stock: { bizerte: 35, tunis: 0 },
  },
  {
    id: "recharge-card",
    name: "Phone Recharge Card 5 DT",
    category: "Services",
    price: 5,
    image: "5D",
    barcode: "619100030",
    stock: { bizerte: 50, tunis: 40 },
  },
];

const copy = {
  fr: {
    dir: "ltr",
    heroBadge: "Commande en ligne connectee au POS",
    title: "Oly Drugstore",
    subtitle:
      "Commandez vos produits, choisissez le magasin, la livraison ou le retrait, puis envoyez la commande vers WhatsApp pour confirmation.",
    search: "Rechercher un produit ou code-barres",
    all: "Tous",
    cart: "Panier",
    checkout: "Commande",
    customer: "Client",
    fullName: "Nom complet",
    phone: "Telephone",
    city: "Ville",
    address: "Adresse",
    notes: "Notes",
    deliveryType: "Mode",
    delivery: "Livraison",
    pickup: "Retrait magasin",
    payment: "Paiement",
    payDelivery: "Paiement a la livraison",
    payCard: "Carte bancaire (placeholder)",
    payStore: "Paiement en magasin",
    store: "Magasin",
    add: "Ajouter",
    remove: "Retirer",
    total: "Total",
    stock: "Stock",
    out: "Rupture",
    open: "Ouvert en ligne",
    closed: "Ferme en ligne",
    sameCity: "Livraison locale",
    distance: "Livraison distance",
    feeLater: "Frais calcules par la societe de livraison",
    whatsapp: "Envoyer vers WhatsApp",
    empty: "Votre panier est vide.",
    onlineRule:
      "Si le POS d'un magasin est hors ligne, le magasin apparait ferme sur le site.",
    imageNote:
      "Images produits: placeholders pour V1. En production, elles viennent du POS.",
    required: "Remplissez les champs obligatoires avant d'envoyer.",
  },
  en: {
    dir: "ltr",
    heroBadge: "Online ordering connected to POS",
    title: "Oly Drugstore",
    subtitle:
      "Order products, choose store pickup or delivery, then send the order to WhatsApp for cashier confirmation.",
    search: "Search product or barcode",
    all: "All",
    cart: "Cart",
    checkout: "Order",
    customer: "Customer",
    fullName: "Full name",
    phone: "Phone",
    city: "City",
    address: "Address",
    notes: "Notes",
    deliveryType: "Mode",
    delivery: "Delivery",
    pickup: "Store pickup",
    payment: "Payment",
    payDelivery: "Pay on delivery",
    payCard: "Card payment (placeholder)",
    payStore: "Pay in store",
    store: "Store",
    add: "Add",
    remove: "Remove",
    total: "Total",
    stock: "Stock",
    out: "Out of stock",
    open: "Online open",
    closed: "Online closed",
    sameCity: "Local delivery",
    distance: "Distance delivery",
    feeLater: "Fee calculated by delivery company",
    whatsapp: "Send to WhatsApp",
    empty: "Your cart is empty.",
    onlineRule:
      "If a store POS is offline, that store appears closed on the website.",
    imageNote:
      "Product images: placeholders for V1. In production, they come from POS.",
    required: "Fill all required fields before sending.",
  },
  ar: {
    dir: "rtl",
    heroBadge: "طلبات اونلاين مرتبطة بنظام البيع",
    title: "Oly Drugstore",
    subtitle:
      "اختر المنتجات، حدد المتجر أو التوصيل، ثم أرسل الطلب عبر واتساب لتأكيده من طرف الكاشير.",
    search: "ابحث عن منتج أو كود بار",
    all: "الكل",
    cart: "السلة",
    checkout: "الطلب",
    customer: "العميل",
    fullName: "الاسم الكامل",
    phone: "الهاتف",
    city: "المدينة",
    address: "العنوان",
    notes: "ملاحظات",
    deliveryType: "الطريقة",
    delivery: "توصيل",
    pickup: "استلام من المتجر",
    payment: "الدفع",
    payDelivery: "الدفع عند الاستلام",
    payCard: "الدفع بالبطاقة (مؤقت)",
    payStore: "الدفع في المتجر",
    store: "المتجر",
    add: "أضف",
    remove: "حذف",
    total: "المجموع",
    stock: "المخزون",
    out: "غير متوفر",
    open: "مفتوح اونلاين",
    closed: "مغلق اونلاين",
    sameCity: "توصيل محلي",
    distance: "توصيل بين المدن",
    feeLater: "يتم تحديد السعر من شركة التوصيل",
    whatsapp: "إرسال عبر واتساب",
    empty: "السلة فارغة.",
    onlineRule:
      "إذا كان نظام البيع في المتجر غير متصل، يظهر المتجر مغلقا في الموقع.",
    imageNote:
      "صور المنتجات مؤقتة في النسخة الأولى. لاحقا تأتي من نظام البيع.",
    required: "يرجى ملء كل البيانات المطلوبة قبل الإرسال.",
  },
} as const;

const whatsappPhone = "21658785649";

function money(value: number) {
  return `${value.toFixed(3)} DT`;
}

function availableStock(product: Product) {
  return Object.values(product.stock).reduce((sum, quantity) => sum + quantity, 0);
}

function storeStock(product: Product, storeId: StoreId) {
  const store = stores.find((item) => item.id === storeId);
  if (!store?.online) return 0;
  return product.stock[storeId];
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("fr");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedStore, setSelectedStore] = useState<StoreId>("bizerte");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("delivery");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const t = copy[language];
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((item) => item.category)))],
    [],
  );
  const selectedStoreInfo = stores.find((store) => store.id === selectedStore)!;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.barcode.includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const cartRows = cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<CartItem & { product: Product }>;
  const total = cartRows.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const customerCity = customer.city.trim().toLowerCase();
  const deliveryProcess =
    deliveryType === "pickup"
      ? t.pickup
      : customerCity &&
          customerCity === selectedStoreInfo.city.toLowerCase()
        ? t.sameCity
        : t.distance;

  function addToCart(product: Product) {
    setError("");
    const available = storeStock(product, selectedStore);
    if (available <= 0) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      const existingQuantity = existing?.quantity ?? 0;
      if (existingQuantity >= available) return current;
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId: product.id, quantity: 1 }];
    });
  }

  function removeFromCart(productId: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.city || !customer.address || !cartRows.length) {
      setError(t.required);
      return;
    }
    const paymentText =
      paymentMethod === "delivery"
        ? t.payDelivery
        : paymentMethod === "card"
          ? t.payCard
          : t.payStore;
    const lines = [
      `Oly Drugstore - Online order`,
      `${t.customer}: ${customer.fullName}`,
      `${t.phone}: ${customer.phone}`,
      `${t.city}: ${customer.city}`,
      `${t.address}: ${customer.address}`,
      `${t.store}: ${selectedStoreInfo.name}`,
      `${t.deliveryType}: ${deliveryProcess}`,
      `${t.payment}: ${paymentText}`,
      ``,
      `${t.cart}:`,
      ...cartRows.map(
        (item) =>
          `- ${item.product.name} x${item.quantity} = ${money(
            item.product.price * item.quantity,
          )}`,
      ),
      ``,
      `${t.total}: ${money(total)}`,
      `${t.notes}: ${customer.notes || "-"}`,
    ];
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main
      dir={t.dir}
      className="min-h-screen bg-[#f5f7f2] text-slate-950"
    >
      <section className="border-b border-emerald-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
                {t.heroBadge}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
                {t.title}
              </h1>
            </div>
            <div className="flex gap-2 rounded-md border border-slate-200 bg-slate-50 p-1">
              {(["fr", "en", "ar"] as Language[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={`rounded px-4 py-2 text-sm font-bold ${
                    language === item
                      ? "bg-emerald-800 text-white"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              {t.subtitle}
            </p>
            <div className="grid gap-2 rounded-lg border border-emerald-900/10 bg-emerald-50 p-4 text-sm text-emerald-950">
              <p>{t.onlineRule}</p>
              <p>{t.imageNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8">
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                className="h-12 rounded-md border border-slate-200 px-4 text-base outline-none focus:border-emerald-700"
              />
              <select
                value={selectedStore}
                onChange={(event) => setSelectedStore(event.target.value as StoreId)}
                className="h-12 rounded-md border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-700"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-md border px-4 py-3 text-sm font-bold ${
                    category === item
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {item === "All" ? t.all : item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const currentStock = storeStock(product, selectedStore);
              const totalStock = availableStock(product);
              const inStock = currentStock > 0;
              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-emerald-50 to-amber-50">
                    <div className="grid h-24 w-24 place-items-center rounded-lg bg-white text-3xl font-black text-emerald-800 shadow-sm">
                      {product.image}
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-emerald-700">
                          {product.category}
                        </p>
                        <h2 className="mt-1 min-h-12 text-lg font-black leading-6">
                          {product.name}
                        </h2>
                      </div>
                      <p className="rounded-md bg-slate-950 px-2.5 py-1 text-sm font-bold text-white">
                        {money(product.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-500">
                        {t.stock}: {inStock ? currentStock : totalStock}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${
                          inStock
                            ? "bg-emerald-50 text-emerald-700"
                            : totalStock > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {inStock
                          ? selectedStoreInfo.city
                          : totalStock > 0
                            ? "Other store"
                            : t.out}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => addToCart(product)}
                      className="h-12 w-full rounded-md bg-emerald-800 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {inStock ? t.add : t.out}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-2xl font-black">{t.cart}</h2>
            <div className="mt-4 space-y-3">
              {cartRows.length ? (
                cartRows.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-bold">{item.product.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.quantity} x {money(item.product.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold"
                    >
                      {t.remove}
                    </button>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">
                  {t.empty}
                </p>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-xl font-black">
              <span>{t.total}</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <form
            onSubmit={submitOrder}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-2xl font-black">{t.checkout}</h2>
            <div className="mt-4 grid gap-3">
              <input
                required
                value={customer.fullName}
                onChange={(event) =>
                  setCustomer({ ...customer, fullName: event.target.value })
                }
                placeholder={t.fullName}
                className="h-12 rounded-md border border-slate-200 px-4 outline-none focus:border-emerald-700"
              />
              <input
                required
                value={customer.phone}
                onChange={(event) =>
                  setCustomer({ ...customer, phone: event.target.value })
                }
                placeholder={t.phone}
                className="h-12 rounded-md border border-slate-200 px-4 outline-none focus:border-emerald-700"
              />
              <input
                required
                value={customer.city}
                onChange={(event) =>
                  setCustomer({ ...customer, city: event.target.value })
                }
                placeholder={t.city}
                className="h-12 rounded-md border border-slate-200 px-4 outline-none focus:border-emerald-700"
              />
              <input
                required
                value={customer.address}
                onChange={(event) =>
                  setCustomer({ ...customer, address: event.target.value })
                }
                placeholder={t.address}
                className="h-12 rounded-md border border-slate-200 px-4 outline-none focus:border-emerald-700"
              />
              <textarea
                value={customer.notes}
                onChange={(event) =>
                  setCustomer({ ...customer, notes: event.target.value })
                }
                placeholder={t.notes}
                className="min-h-20 rounded-md border border-slate-200 px-4 py-3 outline-none focus:border-emerald-700"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType("delivery");
                    if (paymentMethod === "store") setPaymentMethod("delivery");
                  }}
                  className={`rounded-md border px-3 py-3 text-sm font-bold ${
                    deliveryType === "delivery"
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-slate-200"
                  }`}
                >
                  {t.delivery}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("pickup")}
                  className={`rounded-md border px-3 py-3 text-sm font-bold ${
                    deliveryType === "pickup"
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-slate-200"
                  }`}
                >
                  {t.pickup}
                </button>
              </div>
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as PaymentMethod)
                }
                className="h-12 rounded-md border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-700"
              >
                <option value="delivery">{t.payDelivery}</option>
                <option value="card">{t.payCard}</option>
                {deliveryType === "pickup" ? (
                  <option value="store">{t.payStore}</option>
                ) : null}
              </select>
              <div className="rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                {deliveryProcess}: {deliveryType === "delivery" ? t.feeLater : selectedStoreInfo.address}
              </div>
              {error ? (
                <p className="rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="h-13 rounded-md bg-slate-950 px-4 py-4 text-base font-black text-white transition hover:bg-emerald-900"
              >
                {t.whatsapp}
              </button>
            </div>
          </form>
        </aside>
      </section>
    </main>
  );
}
