import { useLocation } from "react-router-dom";
import Button from "./Button";

export default function Header({ title, loading }) {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <header className={isAdminPage ? "admin-theme" : "home-theme"}>
      {loading && (
        <div className="loading-overlay">
          <GrUpdate className="spinner" />
        </div>
      )}
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
