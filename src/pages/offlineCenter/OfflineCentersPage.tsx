import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useOfflineCenters, 
  useCreateOfflineCenter, 
  useUpdateOfflineCenter, 
  useDeleteOfflineCenter 
} from "@/api/hooks/offlineCenter/offlineCenter.hooks";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Edit, Trash2, MoreHorizontal, Search, 
  MapPin, Phone, Mail, Globe, Camera, X, 
  CheckCircle2, XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { OfflineCenter, CreateOfflineCenterInput } from "@/types/offlineCenter/offlineCenter.types";

export default function OfflineCentersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useOfflineCenters({
    city: debouncedSearch || undefined,
    isActive: statusFilter === "ACTIVE" ? true : statusFilter === "INACTIVE" ? false : undefined,
  });

  const centers = data?.centers || [];
  const deleteCenter = useDeleteCenter(); // Wait, the hook name in hooks.ts is useDeleteOfflineCenter

  return (
    <PageContainer 
      title="Offline Centers" 
      description="Manage physical learning centers and Vidyapeeth locations." 
      actions={<OfflineCenterDialog />}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by city..." 
              className="pl-9 bg-card/50 backdrop-blur-sm border-none shadow-sm" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-card/50 border-none shadow-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active Only</SelectItem>
              <SelectItem value="INACTIVE">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <CentersSkeleton /> : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Center Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centers.length > 0 ? centers.map((center) => (
                  <TableRow key={center.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border bg-muted/50 overflow-hidden shrink-0">
                          {center.image?.secure_url ? (
                            <img src={center.image.secure_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                              <MapPin size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{center.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Priority: {center.order}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit text-[10px] font-bold uppercase py-0">{center.city}</Badge>
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{center.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {center.phone && <span className="text-xs flex items-center gap-1.5"><Phone size={12} className="text-primary/60" /> {center.phone}</span>}
                        {center.email && <span className="text-xs flex items-center gap-1.5"><Mail size={12} className="text-primary/60" /> {center.email}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {center.isActive ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 py-0.5">
                          <CheckCircle2 size={12} /> Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20 gap-1.5 py-0.5">
                          <XCircle size={12} /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1">
                          <DropdownMenuLabel className="text-[10px] font-bold px-2 py-2 opacity-50 uppercase tracking-[0.2em]">Manage Center</DropdownMenuLabel>
                          <OfflineCenterDialog center={center} mode="edit" />
                          {center.locationUrl && (
                            <DropdownMenuItem onClick={() => window.open(center.locationUrl || "", "_blank")} className="cursor-pointer">
                              <Globe className="w-4 h-4 mr-2 text-blue-500" /> View on Map
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { if (confirm("Remove this offline center?")) deleteCenter.mutate(center.id); }} 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Center
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center italic text-muted-foreground bg-muted/10">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                          <MapPin size={24} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">No centers found in this location</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

// Internal Hook Proxy due to naming inconsistency in my thought vs hook
function useDeleteCenter() {
  return useDeleteOfflineCenter();
}

function OfflineCenterDialog({ center, mode = "add" }: { center?: OfflineCenter; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createCenter = useCreateOfflineCenter();
  const updateCenter = useUpdateOfflineCenter();

  const [form, setForm] = useState<CreateOfflineCenterInput>({
    name: center?.name || "",
    city: center?.city || "",
    address: center?.address || "",
    phone: center?.phone || "",
    email: center?.email || "",
    locationUrl: center?.locationUrl || "",
    isActive: center?.isActive ?? true,
    order: center?.order || 0,
    image: center?.image || undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(center?.image?.secure_url || null);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a copy of form to handle image
    const submitData = { ...form };
    if (submitData.image && !(submitData.image instanceof File)) {
      delete submitData.image;
    }

    if (mode === "edit" && center) {
      updateCenter.mutate({ id: center.id, ...submitData }, { onSuccess: () => setIsOpen(false) });
    } else {
      createCenter.mutate(submitData, { onSuccess: () => setIsOpen(false) });
    }
  };

  const isPending = createCenter.isPending || updateCenter.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> New Center
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-2 text-sm cursor-pointer hover:bg-muted transition-colors rounded-sm">
            <Edit className="w-4 h-4 mr-2 text-primary" /> Edit Details
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">{mode === "add" ? "Register New Center" : "Edit Center Info"}</DialogTitle>
          <DialogDescription className="text-xs">Provide accurate location and contact details for the center.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-6">
          <div className="space-y-2">
            <Label htmlFor="c-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Center Name</Label>
            <Input id="c-name" placeholder="e.g. Pune Vidyapeeth - Deccan Branch" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="c-city" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City</Label>
              <Input id="c-city" placeholder="e.g. Pune" value={form.city} onChange={(e) => set("city", e.target.value)} required />
            </div>
            <div className="space-y-2">
               <Label htmlFor="c-order" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Priority (Order)</Label>
               <Input id="c-order" type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="c-addr" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Complete Address</Label>
            <Textarea 
              id="c-addr" 
              placeholder="Building name, landmark, area, pincode..." 
              className="resize-none h-24" 
              value={form.address} 
              onChange={(e) => set("address", e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="c-phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="c-phone" className="pl-9" placeholder="+91 98XXX XXXXX" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="c-email" className="pl-9" type="email" placeholder="kota@urbanclasses.com" value={form.email || ""} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="c-loc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Google Maps URL</Label>
            <div className="relative">
               <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input id="c-loc" className="pl-9" placeholder="https://maps.google.com/..." value={form.locationUrl || ""} onChange={(e) => set("locationUrl", e.target.value)} />
            </div>
          </div>

          {/* ─── IMAGE UPLOAD ─── */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Center Exterior / Entrance Photo</Label>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden group border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors bg-muted/30">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Center" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
                  <Camera className="w-8 h-8 opacity-20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
                </div>
              )}
              <Label htmlFor="c-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20"><Plus className="w-6 h-6 text-white" /></div>
                <Input id="c-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { 
                  const f = e.target.files?.[0]; 
                  if (f) {
                    set("image", f);
                    setImagePreview(URL.createObjectURL(f));
                  }
                }} />
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch checked={form.isActive} onCheckedChange={(c) => set("isActive", c)} />
            <div className="flex flex-col">
              <Label className="text-sm font-semibold">Mark as Operationally Active</Label>
              <p className="text-[10px] text-muted-foreground italic">If inactive, the center won't show on the public website.</p>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold rounded-xl" disabled={isPending}>
              {isPending ? "Syncing Data..." : mode === "add" ? "Create Center" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CentersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 border-none shadow-sm bg-card/50">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
