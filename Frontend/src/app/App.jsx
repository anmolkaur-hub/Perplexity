import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useAuth } from "../features/auth/hook/useAuth.js";
import router from "./app.routes.jsx";

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
