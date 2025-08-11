import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header title="Flightnode Home" />
              <HomePage />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Header title="Flightnode Admin" />
              <AdminPage />
            </>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}
