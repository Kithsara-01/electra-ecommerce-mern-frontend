import Header from "../components/Header";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function HomePage() {

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user?.role === "Admin") {
      navigate("/admin-dashboard");
    }

    
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  if (user?.role === "Admin") {
    return null;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-primary">
      </main>
    </>
  );
}

export default HomePage;