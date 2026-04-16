import { Moon, Sun, Bell, Search } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore(state => state.user);

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
           <Input 
             placeholder="Search anything..." 
             className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full transition-all duration-300 w-full max-w-[300px] focus:max-w-full" 
           />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative group">
          <Bell size={20} className="group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="group"
        >
          {theme === "dark" ? (
            <Sun size={20} className="group-hover:text-amber-400 transition-colors" />
          ) : (
            <Moon size={20} className="group-hover:text-indigo-500 transition-colors" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="h-8 w-[1px] bg-border mx-2" />
        
        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Super Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-600 border-2 border-background shadow-sm shrink-0 flex items-center justify-center font-bold text-white text-xs uppercase">
              {user?.name?.[0] || 'A'}
            </div>
        </div>
      </div>
    </header>
  );
}
