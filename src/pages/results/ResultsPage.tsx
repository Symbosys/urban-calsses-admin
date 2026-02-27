import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useResults, useCreateResult, useUpdateResult, useDeleteResult } from "@/api/hooks/result/result.hooks";
import { useCategories } from "@/api/hooks/courses/category.hooks";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MoreHorizontal, Search, Trophy, Star, GraduationCap, Camera, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Result, CreateResultInput } from "@/types/results/result.types";

export default function ResultsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useResults({
    studentName: debouncedSearch,
    categoryId: categoryFilter !== "ALL" ? categoryFilter : undefined,
  });

  const { data: catData } = useCategories();
  const categories = catData?.categories || [];
  const deleteResult = useDeleteResult();
  const results = data?.results || [];

  return (
    <PageContainer title="Results" description="Manage student achievement records and toppers." actions={<ResultDialog />}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9 bg-card/50 backdrop-blur-sm border-none shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 bg-card/50 border-none shadow-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <ResultsSkeleton /> : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Student</TableHead>
                  <TableHead>Exam & Rank</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length > 0 ? results.map((result) => (
                  <TableRow key={result.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/10">
                          <AvatarImage src={result.image?.secure_url} alt={result.studentName} />
                          <AvatarFallback className="bg-primary/5 text-primary text-[10px] uppercase font-bold">{result.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground truncate">{result.studentName}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {result.college || "School/College Not Specified"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" /> AIR {result.rank}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{result.examName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-bold text-[10px]">{result.year}</Badge>
                    </TableCell>
                    <TableCell>
                      {result.isFeatured ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 gap-1">
                          <Star className="w-3 h-3 fill-amber-500" /> Featured
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 opacity-50 uppercase tracking-wider">Manage</DropdownMenuLabel>
                          <ResultDialog result={result} mode="edit" />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { if (confirm("Delete this result record?")) deleteResult.mutate(result.id); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" />Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center italic text-muted-foreground bg-muted/10">
                      <div className="flex flex-col items-center space-y-2">
                        <Trophy className="w-8 h-8 opacity-20" />
                        <p>No results found</p>
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

function ResultDialog({ result, mode = "add" }: { result?: Result; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createResult = useCreateResult();
  const updateResult = useUpdateResult();
  const { data: catData } = useCategories();
  const categories = catData?.categories || [];

  const [form, setForm] = useState<CreateResultInput>({
    studentName: result?.studentName || "",
    rank: result?.rank || "",
    examName: result?.examName || "",
    year: result?.year || new Date().getFullYear(),
    college: result?.college || "",
    quote: result?.quote || "",
    isFeatured: result?.isFeatured || false,
    categoryId: result?.categoryId || "",
    image: result?.image || undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(result?.image?.secure_url || null);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a copy of form to handle image
    // If image is still the same object from DB, don't send it to avoid FormData issues
    const submitData = { ...form };
    if (submitData.image && !(submitData.image instanceof File)) {
      delete submitData.image;
    }

    if (mode === "edit" && result) {
      updateResult.mutate({ id: result.id, ...submitData }, { onSuccess: () => setIsOpen(false) });
    } else {
      createResult.mutate(submitData, { onSuccess: () => setIsOpen(false) });
    }
  };

  const isPending = createResult.isPending || updateResult.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />Add Result
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted transition-colors">
            <Edit className="w-4 h-4 mr-2" />Edit Record
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "New Achievement" : "Edit Achievement"}</DialogTitle>
          <DialogDescription>Add or update student rank information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="s-name">Student Name</Label>
              <Input id="s-name" placeholder="Full name" value={form.studentName} onChange={(e) => set("studentName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-name">Examination</Label>
              <Input id="exam-name" placeholder="e.g. JEE Advanced" value={form.examName} onChange={(e) => set("examName", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rank">AIR / Rank Score</Label>
              <div className="relative">
                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input id="rank" className="pl-9" placeholder="e.g. 142" value={form.rank} onChange={(e) => set("rank", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" value={form.year} onChange={(e) => set("year", parseInt(e.target.value) || new Date().getFullYear())} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Result Category</Label>
            <Select value={form.categoryId || ""} onValueChange={(v) => set("categoryId", v)}>
              <SelectTrigger><SelectValue placeholder="Select examination category" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">School / Allocated College</Label>
            <Input id="college" placeholder="e.g. IIT Delhi / DPS" value={form.college || ""} onChange={(e) => set("college", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Inspiration Quote</Label>
            <Textarea id="quote" placeholder="A short testimonial from the topper..." className="resize-none h-20" value={form.quote || ""} onChange={(e) => set("quote", e.target.value)} />
          </div>

          {/* ─── IMAGE UPLOAD ─── */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student Photo</Label>
            <div className="relative aspect-square w-32 mx-auto rounded-3xl overflow-hidden group border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors bg-muted/30">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Student" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-1 text-muted-foreground text-[8px] text-center p-2">
                  <Camera className="w-6 h-6 opacity-20" />
                  <span>Choose Photo</span>
                </div>
              )}
              <Label htmlFor="s-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Plus className="w-6 h-6 text-white" />
                <Input id="s-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { 
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
            <Switch checked={form.isFeatured} onCheckedChange={(c) => set("isFeatured", c)} />
            <div className="flex flex-col">
              <Label className="text-sm font-medium">Featured Achievement</Label>
              <p className="text-[10px] text-muted-foreground tracking-tight">Showcase this topper in the Hall of Fame carousel.</p>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold" disabled={isPending}>
              {isPending ? "Syncing..." : mode === "add" ? "Create Record" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResultsSkeleton() {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card/50">
      <div className="h-12 w-full bg-muted/40 animate-pulse" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex p-4 border-t border-muted/20 gap-4 items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/4" /></div>
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-8 w-8 rounded-full ml-auto" />
        </div>
      ))}
    </Card>
  );
}
