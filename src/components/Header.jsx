import { useLocation } from "react-router-dom";
import Button from "./Button";

export default function Header({ title }) {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <header className={isAdminPage ? "admin-theme" : "home-theme"}>
      <h1>{title}</h1>
      <Button
        to={isAdminPage ? "/" : "/admin"}
        className={isAdminPage ? "home-btn" : "admin-btn"}
      >
        {isAdminPage ? "Home Page" : "Admin Page"}
      </Button>
    </header>
  );
}
