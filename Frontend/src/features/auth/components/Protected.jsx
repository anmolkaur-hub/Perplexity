import { Navigate } from "react-router";
import { useSelector } from "react-redux";

export default function Protected({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
