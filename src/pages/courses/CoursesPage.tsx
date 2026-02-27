import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/api/hooks/courses/course.hooks";
import { useSubCategories } from "@/api/hooks/courses/category.hooks";
import { useInstructors } from "@/api/hooks/instructor/instructor.hooks";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MoreHorizontal, Search, BookOpen, Star, Users, Eye, Layers, Camera, Youtube, Tag, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Course, CourseLevel, CourseStatus, CreateCourseInput } from "@/types/courses/course.types";

const STATUS_COLORS: Record<CourseStatus, string> = {
  DRAFT: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  PUBLISHED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-muted",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useCourses({
    search: debouncedSearch,
    status: statusFilter !== "ALL" ? (statusFilter as CourseStatus) : undefined,
  });
  const deleteCourse = useDeleteCourse();
  const navigate = useNavigate();
  const courses = data?.courses || [];

  return (
    <PageContainer title="Courses" description="Manage your complete course library." actions={<CourseDialog />}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9 bg-card/50 backdrop-blur-sm border-none shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-card/50 border-none shadow-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <CoursesSkeleton /> : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? courses.map((course) => (
                  <TableRow key={course.id} className="group hover:bg-muted/30 transition-colors border-border/30 cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-lg overflow-hidden border bg-muted/50 flex-shrink-0">
                          {course.thumbnail?.secure_url ? <img src={course.thumbnail.secure_url} alt="" className="h-full w-full object-cover" /> : <div className="flex items-center justify-center h-full"><BookOpen className="w-5 h-5 text-muted-foreground/40" /></div>}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{course.title}</span>
                          <span className="text-[10px] text-muted-foreground">{course.level} · {course.language || "English"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs text-muted-foreground">{course.subCategory?.name || "—"}</span></TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">₹{course.price}</span>
                        {course.discountPrice != null && course.discountPrice > 0 && <span className="text-[10px] text-primary line-through opacity-60">₹{course.discountPrice}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course._count?.enrollments || 0} Enrolled</span>
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{course._count?.subjects || 0} Subjects</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={STATUS_COLORS[course.status]}>{course.status.replace("_", " ")}</Badge></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 opacity-50 uppercase tracking-wider">Manage</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)} className="cursor-pointer"><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                          <CourseDialog course={course} mode="edit" />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { if (confirm("Delete this course permanently?")) deleteCourse.mutate(course.id); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"><Trash2 className="w-4 h-4 mr-2" />Delete Course</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="h-48 text-center italic text-muted-foreground bg-muted/10"><div className="flex flex-col items-center space-y-2"><BookOpen className="w-8 h-8 opacity-20" /><p>No courses found</p></div></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

function CourseDialog({ course, mode = "add" }: { course?: Course; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const { data: subCatData } = useSubCategories();
  const subCategories = subCatData?.subCategories || [];
  const { data: instructorData } = useInstructors();
  const allInstructors = instructorData?.instructors || [];
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<CreateCourseInput & { id?: string }>({
    title: course?.title || "",
    shortDescription: course?.shortDescription || "",
    description: course?.description || "",
    subCategoryId: course?.subCategoryId || "",
    price: course?.price || 0,
    discountPrice: course?.discountPrice || 0,
    language: course?.language || "English",
    level: course?.level || "BEGINNER",
    status: course?.status || "DRAFT",
    isFeatured: course?.isFeatured || false,
    durationMonths: course?.durationMonths || 0,
    thumbnail: course?.thumbnail || undefined,
    previewVideo: course?.previewVideo || undefined,
    instructorIds: course?.instructors?.map(i => i.instructor.id) || [],
    tags: course?.tags?.map(t => t.name) || [],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(course?.thumbnail?.secure_url || null);

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...form };
    if (submitData.thumbnail && !(submitData.thumbnail instanceof File)) {
      delete submitData.thumbnail;
    }

    if (mode === "edit" && course) {
      updateCourse.mutate({ id: course.id, ...submitData }, { onSuccess: () => setIsOpen(false) });
    } else {
      createCourse.mutate(submitData as any, { onSuccess: () => setIsOpen(false) });
    }
  };

  const isPending = createCourse.isPending || updateCourse.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105"><Plus className="w-4 h-4 mr-2" />New Course</Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted transition-colors"><Edit className="w-4 h-4 mr-2" />Edit Details</div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "Create New Course" : "Edit Course"}</DialogTitle>
          <DialogDescription>Fill in the course details carefully.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="c-title">Course Title</Label>
            <Input id="c-title" placeholder="e.g. Complete UPSC Preparation" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-short">Short Description</Label>
            <Input id="c-short" placeholder="One-liner about the course" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-desc">Full Description</Label>
            <Textarea id="c-desc" placeholder="Detailed course description…" className="resize-none h-28" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sub-Category</Label>
              <Select value={form.subCategoryId} onValueChange={(v) => set("subCategoryId", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{subCategories.map((sc) => <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => set("level", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label htmlFor="c-price">Price (₹)</Label><Input id="c-price" type="number" value={form.price} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-2"><Label htmlFor="c-dprice">Discount Price</Label><Input id="c-dprice" type="number" value={form.discountPrice} onChange={(e) => set("discountPrice", parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-2"><Label htmlFor="c-dur">Duration (Months)</Label><Input id="c-dur" type="number" value={form.durationMonths} onChange={(e) => set("durationMonths", parseInt(e.target.value) || 0)} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="c-lang">Language</Label><Input id="c-lang" value={form.language} onChange={(e) => set("language", e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ─── THUMBNAIL ─── */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Course Thumbnail</Label>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden group border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors bg-muted/30">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Thumbnail" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
                  <Camera className="w-8 h-8 opacity-20" />
                  <span className="text-xs">No thumbnail selected</span>
                </div>
              )}
              <Label htmlFor="thumb-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20"><Camera className="w-5 h-5 text-white" /></div>
                <Input id="thumb-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { 
                  const f = e.target.files?.[0]; 
                  if (f) {
                    set("thumbnail", f);
                    setThumbnailPreview(URL.createObjectURL(f));
                  } 
                }} />
              </Label>
            </div>
          </div>

          {/* ─── PREVIEW VIDEO (YouTube URL) ─── */}
          <div className="space-y-2">
            <Label htmlFor="c-preview" className="flex items-center gap-1.5"><Youtube className="w-4 h-4 text-red-500" />Preview Video (YouTube URL)</Label>
            <Input id="c-preview" placeholder="https://www.youtube.com/watch?v=..." value={form.previewVideo?.url || ""} onChange={(e) => set("previewVideo", { url: e.target.value, publicId: "youtube", duration: 0 })} />
            {form.previewVideo?.url && form.previewVideo.url.includes("youtu") && (
              <p className="text-[10px] text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" />YouTube link detected</p>
            )}
          </div>

          {/* ─── INSTRUCTORS ─── */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary/60" />Assign Instructors</Label>
            <div className="flex flex-wrap gap-2 p-2 min-h-[40px] rounded-lg border bg-card/50">
              {form.instructorIds?.map((iId) => {
                const inst = allInstructors.find(i => i.id === iId);
                return inst ? (
                  <Badge key={iId} variant="outline" className="pl-1 pr-0.5 flex items-center gap-1 bg-primary/5">
                    <Avatar className="h-4 w-4"><AvatarImage src={inst.avatar?.secure_url} /><AvatarFallback className="text-[8px]">{inst.name?.charAt(0)}</AvatarFallback></Avatar>
                    <span className="text-xs">{inst.name}</span>
                    <button type="button" className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/20" onClick={() => set("instructorIds", form.instructorIds?.filter(x => x !== iId))}><X className="w-3 h-3" /></button>
                  </Badge>
                ) : null;
              })}
            </div>
            <Select onValueChange={(v) => { if (!form.instructorIds?.includes(v)) set("instructorIds", [...(form.instructorIds || []), v]); }}>
              <SelectTrigger className="text-xs h-8"><SelectValue placeholder="Select instructor to add…" /></SelectTrigger>
              <SelectContent>
                {allInstructors.filter(i => !form.instructorIds?.includes(i.id)).map(i => (
                  <SelectItem key={i.id} value={i.id}>{i.name} — {i.specialization || "General"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ─── TAGS ─── */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary/60" />Tags</Label>
            <div className="flex flex-wrap gap-1.5 p-2 min-h-[32px] rounded-lg border bg-card/50">
              {form.tags?.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs">
                  {tag}
                  <button type="button" className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/20" onClick={() => set("tags", form.tags?.filter((_, i) => i !== idx))}><X className="w-2.5 h-2.5" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input className="flex-1 h-8 text-xs" placeholder="Type a tag and press Add" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { set("tags", [...(form.tags || []), tagInput.trim()]); setTagInput(""); } } }} />
              <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => { if (tagInput.trim()) { set("tags", [...(form.tags || []), tagInput.trim()]); setTagInput(""); } }}>Add</Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch checked={form.isFeatured} onCheckedChange={(c) => set("isFeatured", c)} />
            <Label className="text-sm font-medium">Featured Course</Label>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold" disabled={isPending}>{isPending ? "Saving..." : mode === "add" ? "Create Course" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CoursesSkeleton() {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card/50">
      <div className="h-12 w-full bg-muted/40 animate-pulse" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex p-4 border-t border-muted/20 gap-4 items-center">
          <Skeleton className="h-12 w-16 rounded-lg" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-[50%]" /><Skeleton className="h-3 w-[25%]" /></div>
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>
      ))}
    </Card>
  );
}
