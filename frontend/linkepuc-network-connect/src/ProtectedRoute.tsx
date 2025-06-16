import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfessor?: boolean;
  requireStudent?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireProfessor = false,
  requireStudent = false
}) => {
  const token = localStorage.getItem("token");
  const isStudent = localStorage.getItem("isStudent") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfessor && isStudent) {
    return <Navigate to="/" replace />;
  }

  if (requireStudent && !isStudent) {
    return <Navigate to="/professor/dashboard" replace />;
  }

  return <>{children}</>;
};