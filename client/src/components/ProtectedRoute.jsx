// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";

// const ProtectedRoute = ({ children }) => {
//     const user = useAuthStore((state) => state.user);

//     return user ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "./LoadingPage";

const ProtectedRoute = ({ children }) => {

    const { user, checkingAuth } = useAuthStore();

    // Wait until authentication check finishes
    if (checkingAuth) {
        return (
            <Loading
                title="Checking Session"
                message="Verifying your login..."
            />
        );
    }

    // No valid session
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated
    return children;
};

export default ProtectedRoute;