import { useState } from "react";
import Login from "./components/Login";
import Registration from "./components/Registration";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <Login switchToRegister={() => setShowLogin(false)} />
  ) : (
    <Registration switchToLogin={() => setShowLogin(true)} />
  );
}

export default App;
