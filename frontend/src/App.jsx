import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StreakPage from "./pages/StreakPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Footer from "./components/Footer";

function App() {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <header>
        <h1>Streak Saver</h1>
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StreakPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
