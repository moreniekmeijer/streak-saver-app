import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StreakPage from "./pages/StreakPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
