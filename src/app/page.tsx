"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Language = "fr" | "en" | "ar";
type DeliveryType = "delivery" | "pickup";
type PaymentMethod = "delivery" | "card" | "store";
type StoreId = "bizerte" | "tunis";
type LocalizedText = Record<Language, string>;

type Product = {
  id: string;
  name: LocalizedText;
  category: string;
  price: number;
  image: string;
  imageUrl?: string;
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
  { id: "safia-water-15", name: { fr: "Eau Safia 1.5L", en: "Safia Water 1.5L", ar: "ماء صافيا 1.5 لتر" }, category: "Drinks", price: 1, image: "SA", barcode: "619100001", stock: { bizerte: 72, tunis: 48 } },
  { id: "boga-cidre", name: { fr: "Boga Cidre 24cl", en: "Boga Cidre 24cl", ar: "بوغا سيدر 24 صل" }, category: "Drinks", price: 1.6, image: "BO", barcode: "619100004", stock: { bizerte: 48, tunis: 30 } },
  { id: "apla", name: { fr: "Apla 24cl", en: "Apla 24cl", ar: "أبلا 24 صل" }, category: "Drinks", price: 1.5, image: "AP", barcode: "619100006", stock: { bizerte: 48, tunis: 30 } },
  { id: "saida-biscuits", name: { fr: "Biscuits Saida", en: "Saida Biscuits", ar: "بسكويت سعيدة" }, category: "Snacks", price: 0.9, image: "SB", barcode: "619100012", stock: { bizerte: 70, tunis: 50 } },
  { id: "maestro-chocolate", name: { fr: "Chocolat Maestro", en: "Maestro Chocolate Bar", ar: "شوكولاتة مايسترو" }, category: "Snacks", price: 1.9, image: "MC", barcode: "619100014", stock: { bizerte: 45, tunis: 30 } },
  { id: "chips-40g", name: { fr: "Chips 40g", en: "Chips 40g", ar: "شيبس 40غ" }, category: "Snacks", price: 1.3, image: "CH", barcode: "619100015", stock: { bizerte: 60, tunis: 0 } },
  { id: "lilas-tissues", name: { fr: "Mouchoirs Lilas", en: "Lilas Tissues Pack", ar: "مناديل ليلاس" }, category: "Hygiene", price: 1.2, image: "LT", barcode: "619100017", stock: { bizerte: 80, tunis: 60 } },
  { id: "hand-sanitizer", name: { fr: "Gel desinfectant 100ml", en: "Hand Sanitizer 100ml", ar: "معقم يدين 100 مل" }, category: "Hygiene", price: 3.5, image: "HS", barcode: "619100020", stock: { bizerte: 35, tunis: 24 } },
  { id: "toothpaste", name: { fr: "Dentifrice 75ml", en: "Toothpaste 75ml", ar: "معجون أسنان 75 مل" }, category: "Hygiene", price: 4.2, image: "TP", barcode: "619100022", stock: { bizerte: 32, tunis: 0 } },
  { id: "baby-wipes", name: { fr: "Lingettes bebe 72pcs", en: "Baby Wipes 72pcs", ar: "مناديل أطفال 72 قطعة" }, category: "Baby", price: 5.5, image: "BW", barcode: "619100024", stock: { bizerte: 24, tunis: 18 } },
  { id: "diapers", name: { fr: "Couches Peau Douce", en: "Peau Douce Diapers", ar: "حفاضات بو دوس" }, category: "Baby", price: 22.5, image: "PD", barcode: "619100025", stock: { bizerte: 12, tunis: 0 } },
  { id: "detergent", name: { fr: "Lessive 1kg", en: "Laundry Detergent 1kg", ar: "مسحوق غسيل 1 كغ" }, category: "Household", price: 6.5, image: "LD", barcode: "619100026", stock: { bizerte: 18, tunis: 0 } },
  { id: "lighter", name: { fr: "Briquet", en: "Lighter", ar: "ولاعة" }, category: "Tobacco", price: 1, image: "BR", barcode: "619100028", stock: { bizerte: 80, tunis: 60 } },
  { id: "cigarettes", name: { fr: "Paquet cigarettes 20", en: "Cigarettes 20 Pack", ar: "علبة سجائر 20" }, category: "Tobacco", price: 10, image: "20", barcode: "619100029", stock: { bizerte: 35, tunis: 0 } },
  { id: "recharge-card", name: { fr: "Carte recharge 5 DT", en: "Phone Recharge Card 5 DT", ar: "بطاقة شحن 5 دنانير" }, category: "Services", price: 5, image: "5D", barcode: "619100030", stock: { bizerte: 50, tunis: 40 } },
];

const productImages: Record<string, string> = {
  "safia-water-15": "products/safia-water-15.webp",
  "boga-cidre": "products/boga-cidre.jpg",
  apla: "products/apla.jpg",
  "saida-biscuits": "products/saida-biscuits.webp",
  "maestro-chocolate": "products/maestro-chocolate.webp",
  "chips-40g": "products/chips-40g.jpg",
  "lilas-tissues": "products/lilas-tissues.webp",
  "hand-sanitizer": "products/hand-sanitizer.jpg",
  toothpaste: "products/toothpaste.jpg",
  "baby-wipes": "products/baby-wipes.webp",
  diapers: "products/diapers.jpg",
  detergent: "products/detergent.png",
  lighter: "products/lighter.jpg",
  cigarettes: "products/cigarettes.jpg",
  "recharge-card": "products/recharge-card.png",
};

const categoryLabels: Record<string, LocalizedText> = {
  Drinks: { fr: "Boissons", en: "Drinks", ar: "مشروبات" },
  Snacks: { fr: "Snacks", en: "Snacks", ar: "مأكولات خفيفة" },
  Hygiene: { fr: "Hygiene", en: "Hygiene", ar: "النظافة" },
  Baby: { fr: "Bebe", en: "Baby", ar: "الأطفال" },
  Household: { fr: "Maison", en: "Household", ar: "المنزل" },
  Tobacco: { fr: "Tabac", en: "Tobacco", ar: "التبغ" },
  Services: { fr: "Services", en: "Services", ar: "خدمات" },
};

const copy = {
  fr: {
    dir: "ltr",
    heroBadge: "Commande en ligne connectee au POS",
    title: "Oly Drugstore",
    subtitle:
      "Vos produits du quotidien, disponibles par magasin, avec retrait ou livraison confirmee par WhatsApp.",
    welcome: "Bienvenue chez Oly",
    welcomeText:
      "Choisissez vos articles, confirmez vos coordonnees, puis le caissier prepare la commande.",
    start: "Commencer la commande",
    browse: "Voir les produits",
    fast: "Livraison locale",
    pickupCopy: "Retrait magasin",
    stockLive: "Stock par magasin",
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
    payCard: "Carte bancaire (bientot disponible)",
    payStore: "Paiement en magasin",
    store: "Magasin",
    add: "Ajouter",
    remove: "Retirer",
    total: "Total",
    stock: "Stock",
    out: "Rupture",
    open: "Ouvert",
    closed: "Ferme",
    sameCity: "Livraison locale",
    distance: "Livraison distance",
    feeLater: "Frais calcules par la societe de livraison",
    whatsapp: "Envoyer vers WhatsApp",
    empty: "Votre panier est vide.",
    onlineRule:
      "Si le POS d'un magasin est hors ligne, ce magasin apparait ferme sur le site.",
    imageNote:
      "Images produits temporaires en V1. En production, elles viennent du POS.",
    required: "Remplissez les champs obligatoires avant d'envoyer.",
    items: "articles",
    otherStore: "Autre magasin",
    orderSummary: "Resume rapide",
    orderTitle: "Oly Drugstore - Commande en ligne",
  },
  en: {
    dir: "ltr",
    heroBadge: "Online ordering connected to POS",
    title: "Oly Drugstore",
    subtitle:
      "Everyday products with store-aware stock, pickup, delivery, and WhatsApp confirmation.",
    welcome: "Welcome to Oly",
    welcomeText:
      "Choose your items, confirm your details, and the cashier prepares the order.",
    start: "Start order",
    browse: "Browse products",
    fast: "Local delivery",
    pickupCopy: "Store pickup",
    stockLive: "Stock by store",
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
    payCard: "Card payment (coming soon)",
    payStore: "Pay in store",
    store: "Store",
    add: "Add",
    remove: "Remove",
    total: "Total",
    stock: "Stock",
    out: "Out of stock",
    open: "Open",
    closed: "Closed",
    sameCity: "Local delivery",
    distance: "Distance delivery",
    feeLater: "Fee calculated by delivery company",
    whatsapp: "Send to WhatsApp",
    empty: "Your cart is empty.",
    onlineRule:
      "If a store POS is offline, that store appears closed on the website.",
    imageNote:
      "Temporary product images for V1. In production, they come from POS.",
    required: "Fill all required fields before sending.",
    items: "items",
    otherStore: "Other store",
    orderSummary: "Quick summary",
    orderTitle: "Oly Drugstore - Online order",
  },
  ar: {
    dir: "rtl",
    heroBadge: "طلبات اونلاين مرتبطة بنظام البيع",
    title: "Oly Drugstore",
    subtitle:
      "منتجات يومية مع مخزون حسب المتجر، استلام أو توصيل، وتأكيد عبر واتساب.",
    welcome: "مرحبا بكم في Oly",
    welcomeText:
      "اختر المنتجات، أكد معلوماتك، ثم يقوم الكاشير بتحضير الطلب.",
    start: "ابدأ الطلب",
    browse: "عرض المنتجات",
    fast: "توصيل محلي",
    pickupCopy: "استلام من المتجر",
    stockLive: "المخزون حسب المتجر",
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
    open: "مفتوح",
    closed: "مغلق",
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
    items: "منتجات",
    otherStore: "متجر آخر",
    orderSummary: "ملخص سريع",
  },
} as const;

const arabicCopy = {
  dir: "rtl",
  heroBadge: "طلبات إلكترونية مرتبطة بنظام البيع",
  title: "Oly Drugstore",
  subtitle:
    "منتجات يومية مع مخزون حسب كل متجر، وخيارات استلام أو توصيل، وتأكيد الطلب عبر واتساب.",
  welcome: "مرحبا بكم في Oly",
  welcomeText:
    "اختر المنتجات، أكد معلوماتك، ثم يقوم الكاشير بتحضير الطلب.",
  start: "ابدأ الطلب",
  browse: "عرض المنتجات",
  fast: "توصيل محلي",
  pickupCopy: "استلام من المتجر",
  stockLive: "المخزون حسب المتجر",
  search: "ابحث عن منتج أو رمز بار",
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
  payCard: "الدفع بالبطاقة (قريبا)",
  payStore: "الدفع في المتجر",
  store: "المتجر",
  add: "أضف",
  remove: "حذف",
  total: "المجموع",
  stock: "المخزون",
  out: "غير متوفر",
  open: "مفتوح",
  closed: "مغلق",
  sameCity: "توصيل محلي",
  distance: "توصيل بين المدن",
  feeLater: "يتم تحديد الرسوم من شركة التوصيل",
  whatsapp: "إرسال عبر واتساب",
  empty: "السلة فارغة.",
  onlineRule:
    "إذا كان نظام البيع في المتجر غير متصل، يظهر المتجر مغلقا على الموقع.",
  imageNote:
    "صور المنتجات مؤقتة في النسخة الأولى. في الإنتاج، تأتي من نظام البيع.",
  required: "يرجى ملء كل البيانات المطلوبة قبل الإرسال.",
  items: "منتجات",
  otherStore: "متجر آخر",
  orderSummary: "ملخص سريع",
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

function productName(product: Product, language: Language) {
  return product.name[language] ?? product.name.fr;
}

function categoryName(category: string, language: Language) {
  return categoryLabels[category]?.[language] ?? category;
}

function productImage(product: Product) {
  return product.imageUrl ?? productImages[product.id] ?? "";
}

function orderTitle(language: Language) {
  if (language === "fr") return "Oly Drugstore - Commande en ligne";
  if (language === "ar") return "Oly Drugstore - طلب عبر الإنترنت";
  return "Oly Drugstore - Online order";
}

function storeAccent(storeId: StoreId) {
  if (storeId === "tunis") {
    return {
      color: "#7C3AED",
      soft: "#F3E8FF",
      text: "#5B21B6",
      border: "#C4B5FD",
      shadow: "rgba(124, 58, 237, 0.2)",
      gradient: "linear-gradient(135deg,#f5f3ff,#ffffff)",
    };
  }

  return {
    color: "#FFD21F",
    soft: "#FFF7CC",
    text: "#7A4F00",
    border: "#FACC15",
    shadow: "rgba(255, 210, 31, 0.32)",
    gradient: "linear-gradient(135deg,#fff7cc,#ffffff)",
  };
}

export default function Home() {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(products);
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

  const t = language === "ar" ? arabicCopy : copy[language];
  const accent = storeAccent(selectedStore);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBase) return;

    fetch(`${apiBase.replace(/\/$/, "")}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product API unavailable");
        }
        return response.json() as Promise<Product[]>;
      })
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setCatalogProducts(items);
        }
      })
      .catch(() => {
        setCatalogProducts(products);
      });
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(catalogProducts.map((item) => item.category)))],
    [catalogProducts],
  );
  const selectedStoreInfo = stores.find((store) => store.id === selectedStore)!;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = catalogProducts.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const productSearchText = [
      product.name.fr,
      product.name.en,
      product.name.ar,
      product.barcode,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      !normalizedQuery ||
      productSearchText.includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const cartRows = cart
    .map((item) => {
      const product = catalogProducts.find((candidate) => candidate.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<CartItem & { product: Product }>;
  const total = cartRows.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const cartQuantity = cartRows.reduce((sum, item) => sum + item.quantity, 0);
  const customerCity = customer.city.trim().toLowerCase();
  const deliveryProcess =
    deliveryType === "pickup"
      ? t.pickup
      : customerCity && customerCity === selectedStoreInfo.city.toLowerCase()
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
    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.city ||
      !customer.address ||
      !cartRows.length
    ) {
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
      orderTitle(language),
      `${t.customer}: ${customer.fullName}`,
      `${t.phone}: ${customer.phone}`,
      `${t.city}: ${customer.city}`,
      `${t.address}: ${customer.address}`,
      `${t.store}: ${selectedStoreInfo.name}`,
      `${t.deliveryType}: ${deliveryProcess}`,
      `${t.payment}: ${paymentText}`,
      "",
      `${t.cart}:`,
      ...cartRows.map(
        (item) =>
          `- ${productName(item.product, language)} x${item.quantity} = ${money(
            item.product.price * item.quantity,
          )}`,
      ),
      "",
      `${t.total}: ${money(total)}`,
      `${t.notes}: ${customer.notes || "-"}`,
    ];
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main dir={t.dir} className="min-h-screen bg-[#f7f7f4] pb-28 text-[#111111] lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#welcome" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#111111] text-lg font-black text-white shadow-sm">
              O
            </span>
            <span>
              <span className="block text-sm font-black leading-4">Oly</span>
              <span className="block text-xs font-semibold text-slate-500">
                Drugstore
              </span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <div
              className="hidden rounded-full border px-3 py-2 text-xs font-bold sm:block"
              style={{
                backgroundColor: accent.soft,
                borderColor: accent.border,
                color: accent.text,
              }}
            >
              {selectedStoreInfo.city} · {selectedStoreInfo.online ? t.open : t.closed}
            </div>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(["fr", "en", "ar"] as Language[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={`rounded-md px-3 py-2 text-xs font-black transition ${
                    language === item
                      ? "bg-[#111111] text-white shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section id="welcome" className="overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(100svh-65px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-8">
          <div className="reveal">
            <p
              className="inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.2em]"
              style={{
                backgroundColor: accent.soft,
                borderColor: accent.border,
                color: accent.text,
              }}
            >
              {t.heroBadge}
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-7xl">
              {t.welcome}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {t.subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                className="rounded-lg bg-[#111111] px-6 py-4 text-center text-sm font-black text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#2a2a2a]"
                style={{ boxShadow: `0 20px 35px ${accent.shadow}` }}
              >
                {t.start}
              </a>
              <a
                href="#checkout"
                className="rounded-lg border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-[#111111]"
              >
                {t.checkout}
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
              {[t.fast, t.pickupCopy, t.stockLive].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-xs font-black text-slate-700 sm:p-4 sm:text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal delay-2">
            <div className="relative mx-auto max-w-sm rounded-[2rem] border border-slate-200 bg-[#111111] p-3 shadow-2xl">
              <div className="rounded-[1.5rem] bg-[#f7f7f4] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold" style={{ color: accent.text }}>
                      {t.orderSummary}
                    </p>
                    <p className="text-2xl font-black">{money(total || 9.8)}</p>
                  </div>
                  <div
                    className="rounded-full px-3 py-2 text-xs font-black"
                    style={{
                      backgroundColor: accent.color,
                      color: selectedStore === "bizerte" ? "#111111" : "#ffffff",
                    }}
                  >
                    {cartQuantity || 3} {t.items}
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {catalogProducts.slice(0, 3).map((product, index) => (
                    <div
                      key={product.id}
                      className="phone-card flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <span
                        className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg font-black"
                        style={{ backgroundColor: accent.soft, color: accent.text }}
                      >
                        {productImage(product) ? (
                          <img
                            src={productImage(product)}
                            alt={productName(product, language)}
                            className="h-full w-full object-contain p-1"
                            loading="lazy"
                          />
                        ) : (
                          product.image
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black">
                          {productName(product, language)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {money(product.price)}
                        </span>
                      </span>
                      <span className="text-xs font-black text-green-700">
                        {t.open}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">
                  {t.onlineRule}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold outline-none transition focus:border-[#111111] focus:bg-white"
            />
            <select
              value={selectedStore}
              onChange={(event) => setSelectedStore(event.target.value as StoreId)}
              className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-black outline-none transition focus:border-[#111111] focus:bg-white"
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
                style={
                  category === item
                    ? {
                        backgroundColor: accent.color,
                        borderColor: accent.border,
                        color: selectedStore === "bizerte" ? "#111111" : "#ffffff",
                      }
                    : undefined
                }
                className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-black transition ${
                  category === item
                    ? "border-[#111111] bg-[#111111] text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {item === "All" ? t.all : categoryName(item, language)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => {
            const currentStock = storeStock(product, selectedStore);
            const totalStock = availableStock(product);
            const inStock = currentStock > 0;
            return (
              <article
                key={product.id}
                className="product-card group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
              >
                <div className="relative grid aspect-square place-items-center" style={{ background: accent.gradient }}>
                  <span
                    className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-black uppercase shadow-sm"
                    style={{ color: accent.text }}
                  >
                    {categoryName(product.category, language)}
                  </span>
                  <div
                    className="grid h-28 w-28 place-items-center overflow-hidden rounded-3xl bg-white text-4xl font-black shadow-lg transition group-hover:scale-105"
                    style={{ color: accent.text }}
                  >
                    {productImage(product) ? (
                      <img
                        src={productImage(product)}
                        alt={productName(product, language)}
                        className="h-full w-full object-contain p-3"
                        loading="lazy"
                      />
                    ) : (
                      product.image
                    )}
                  </div>
                </div>
                <div className="grid min-h-48 gap-3 p-3 sm:p-4">
                  <div>
                    <h2 className="line-clamp-2 min-h-12 text-base font-black leading-6">
                      {productName(product, language)}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      #{product.barcode}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-black">{money(product.price)}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                        inStock
                          ? "bg-slate-100 text-green-700"
                          : totalStock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {inStock
                        ? `${t.stock}: ${currentStock}`
                        : totalStock > 0
                          ? t.otherStore
                          : t.out}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={() => addToCart(product)}
                    className="mt-auto h-12 rounded-xl bg-[#111111] text-sm font-black text-white transition active:scale-[0.98] hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {inStock ? t.add : t.out}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="checkout" className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-2xl font-black">{t.cart}</h2>
          <div className="mt-4 space-y-3">
            {cartRows.length ? (
              cartRows.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg font-black"
                      style={{ backgroundColor: accent.soft, color: accent.text }}
                    >
                      {productImage(item.product) ? (
                        <img
                          src={productImage(item.product)}
                          alt={productName(item.product, language)}
                          className="h-full w-full object-contain p-1"
                          loading="lazy"
                        />
                      ) : (
                        item.product.image
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black">{productName(item.product, language)}</p>
                      <p className="text-sm font-semibold text-slate-500">
                        {item.quantity} x {money(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black"
                  >
                    {t.remove}
                  </button>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                {t.empty}
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-2xl font-black">
            <span>{t.total}</span>
            <span>{money(total)}</span>
          </div>
        </div>

        <form
          onSubmit={submitOrder}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <h2 className="text-2xl font-black">{t.checkout}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required value={customer.fullName} onChange={(event) => setCustomer({ ...customer, fullName: event.target.value })} placeholder={t.fullName} className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold outline-none focus:border-[#111111] focus:bg-white" />
            <input required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder={t.phone} className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold outline-none focus:border-[#111111] focus:bg-white" />
            <input required value={customer.city} onChange={(event) => setCustomer({ ...customer, city: event.target.value })} placeholder={t.city} className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold outline-none focus:border-[#111111] focus:bg-white" />
            <input required value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder={t.address} className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold outline-none focus:border-[#111111] focus:bg-white" />
            <textarea value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} placeholder={t.notes} className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold outline-none focus:border-[#111111] focus:bg-white sm:col-span-2" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setDeliveryType("delivery"); if (paymentMethod === "store") setPaymentMethod("delivery"); }} className={`rounded-xl border px-3 py-4 text-sm font-black transition ${deliveryType === "delivery" ? "border-[#111111] bg-[#111111] text-white" : "border-slate-200 bg-white"}`}>
              {t.delivery}
            </button>
            <button type="button" onClick={() => setDeliveryType("pickup")} className={`rounded-xl border px-3 py-4 text-sm font-black transition ${deliveryType === "pickup" ? "border-[#111111] bg-[#111111] text-white" : "border-slate-200 bg-white"}`}>
              {t.pickup}
            </button>
          </div>
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} className="mt-3 h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-black outline-none focus:border-[#111111] focus:bg-white">
            <option value="delivery">{t.payDelivery}</option>
            <option value="card">{t.payCard}</option>
            {deliveryType === "pickup" ? <option value="store">{t.payStore}</option> : null}
          </select>
          <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">
            {deliveryProcess}: {deliveryType === "delivery" ? t.feeLater : selectedStoreInfo.address}
          </div>
          {error ? (
            <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-black text-red-700">
              {error}
            </p>
          ) : null}
          <button type="submit" className="mt-4 h-14 w-full rounded-xl bg-[#111111] px-4 text-base font-black text-white transition active:scale-[0.99] hover:bg-[#2a2a2a]">
            {t.whatsapp}
          </button>
        </form>
      </section>

      {cartQuantity > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden">
          <a
            href="#checkout"
            className="mx-auto flex max-w-md items-center justify-between rounded-xl bg-[#111111] px-4 py-3 font-black text-white"
            style={{
              borderTop: `4px solid ${accent.color}`,
              boxShadow: `0 -12px 30px ${accent.shadow}`,
            }}
          >
            <span>
              {cartQuantity} {t.items} · {money(total)}
            </span>
            <span>{t.checkout}</span>
          </a>
        </div>
      ) : null}
    </main>
  );
}

