import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useBanners, 
  useCreateBanner, 
  useUpdateBanner, 
  useDeleteBanner 
} from "@/api/hooks/admin/banner.hooks";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Image as ImageIcon,
  ExternalLink,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Camera
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Banner, CreateBannerInput } from "@/types/admin/banner.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function BannersPage() {
  const { data, isLoading } = useBanners();
  const deleteBanner = useDeleteBanner();
  const updateBanner = useUpdateBanner();

  const banners = data?.banners || [];

  return (
    <PageContainer 
      title="Banners" 
      description="Manage homepage sliders and promotional banners."
      actions={<BannerDialog />}
    >
      {isLoading ? (
        <BannersSkeleton />
      ) : (
        <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <TableRow key={banner.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="relative h-12 w-20 rounded-md overflow-hidden border border-border/50 bg-muted/50">
                        {banner.image?.secure_url ? (
                          <img 
                            src={banner.image.secure_url} 
                            alt={banner.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {banner.title}
                        </span>
                        {banner.link && (
                          <a 
                            href={banner.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-primary/70 flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> {banner.link}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{banner.order}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Switch 
                           checked={banner.isActive}
                           onCheckedChange={(checked) => updateBanner.mutate({ id: banner.id, isActive: checked })}
                           className="scale-75 data-[state=checked]:bg-emerald-500"
                         />
                         {banner.isActive ? (
                           <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Visible</span>
                         ) : (
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hidden</span>
                         )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 opacity-50 uppercase tracking-wider">Management</DropdownMenuLabel>
                          <BannerDialog banner={banner} mode="edit" />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this banner?")) {
                                deleteBanner.mutate(banner.id);
                              }
                            }}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Banner
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={5} className="h-48 text-center italic text-muted-foreground bg-muted/10">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                        <p>No banners uploaded yet</p>
                      </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </PageContainer>
  );
}

/**
 * --- BANNER DIALOG ---
 */
function BannerDialog({ banner, mode = "add" }: { banner?: Banner, mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();

   const [formData, setFormData] = useState<CreateBannerInput>({
     title: banner?.title || "",
     link: banner?.link || "",
     order: banner?.order || 0,
     isActive: banner?.isActive ?? true,
     image: banner?.image || undefined
   });
 
   const [imagePreview, setImagePreview] = useState<string | null>(banner?.image?.secure_url || null);
 
   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       setFormData(p => ({ ...p, image: file }));
       setImagePreview(URL.createObjectURL(file));
     }
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     const submitData = { ...formData };
     if (submitData.image && !(submitData.image instanceof File)) {
       delete submitData.image;
     }

     if (mode === "edit" && banner) {
       updateBanner.mutate({ id: banner.id, ...submitData }, { onSuccess: () => setIsOpen(false) });
     } else {
       createBanner.mutate(submitData as any, { onSuccess: () => setIsOpen(false) });
     }
   };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Add Banner
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted outline-none transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Banner
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "Upload Banner" : "Edit Banner"}</DialogTitle>
          <DialogDescription>
            Banners will be displayed on the homepage slider.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Banner Image</Label>
             <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden group border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors bg-muted/30">
               {imagePreview ? (
                 <img 
                   src={imagePreview} 
                   className="w-full h-full object-cover" 
                   alt="Banner Preview" 
                 />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
                  <ImageIcon className="w-10 h-10 opacity-20" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}
              <Label 
                htmlFor="banner-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <Input 
                  id="banner-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-title">Title / Headline</Label>
              <Input 
                id="banner-title" 
                placeholder="e.g. Summer Sale - 50% Off"
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-link">Target Link (Optional)</Label>
              <Input 
                id="banner-link" 
                placeholder="https://example.com/courses"
                value={formData.link}
                onChange={(e) => setFormData(p => ({ ...p, link: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner-order">Sort Order</Label>
                <Input 
                  id="banner-order" 
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-active">Active Status</Label>
                <div className="flex items-center h-10 gap-3">
                  <Switch 
                    id="banner-active" 
                    checked={formData.isActive} 
                    onCheckedChange={(c) => setFormData(p => ({ ...p, isActive: c }))} 
                  />
                  <span className="text-sm font-medium">{formData.isActive ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button 
                type="submit" 
                className="flex-1 shadow-lg shadow-primary/20 font-bold"
                disabled={createBanner.isPending || updateBanner.isPending}
            >
              {createBanner.isPending || updateBanner.isPending ? "Uploading..." : (mode === "add" ? "Publish Banner" : "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * --- LOADER ---
 */
function BannersSkeleton() {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card/50">
      <div className="h-12 w-full bg-muted/40 animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex p-4 border-t border-muted/20 gap-4">
          <Skeleton className="h-12 w-20 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-3 w-[20%]" />
          </div>
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      ))}
    </Card>
  );
}
