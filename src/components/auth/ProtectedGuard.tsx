import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedGuardProps {
  children: React.ReactNode;
}

export function ProtectedGuard({ children }: ProtectedGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect they to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // back to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure the user actually has administrative privileges
  const isAdmin = user?.account?.role === "ADMIN";

  if (!isAdmin) {
    // If authenticated but not an admin, they shouldn't be here.
    // For now, let's just clear auth and send them to login with an error message
    // (In a real app, you might show a "Not Authorized" page instead)
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background space-y-4 px-6 text-center">
        <div className="p-4 bg-destructive/10 rounded-full">
           <svg className="w-12 h-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <h1 className="text-2xl font-black">Restricted Access</h1>
        <p className="max-w-md text-muted-foreground leading-relaxed italic">
          Your account does not have administrative permissions to access this portal. 
          Please contact the system administrator if you believe this is an error.
        </p>
        <button 
           onClick={() => useAuthStore.getState().logout()}
           className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          Sign Out & Return Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
