import React from 'react'
import { Routes, Route } from 'react-router-dom';
import UserLanding from "./user/UserLanding.jsx";
import UserHome from "./user/UserHome.jsx";
import Login from "./auth/Login.jsx";
import Signup from "./auth/Signup.jsx";
import ProviderHome from "./provider/ProviderHome.jsx";
import ProviderProfile from "./provider/ProviderProfile.jsx";
import ServiceDetails from "./user/ServiceDetails.jsx";
import Cart from "./user/Cart.jsx";
import Profile from "./user/Profile.jsx";
import Orders from "./user/Orders.jsx";
import OrderDetails from "./user/OrderDetails.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import './App.css'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user/home" element={<UserHome />} />
      <Route path="/user/cart" element={<Cart />} />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/user/orders" element={<Orders />} />
      <Route path="/user/orders/:id" element={<OrderDetails />} />
      <Route path="/provider/home" element={<ProviderHome />} />
      <Route path="/provider/profile" element={<ProviderProfile />} />
      <Route path="/service/:id" element={<ServiceDetails />} />
    </Routes>
  )
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </UserProvider>
  )
}

export default App;
