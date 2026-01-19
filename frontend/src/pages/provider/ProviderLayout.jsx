import { Outlet } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import "./providerLayout.css";

const ProviderLayout = () => {
  return (
    <div className="provider-layout">
      <ProviderSidebar />
      <div className="provider-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProviderLayout;
