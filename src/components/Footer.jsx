import { useLocation } from "react-router-dom";
import reactLogo from "../assets/icons/react.svg";
import viteLogo from "../assets/icons/vite.svg";

export default function Footer() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <footer className={isAdminPage ? "admin-theme" : "home-theme"}>
      <img src={viteLogo} alt="Vite logo" className="footer-logo" />
      <h2>Vite + React</h2>
      <img src={reactLogo} alt="React logo" className="footer-logo" />
    </footer>
  );
}
