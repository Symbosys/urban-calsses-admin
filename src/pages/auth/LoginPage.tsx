import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAdminLogin } from "@/api/hooks/user/auth.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, ArrowRight, Loader2, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const login = useAdminLogin();

  if (isAuthenticated && user?.account?.role === "ADMIN") {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05080e] relative overflow-hidden px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <Card className="max-w-[420px] w-full border-none shadow-2xl bg-[#0a0f18]/80 backdrop-blur-3xl z-10 p-2">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 border border-primary/20">
             <ShieldCheck className="w-9 h-9 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-white uppercase italic">Admin Access</CardTitle>
          <CardDescription className="text-muted-foreground/80 italic">
            Secure authentication for the Urban Classes Management Terminal.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-8">
          <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Administrator Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      id="email"
                      placeholder="admin@urbanclasses.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/40 border-white/5 focus:border-primary/50 pl-11 h-14 rounded-2xl text-white transition-all text-base placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Confidential Password</Label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      id="password"
                      placeholder="••••••••" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/40 border-white/5 focus:border-primary/50 pl-11 h-14 rounded-2xl text-white transition-all text-base placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>

                <Button 
                   className="w-full h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                   disabled={login.isPending}
                >
                  {login.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Secure Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
          </form>
        </CardContent>
      </Card>

      <div className="absolute bottom-8 left-0 right-0 text-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Advanced Encryption • Terminal v1.0.4</p>
      </div>
    </div>
  );
}
