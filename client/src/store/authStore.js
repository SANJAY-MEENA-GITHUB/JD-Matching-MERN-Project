import { create } from "zustand";
import api from "../api/axios";

/**
 * useAuthStore - Zustand Store
 * Manages the global authentication state of the application.
 * Persists session data (like JWT tokens, name, email) inside localStorage
 * so that state is maintained even when page refreshes.
 */
export const useAuthStore = create((set) => ({
    // Initialize user state from local storage if existing, otherwise default to null
    user: JSON.parse(localStorage.getItem("user")) || null,
    checkingAuth: true,

    /**
     * Authenticate and save user details
     * @param {Object} data - Contains User profile metadata and active JWT token
     */
    login: (data) => {
        localStorage.setItem("user", JSON.stringify(data)); // Save to local storage for persistence
        set({ user: data });                                 // Update Zustand state
    },

    /**
     * Terminate user session and clear localStorage tokens
     */
    logout: () => {
        localStorage.removeItem("user"); // Clear key from local storage
        localStorage.removeItem("analysisResult"); // Clear cached analysis results
        set({ user: null });             // Set state to null (redirects protected routes to login)
    },

    /**
     * Check auth session using the backend GET /api/auth/me endpoint
     */
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const res = await api.get("/auth/me");
            localStorage.setItem("user", JSON.stringify(res.data.user));
            set({ user: res.data.user, checkingAuth: false });
        } catch (error) {
            localStorage.removeItem("user");
            localStorage.removeItem("analysisResult");
            set({ user: null, checkingAuth: false });
        }
    }
}));