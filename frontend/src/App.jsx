import { Routes, Route } from 'react-router-dom';
import UserLanding from "./user/UserLanding";
import UserHome from "./user/UserHome";
import Login from "./auth/Login";
import ProviderHome from "./provider/ProviderHome";
import ServiceDetails from "./user/ServiceDetails";
import Cart from "./user/Cart";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<UserLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/provider/home" element={<ProviderHome />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
        </Routes>
      </CartProvider>
    </UserProvider>
  )
}

export default App
