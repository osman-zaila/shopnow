import { Navigate } from "react-router-dom";

function CustomerProtectedRoute({ children }) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (user.role !== "CUSTOMER") {
      return <Navigate to="/home" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

export default CustomerProtectedRoute;