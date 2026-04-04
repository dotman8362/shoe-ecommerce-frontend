import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import FloneNavbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./components/ProductDetail";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/CheckOut";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SuccessPage from "./components/SucessPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OurBlog from "./components/OurBlog";
import BlogDetails from "./components/BlogDetails";
import SupportPolicy from "./pages/SupportPolicy";
import FAQ from "./pages/FAQ";
import Collections from "./pages/Collection";
import WishlistPage from "./pages/WishList";
import TestimonialsPage from "./pages/Testimonial";
import AddEditPost from "./admin/AddEditPost";
import LoadingSpinner from "./components/LoadingSpinner";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const initializeApp = async () => {
      // You can add any initial data fetching here
      // For example: fetching products, checking auth, etc.
      
      // Minimum loading time for better UX (optional)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoading(false);
    };

    initializeApp();
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        {/* Show spinner while loading */}
        <LoadingSpinner isLoading={loading} />
        
        {/* Main app content - hidden until loaded */}
        <div style={{ 
          opacity: loading ? 0 : 1, 
          transition: "opacity 0.5s ease-in-out",
          visibility: loading ? "hidden" : "visible"
        }}>
          <FloneNavbar />
          <ToastContainer position="top-right" autoClose={2000} />

          <Routes>
            {/* USER ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<OurBlog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/support-policy" element={<SupportPolicy />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection" element={<Collections />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
             <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* ADMIN ROUTES */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/add-post" element={<AddEditPost />} />
            <Route path="/admin/edit-post/:id" element={<AddEditPost />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
