import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  GraduationCap,
  ShoppingCart,
  Image,
  Ticket,
  Star,
  ChevronRight,
  Menu,
  Trophy,
  MapPin,
  Newspaper,
  Calendar,
  ClipboardList,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import logo from "@/asser/Urban Classes Logo - 1 (1).png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: Layers, label: "Categories", path: "/categories" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: GraduationCap, label: "Instructors", path: "/instructors" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: Image, label: "Banners", path: "/banners" },
  { icon: Ticket, label: "Coupons", path: "/coupons" },
  { icon: Star, label: "Reviews", path: "/reviews" },
  { icon: Trophy, label: "Results", path: "/results" },
  { icon: MapPin, label: "Offline Centers", path: "/offline-centers" },
  { icon: Calendar, label: "Offline Batches", path: "/offline-batches" },
  { icon: ClipboardList, label: "Offline Bookings", path: "/offline-bookings" },
  { icon: Newspaper, label: "Blogs", path: "/blogs" },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar h-screen transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
             <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src={logo} alt="UC" className="w-full h-full object-contain" />
             </div>
             <span className="font-bold text-xl tracking-tight whitespace-nowrap">Urban Classes</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </>
              )}
              {isCollapsed && (
                 <div className="fixed left-20 bg-popover text-popover-foreground px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] ml-2 whitespace-nowrap border border-border">
                    {item.label}
                 </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto space-y-2">
         <div className="bg-sidebar-accent/50 p-4 rounded-2xl flex items-center justify-between border border-sidebar-border/50 overflow-hidden group/user">
            {!isCollapsed ? (
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 font-bold text-primary shrink-0 uppercase">
                      {useAuthStore.getState().user?.name?.[0] || 'A'}
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate leading-none mb-1 text-sidebar-foreground">
                        {useAuthStore.getState().user?.name || "Admin Panel"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate italic">
                        {useAuthStore.getState().user?.email || "System Admin"}
                      </p>
                   </div>
                </div>
            ) : (
                <div className="flex justify-center w-full">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 font-bold text-primary uppercase">
                      {useAuthStore.getState().user?.name?.[0] || 'A'}
                   </div>
                </div>
            )}
         </div>
         
         <button
           onClick={() => { if(confirm("Are you sure you want to logout?")) useAuthStore.getState().logout(); }}
           className={cn(
             "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-sm font-medium text-destructive hover:bg-destructive/10",
             isCollapsed && "justify-center"
           )}
         >
           <LogOut size={20} className="shrink-0" />
           {!isCollapsed && <span className="truncate">Logout</span>}
           {isCollapsed && (
              <div className="fixed left-20 bg-destructive text-white px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] ml-2 whitespace-nowrap border border-destructive/20">
                 Logout
              </div>
           )}
         </button>
      </div>
    </aside>
  );
}
