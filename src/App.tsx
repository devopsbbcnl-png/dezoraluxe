import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Loader2 } from "lucide-react";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const Collections = lazy(() => import("./pages/Collections"));
const Accessories = lazy(() => import("./pages/Accessories"));
const About = lazy(() => import("./pages/About"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const AllCategories = lazy(() => import("./pages/AllCategories"));
const AllProducts = lazy(() => import("./pages/AllProducts"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Favorites = lazy(() => import("./pages/Favorites"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const AccountProfile = lazy(() => import("./pages/AccountProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/collections/:categoryName" element={<CollectionDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={<AccountProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
