import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ───────────────── CART ─────────────────
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ───────────────── WISHLIST ─────────────────
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ───────────────── ADD TO CART ─────────────────
  const addToCart = (product) => {
    const quantityToAdd = product.quantity || 1;
    
    // ✅ Ensure we have both id and _id for compatibility
    const productWithId = {
      ...product,
      id: product._id || product.id,
      _id: product._id || product.id,
    };

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          (item.id === productWithId.id || item._id === productWithId._id) &&
          item.color === productWithId.color &&
          item.size === productWithId.size
      );

      if (existing) {
        return prev.map((item) =>
          (item.id === productWithId.id || item._id === productWithId._id) &&
          item.color === productWithId.color &&
          item.size === productWithId.size
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prev, { ...productWithId, quantity: quantityToAdd }];
    });

    toast.success("Added to cart", {
      style: {
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #86efac",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        padding: "12px 20px",
      },
      icon: "✓",
    });
  };

  // ───────────────── WISHLIST LOGIC ─────────────────
  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    
    setWishlist((prev) => {
      const exists = prev.some((item) => (item._id || item.id) === productId);
      let updated;

      if (exists) {
        updated = prev.filter((item) => (item._id || item.id) !== productId);
      } else {
        updated = [...prev, product];
      }

      return updated;
    });

    const exists = wishlist.some((item) => (item._id || item.id) === productId);

    if (exists) {
      toast.info("Removed from wishlist", { icon: "♡" });
    } else {
      toast.success("Added to wishlist", { icon: "♥" });
    }
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => (item._id || item.id) === id);
  };

  // ───────────────── CART HELPERS ─────────────────
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);