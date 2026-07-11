import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import AnalyzeResult from "./pages/AnalyzeResult";

import Resources from "./pages/Resources";
import TechnicalQuestions from "./pages/TechnicalQuestions";
import BehavioralQuestions from "./pages/BehavioralQuestions";
import PreparationPlan from "./pages/PreparationPlan";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

/**
 * App Component
 * Defines the main routing structure for the application.
 * Utilizes React Router DOM to split routes into public auth pages
 * and protected dashboard sections requiring active session tokens.
 */
function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>

      {/* ✅ PUBLIC ROUTES: Accessible to anyone (unauthenticated users) */}
      {/* Login Page: Allows users to sign in and generate auth tokens */}
      <Route path="/login" element={<Login />} />

      {/* Signup Page: Allows new users to register an account */}
      <Route path="/signup" element={<Signup />} />

      {/* 🔒 PROTECTED ROUTES: Wrapped in ProtectedRoute to block unauthorized access */}
      {/* Dashboard: Shows user history of resume analyses */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* New Analysis: Upload resumes and initiate match analysis */}
      <Route
        path="/new-analysis"
        element={
          <ProtectedRoute>
            <NewAnalysis />
          </ProtectedRoute>
        }
      />

      {/* Analysis Result: Displays match gauges, skill gap maps, and recommendations */}
      <Route
        path="/analysis-result"
        element={
          <ProtectedRoute>
            <AnalyzeResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        }
      />

      <Route
        path="/behavioralQues"
        element={
          <ProtectedRoute>
            <BehavioralQuestions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plan"
        element={
          <ProtectedRoute>
            <PreparationPlan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/technicalQues"
        element={
          <ProtectedRoute>
            <TechnicalQuestions />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
