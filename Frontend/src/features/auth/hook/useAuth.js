import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  logout,
} from "../service/auth.api.js";
import { setUser, setLoading, setError, clearError } from "../auth.slice.js";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister(credentials) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await register(credentials);
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed";
      dispatch(setError(message));
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin(credentials) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await login(credentials);
      dispatch(setUser(data.user));
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch(setError(message));
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
      return true;
    } catch {
      dispatch(setUser(null));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Clear local state even if the server cookie is already gone.
    } finally {
      dispatch(setUser(null));
      dispatch(clearError());
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}
