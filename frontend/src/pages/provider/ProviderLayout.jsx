import { Outlet } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import "./providerLayout.css"; // optional, if you have styles

function ProviderLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* MENU BAR */}
      <ProviderSidebar />

      {/* PAGE CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default ProviderLayout;
