import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppRoutes } from "@/routes/AppRoutes";
import "./index.css";
import { Toaster } from "sonner";

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="urban-classes-admin-theme">
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
