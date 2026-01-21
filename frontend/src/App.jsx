import { Routes, Route } from "react-router-dom";
import ProviderLayout from "./pages/provider/ProviderLayout";
import ServiceDashboard from "./pages/provider/ServiceDashboard";
import MyServices from "./pages/provider/MyServices";
import AddService from "./pages/provider/AddService";
import ProviderBookings from "./pages/provider/ProviderBookings";

function App() {
  return (
    <Routes>
      <Route element={<ProviderLayout />}>
        <Route index element={<ServiceDashboard />} />
        <Route path="my-services" element={<MyServices />} />
        <Route path="add-service" element={<AddService />} />
        <Route path="bookings" element={<ProviderBookings />} />
      </Route>
    </Routes>
  );
}

export default App;
