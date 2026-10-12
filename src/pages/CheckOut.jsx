import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:           #0e0c0a;
    --bg-card:      #141210;
    --bg-input:     #1a1714;
    --border:       rgba(255,255,255,0.07);
    --border-focus: rgba(196,156,104,0.5);
    --gold:         #c49c68;
    --gold-light:   #dbb98a;
    --text:         #f0ebe3;
    --text-muted:   #8a8178;
    --text-faint:   #4a4540;
    --success:      #7aab8a;
    --danger:       #a87878;
    --whatsapp:     #25D366;
    --serif:        'Cormorant Garamond', Georgia, serif;
    --sans:         'Jost', sans-serif;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .ck-page {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  .ck-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  .ck-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 64px 48px 120px;
  }

  /* Ambient glow */
  .ck-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    width: 500px; height: 400px;
    top: 0; right: -80px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.045) 0%, transparent 70%);
  }

  /* ── Progress ── */
  .ck-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 56px;
    animation: fadeUp 0.5s 0.05s var(--ease) both;
  }

  .ck-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .ck-step-num {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    transition: all 0.3s var(--ease);
  }

  .ck-step-num.active {
    background: var(--gold);
    color: var(--bg);
    border: none;
  }

  .ck-step-num.inactive {
    background: transparent;
    color: var(--text-faint);
    border: 1px solid var(--border);
  }

  .ck-step-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .ck-step-label.active { color: var(--gold); }

  .ck-step-line {
    width: 72px; height: 1px;
    background: var(--border);
    margin: 0 12px;
    margin-bottom: 24px;
    flex-shrink: 0;
  }

  /* ── Page title ── */
  .ck-title {
    font-family: var(--serif);
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 300;
    color: var(--text);
    text-align: center;
    margin-bottom: 52px;
    letter-spacing: -0.01em;
    animation: fadeUp 0.6s 0.1s var(--ease) both;
  }

  .ck-title em { font-style: italic; color: var(--gold-light); }

  /* ── Layout grid ── */
  .ck-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 40px;
    align-items: start;
  }

  /* ── Form card ── */
  .ck-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    position: relative;
    animation: fadeUp 0.6s 0.15s var(--ease) both;
  }

  .ck-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.2;
  }

  /* ── Card header ── */
  .ck-card-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 28px 32px 0;
    margin-bottom: 28px;
  }

  .ck-card-head-icon {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    flex-shrink: 0;
  }

  .ck-card-title {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ck-card-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold);
    opacity: 0.15;
    min-width: 40px;
  }

  /* ── Form body ── */
  .ck-form-body {
    padding: 0 32px 32px;
  }

  /* ── Form grid ── */
  .ck-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  .ck-grid-1 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  /* ── Field ── */
  .ck-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ck-field.full { grid-column: 1 / -1; }

  .ck-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .ck-field:focus-within .ck-label { color: var(--gold); }

  .ck-input,
  .ck-select,
  .ck-textarea {
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 13px 16px;
    font-family: var(--sans);
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text);
    outline: none;
    width: 100%;
    transition: border-color 0.25s var(--ease), box-shadow 0.25s;
    -webkit-appearance: none;
    letter-spacing: 0.02em;
  }

  .ck-input::placeholder,
  .ck-textarea::placeholder {
    color: var(--text-faint);
    font-weight: 300;
  }

  .ck-input:focus,
  .ck-select:focus,
  .ck-textarea:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(196,156,104,0.06);
  }

  .ck-select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a4540' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-size: 14px;
    padding-right: 40px;
    cursor: pointer;
  }

  .ck-select option {
    background: var(--bg-input);
    color: var(--text);
  }

  .ck-textarea {
    resize: vertical;
    min-height: 88px;
    line-height: 1.65;
  }

  /* ── Summary panel ── */
  .ck-summary {
    position: sticky;
    top: 80px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    animation: fadeUp 0.6s 0.2s var(--ease) both;
    position: relative;
  }

  .ck-summary::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.2;
  }

  /* ── Summary items ── */
  .ck-items {
    max-height: 320px;
    overflow-y: auto;
    padding: 0 24px;
    margin-bottom: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--text-faint) transparent;
  }

  .ck-item {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: 14px;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    animation: fadeUp 0.4s var(--ease) both;
  }

  .ck-item:last-child { border-bottom: none; }

  .ck-item-img {
    width: 56px; height: 56px;
    object-fit: cover;
    border: 1px solid var(--border);
    display: block;
    filter: brightness(0.88);
  }

  .ck-item-name {
    font-family: var(--serif);
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ck-item-meta {
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }

  .ck-item-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ck-item-qty {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 1px;
  }

  .ck-qty-btn {
    width: 26px; height: 26px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  .ck-qty-btn:hover:not(:disabled) { color: var(--gold); }
  .ck-qty-btn:disabled { opacity: 0.2; cursor: not-allowed; }

  .ck-qty-num {
    min-width: 28px;
    text-align: center;
    font-family: var(--serif);
    font-size: 0.88rem;
    color: var(--text);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    line-height: 26px;
  }

  .ck-item-remove {
    width: 26px; height: 26px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 1px;
    cursor: pointer;
    color: var(--text-faint);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .ck-item-remove:hover {
    border-color: rgba(168,120,120,0.4);
    color: var(--danger);
  }

  /* Item price */
  .ck-item-price {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
    white-space: nowrap;
    align-self: flex-start;
    margin-top: 4px;
  }

  /* ── Totals ── */
  .ck-totals {
    padding: 20px 24px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ck-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    color: var(--text-muted);
    font-weight: 300;
  }

  .ck-total-row.grand {
    padding-top: 14px;
    border-top: 1px solid var(--border);
    margin-top: 4px;
  }

  .ck-grand-label {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .ck-grand-val {
    font-family: var(--serif);
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  /* ── CTA area ── */
  .ck-cta {
    padding: 0 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ck-place-btn {
    width: 100%;
    height: 52px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.25s var(--ease), box-shadow 0.25s;
    position: relative;
    overflow: hidden;
  }

  .ck-place-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.35s var(--ease);
  }

  .ck-place-btn:hover::before { transform: translateX(0); }
  .ck-place-btn:hover { box-shadow: 0 8px 28px rgba(196,156,104,0.22); }
  .ck-place-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .ck-place-btn:disabled::before { display: none; }
  .ck-place-btn span { position: relative; z-index: 1; }

  /* WhatsApp Order Button */
  .ck-wa-btn {
    width: 100%;
    height: 52px;
    background: var(--whatsapp);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s var(--ease);
    position: relative;
    overflow: hidden;
  }

  .ck-wa-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #1da851;
    transform: translateX(-101%);
    transition: transform 0.35s var(--ease);
  }

  .ck-wa-btn:hover::before { transform: translateX(0); }
  .ck-wa-btn:hover { 
    box-shadow: 0 8px 28px rgba(37, 211, 102, 0.3);
    transform: translateY(-1px);
  }
  .ck-wa-btn span { position: relative; z-index: 1; }

  /* Spinner */
  .ck-spinner {
    position: relative;
    z-index: 1;
    width: 14px; height: 14px;
    border: 1.5px solid var(--bg);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .ck-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 14px;
    font-size: 0.62rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Empty state ── */
  .ck-empty {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: fadeUp 0.6s var(--ease) both;
  }

  .ck-empty-icon {
    width: 52px; height: 52px;
    color: var(--text-faint);
    margin-bottom: 24px;
  }

  .ck-empty h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 10px;
  }

  .ck-empty p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 36px;
    line-height: 1.7;
  }

  .ck-empty-btn {
    padding: 13px 40px;
    background: transparent;
    border: 1px solid var(--gold);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .ck-empty-btn:hover { background: var(--gold); color: var(--bg); }

  /* ── SweetAlert overrides ── */
  .swal2-popup.ck-swal {
    background: var(--bg-card) !important;
    border: 1px solid var(--border) !important;
    border-radius: 4px !important;
    font-family: var(--sans) !important;
    color: var(--text) !important;
    padding: 36px !important;
  }
  .swal2-popup.ck-swal .swal2-title {
    font-family: var(--serif) !important;
    font-size: 1.5rem !important;
    font-weight: 300 !important;
    color: var(--text) !important;
  }
  .swal2-popup.ck-swal .swal2-html-container {
    color: var(--text-muted) !important;
    font-size: 0.83rem !important;
    font-weight: 300 !important;
    line-height: 1.7 !important;
  }
  .swal2-popup.ck-swal .swal2-confirm {
    background: var(--gold) !important;
    color: var(--bg) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.65rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 12px 28px !important;
  }
  .swal2-popup.ck-swal .swal2-cancel {
    background: transparent !important;
    color: var(--text-muted) !important;
    border: 1px solid var(--border) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.65rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 12px 28px !important;
  }
  .swal2-popup.ck-swal .swal2-icon { opacity: 0.8; }
  .swal2-popup.ck-swal .swal2-icon.swal2-error { border-color: var(--danger) !important; color: var(--danger) !important; }
  .swal2-popup.ck-swal .swal2-icon.swal2-success { border-color: var(--success) !important; color: var(--success) !important; }
  .swal2-popup.ck-swal .swal2-icon.swal2-info { border-color: var(--gold) !important; color: var(--gold) !important; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .ck-inner   { padding: 48px 24px 100px; }
    .ck-layout  { grid-template-columns: 1fr; }
    .ck-summary { position: static; }
    .ck-grid-2  { grid-template-columns: 1fr; }
    .ck-step-label { display: none; }
    .ck-step-line { width: 40px; }
  }
  @media (max-width: 520px) {
    .ck-inner    { padding: 36px 16px 80px; }
    .ck-card-head, .ck-form-body { padding-left: 20px; padding-right: 20px; }
    .ck-items    { padding: 0 16px; }
    .ck-totals   { padding: 16px; }
    .ck-cta      { padding: 0 16px 20px; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

  input, select, textarea { font-size: 16px; }
`;

const nigeriaStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara"
];

const swalDefaults = {
  customClass: { popup: "ck-swal" },
  background: "#141210",
  backdrop: "rgba(14,12,10,0.75)",
};

// ✅ Add your Paystack public key here
const PAYSTACK_PUBLIC_KEY = "pk_live_44b8e74e1bf27f48877ba17034757f993cd9657b";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, total, removeFromCart, updateQuantity } = useCart();

  // WhatsApp business number (replace with your actual number)
  const WHATSAPP_NUMBER = "2349033080879"; // Replace with your WhatsApp number

  const [shipping, setShipping] = useState({
    name: "", email: "", phone: "", address: "",
    state: "", city: "", zip: "", deliveryNotes: "",
  });

  const [focusedField,  setFocusedField]  = useState(null);
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [isWhatsAppProcessing, setIsWhatsAppProcessing] = useState(false);

  const handleChange = (e) =>
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s+\-()]{10,15}$/.test(phone);

  const verifyPaymentOnBackend = async (reference) => {
  try {
    // ✅ Transform cart items for verification
    const verifyPayload = { 
      reference, 
      cart: cart.map(item => ({
        _id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shipping: {
        name: shipping.name,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip
      }
    };
    
    const res = await fetch(`https://jofta-backend.onrender.com/api/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyPayload),
    });
    
    const data = await res.json();
    
    if (data.success) {
      MySwal.fire({
        ...swalDefaults,
        title: "Payment Verified",
        html: `<p>Thank you, <strong style="color:#dbb98a">${shipping.name}</strong>. Your order has been confirmed.</p>`,
        icon: "success",
        confirmButtonText: "View Order",
      }).then(() => navigate("/success", { state: { shipping, cart, total } }));
    } else {
      MySwal.fire({
        ...swalDefaults,
        icon: "error",
        title: "Verification Failed",
        text: data.message || "Payment could not be verified.",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    MySwal.fire({
      ...swalDefaults,
      icon: "error",
      title: "Server Error",
      text: "An error occurred during verification.",
    });
  }
};

const payWithPaystack = async () => {
  if (!window.PaystackPop) {
    MySwal.fire({
      ...swalDefaults,
      icon: "error",
      title: "Payment Unavailable",
      text: "Payment service failed to load. Please refresh and try again.",
    });
    return;
  }

  try {
    // ✅ Transform cart items to include _id for backend
    const payload = { 
      email: shipping.email,
      cart: cart.map(item => ({
        _id: item._id || item.id,  // Use _id, fallback to id
        quantity: item.quantity
      })),
      shipping: {
        name: shipping.name,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        deliveryNotes: shipping.deliveryNotes
      }
    };
    
    
    
    const res = await fetch(`https://jofta-backend.onrender.com/api/payment/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(data.message || "Payment initialization failed");
    }
    
    const { reference, amount } = data;

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: shipping.email,
      amount: amount,
      currency: "NGN",
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: shipping.name },
          { display_name: "Phone", variable_name: "customer_phone", value: shipping.phone },
        ]
      },
      callback: (response) => {
        verifyPaymentOnBackend(response.reference);
      },
      onClose: () => {
        MySwal.fire({
          ...swalDefaults,
          icon: "info",
          title: "Payment Cancelled",
          text: "You cancelled the payment.",
        });
      },
    });
    
    handler.openIframe();
    
  } catch (error) {
    console.error("Payment init error:", error);
    MySwal.fire({
      ...swalDefaults,
      icon: "error",
      title: "Could Not Initialise Payment",
      text: error.message || "Please try again.",
    });
  }
};
  const validateForm = () => {
    const required = ["name","email","phone","address","state","city","zip"];
    const empty = required.find(f => !shipping[f]?.trim());
    if (empty) {
      MySwal.fire({ ...swalDefaults, icon: "error", title: "Required Field", text: `Please fill in your ${empty.replace(/([A-Z])/g, ' $1').toLowerCase()}.` });
      return false;
    }
    if (!validateEmail(shipping.email)) {
      MySwal.fire({ ...swalDefaults, icon: "error", title: "Invalid Email", text: "Please enter a valid email address." });
      return false;
    }
    if (!validatePhone(shipping.phone)) {
      MySwal.fire({ ...swalDefaults, icon: "error", title: "Invalid Phone", text: "Please enter a valid phone number." });
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    payWithPaystack();
    setIsProcessing(false);
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;
    
    setIsWhatsAppProcessing(true);
    
    // Build cart items summary
    const cartItems = cart.map(item => 
      `• ${item.name} - Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}, Qty: ${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');
    
    const message = encodeURIComponent(
      `*🛍️ NEW ORDER VIA WEBSITE*` +
      `*👤 CUSTOMER DETAILS*` +
      `Name: ${shipping.name}` +
      `Email: ${shipping.email}` +
      `Phone: ${shipping.phone}` +
      `*📦 SHIPPING ADDRESS*%0A` +
      `Address: ${shipping.address}` +
      `City: ${shipping.city}` +
      `State: ${shipping.state}` +
      `Postal Code: ${shipping.zip}` +
      `Delivery Notes: ${shipping.deliveryNotes || 'None'}%0A%0A` +
      `*🛒 ORDER SUMMARY*` +
      `${cartItems}` +
      `*💰 TOTAL: ₦${total.toLocaleString()}*` +
      `🔗 Order placed via website checkout` +
      `Please confirm availability and provide payment details.`
    );
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsWhatsAppProcessing(false);
  };

  const handleRemoveItem = (item, index) => {
    removeFromCart(index);
    MySwal.fire({
      ...swalDefaults, title: "Item Removed",
      text: `${item.name} has been removed.`,
      icon: "info", timer: 1600, showConfirmButton: false,
    });
  };

  const grandTotal = total;

  if (cart.length === 0) {
    return (
      <div className="ck-page">
        <style>{CSS}</style>
        <div className="ck-inner">
          <div className="ck-empty">
            <svg className="ck-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some pieces to your cart before checking out.</p>
            <button className="ck-empty-btn" onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "name",    label: "Full Name",      type: "text",  half: false },
    { name: "email",   label: "Email Address",  type: "email", half: true  },
    { name: "phone",   label: "Phone Number",   type: "tel",   half: true  },
    { name: "address", label: "Street Address", type: "text",  half: false },
    { name: "city",    label: "City",           type: "text",  half: true  },
    { name: "zip",     label: "Postal Code",    type: "text",  half: true  },
  ];

  return (
    <div className="ck-page">
      <style>{CSS}</style>
      <div className="ck-glow" />

      <div className="ck-inner">

        {/* Progress */}
        <div className="ck-progress">
          {[
            { n: 1, label: "Cart",         active: true  },
            { n: 2, label: "Checkout",     active: true  },
            { n: 3, label: "Confirmation", active: false },
          ].map((step, i, arr) => (
            <div key={step.n} style={{ display:"flex", alignItems:"center" }}>
              <div className="ck-step">
                <div className={`ck-step-num ${step.active ? "active" : "inactive"}`}>{step.n}</div>
                <span className={`ck-step-label ${step.active ? "active" : ""}`}>{step.label}</span>
              </div>
              {i < arr.length - 1 && <div className="ck-step-line" />}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="ck-title">Complete Your <em>Order</em></h1>

        <div className="ck-layout">

          {/* ── Shipping form ── */}
          <div className="ck-card">
            <div className="ck-card-head">
              <div className="ck-card-head-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="ck-card-title">Shipping Details</span>
            </div>

            <div className="ck-form-body">
              {/* First row: name full width */}
              <div className="ck-grid-1">
                <div className="ck-field">
                  <label className="ck-label" htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" className="ck-input"
                    value={shipping.name} onChange={handleChange}
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                    placeholder="Your full name" />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="ck-grid-2">
                {["email","phone"].map(name => (
                  <div key={name} className="ck-field">
                    <label className="ck-label" htmlFor={name}>{name === "email" ? "Email Address" : "Phone Number"}</label>
                    <input id={name} name={name} type={name === "email" ? "email" : "tel"} className="ck-input"
                      value={shipping[name]} onChange={handleChange}
                      onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
                      placeholder={name === "email" ? "you@example.com" : "+234 000 000 0000"} />
                  </div>
                ))}
              </div>

              {/* Address full */}
              <div className="ck-grid-1">
                <div className="ck-field">
                  <label className="ck-label" htmlFor="address">Street Address</label>
                  <input id="address" name="address" type="text" className="ck-input"
                    value={shipping.address} onChange={handleChange}
                    onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField(null)}
                    placeholder="House number, street name" />
                </div>
              </div>

              {/* City + Zip */}
              <div className="ck-grid-2">
                {["city","zip"].map(name => (
                  <div key={name} className="ck-field">
                    <label className="ck-label" htmlFor={name}>{name === "city" ? "City" : "Postal Code"}</label>
                    <input id={name} name={name} type="text" className="ck-input"
                      value={shipping[name]} onChange={handleChange}
                      onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
                      placeholder={name === "city" ? "Your city" : "Postal code"}
                      inputMode={name === "zip" ? "numeric" : "text"} />
                  </div>
                ))}
              </div>

              {/* State */}
              <div className="ck-grid-1">
                <div className="ck-field">
                  <label className="ck-label" htmlFor="state">State</label>
                  <select id="state" name="state" className="ck-select"
                    value={shipping.state} onChange={handleChange}
                    onFocus={() => setFocusedField("state")} onBlur={() => setFocusedField(null)}>
                    <option value="">Select State</option>
                    {nigeriaStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="ck-grid-1">
                <div className="ck-field">
                  <label className="ck-label" htmlFor="deliveryNotes">Delivery Notes (Optional)</label>
                  <textarea id="deliveryNotes" name="deliveryNotes" className="ck-textarea"
                    value={shipping.deliveryNotes} onChange={handleChange}
                    onFocus={() => setFocusedField("deliveryNotes")} onBlur={() => setFocusedField(null)}
                    placeholder="Any special delivery instructions..." />
                </div>
              </div>
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="ck-summary">
            <div className="ck-card-head" style={{ padding: "24px 24px 0" }}>
              <div className="ck-card-head-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
              </div>
              <span className="ck-card-title">Order Summary</span>
            </div>

            {/* Items */}
            <div className="ck-items">
              {cart.map((item, index) => (
                <div key={index} className="ck-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <img src={item.image} alt={item.name} className="ck-item-img" />
                  <div style={{ minWidth: 0 }}>
                    <p className="ck-item-name">{item.name}</p>
                    <p className="ck-item-meta">
                      {item.color && <span>{item.color}</span>}
                      {item.color && item.size && <span> &middot; </span>}
                      {item.size && <span>{item.size}</span>}
                    </p>
                    <div className="ck-item-actions">
                      <div className="ck-item-qty">
                        <button className="ck-qty-btn"
                          onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}>&#8722;</button>
                        <span className="ck-qty-num">{item.quantity}</span>
                        <button className="ck-qty-btn"
                          onClick={() => updateQuantity(index, item.quantity + 1)}>&#43;</button>
                      </div>
                      <button className="ck-item-remove"
                        onClick={() => handleRemoveItem(item, index)}
                        aria-label="Remove">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="ck-item-price">&#8358;{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="ck-totals">
              <div className="ck-total-row">
                <span>Subtotal</span>
                <span>&#8358;{total.toLocaleString()}</span>
              </div>
              <div className="ck-total-row">
                <span>Shipping</span>
                <span style={{ color: "var(--success)", fontSize: "0.72rem", letterSpacing: "0.05em" }}>
                  Courier will contact you
                </span>
              </div>
              <div className="ck-total-row">
                <span>Tax</span>
                <span>&#8358;0.00</span>
              </div>
              <div className="ck-total-row grand">
                <span className="ck-grand-label">Total</span>
                <span className="ck-grand-val">&#8358;{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* CTA - Two buttons */}
            <div className="ck-cta">
              <button className="ck-place-btn" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <><div className="ck-spinner" /><span>Processing</span></>
                ) : (
                  <>
                    <span>Pay with Paystack</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ position:"relative", zIndex:1 }}>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>

              <button className="ck-wa-btn" onClick={handleWhatsAppOrder} disabled={isWhatsAppProcessing}>
                {isWhatsAppProcessing ? (
                  <><div className="ck-spinner" style={{ borderColor: "#fff", borderTopColor: "transparent" }} /><span>Opening WhatsApp</span></>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>Order via WhatsApp</span>
                  </>
                )}
              </button>

              <div className="ck-secure">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Secure checkout &middot; Encrypted payment &middot; WhatsApp orders
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
