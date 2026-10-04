import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

import MyAccount from "./pages/MyAccount";
import Orders from "./pages/Orders";
import MyOrderDetails from "./pages/MyOrderDetails";
import OrderTracking from "./pages/OrderTracking";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import OrderManagement from "./pages/OrderManagement";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminUsers from "./pages/AdminUsers";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
return ( <BrowserRouter> <Navbar />

```
  <Routes>

    <Route path="/" element={<Login />} />

    <Route path="/home" element={<Home />} />

    <Route path="/products" element={<Products />} />

    <Route
      path="/products/:id"
      element={<ProductDetails />}
    />

    <Route path="/cart" element={<Cart />} />

    <Route path="/wishlist" element={<Wishlist />} />

    <Route path="/checkout" element={<Checkout />} />

    <Route
      path="/order-success/:id"
      element={
        <CustomerProtectedRoute>
          <OrderConfirmation />
        </CustomerProtectedRoute>
      }
    />

    <Route path="/login" element={<Login />} />

    <Route
      path="/account"
      element={
        <CustomerProtectedRoute>
          <MyAccount />
        </CustomerProtectedRoute>
      }
    />

    <Route
      path="/account/orders"
      element={
        <CustomerProtectedRoute>
          <Orders />
        </CustomerProtectedRoute>
      }
    />

    <Route
      path="/account/orders/:id"
      element={
        <CustomerProtectedRoute>
          <MyOrderDetails />
        </CustomerProtectedRoute>
      }
    />

    <Route
      path="/account/orders/:id/tracking"
      element={
        <CustomerProtectedRoute>
          <OrderTracking />
        </CustomerProtectedRoute>
      }
    />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/products"
      element={
        <ProtectedRoute>
          <AdminProducts />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/orders"
      element={
        <ProtectedRoute>
          <OrderManagement />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/orders/:id"
      element={
        <ProtectedRoute>
          <AdminOrderDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/users"
      element={
        <ProtectedRoute>
          <AdminUsers />
        </ProtectedRoute>
      }
    />

    <Route
      path="*"
      element={<NotFound />}
    />

  </Routes>
</BrowserRouter>


);
}

export default App;
