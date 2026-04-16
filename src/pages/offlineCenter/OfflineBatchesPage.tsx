import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useOfflineBatches, 
  useCreateOfflineBatch, 
  useUpdateOfflineBatch, 
  useDeleteOfflineBatch 
} from "@/api/hooks/offlineCenter/offlineBatch.hooks";
import { useOfflineCenters } from "@/api/hooks/offlineCenter/offlineCenter.hooks";
import { useCourses } from "@/api/hooks/courses/course.hooks";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Edit, Trash2, MoreHorizontal,
  Calendar, Clock, Users, BookOpen, MapPin,
  CheckCircle2, XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { OfflineBatch, CreateOfflineBatchInput } from "@/types/offlineCenter/offlineBatch.types";

export default function OfflineBatchesPage() {
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [centerFilter, setCenterFilter] = useState<string>("ALL");

  const { data: batchesData, isLoading } = useOfflineBatches({
    courseId: courseFilter === "ALL" ? undefined : courseFilter,
    centerId: centerFilter === "ALL" ? undefined : centerFilter,
  });

  const { data: centersData } = useOfflineCenters();
  const { data: coursesData } = useCourses({ limit: 100 });

  const batches = batchesData?.batches || [];
  const centers = centersData?.centers || [];
  const courses = coursesData?.courses || [];

  const deleteBatch = useDeleteOfflineBatch();

  return (
    <PageContainer 
      title="Offline Batches" 
      description="Manage schedules and capacity for offline learning batches." 
      actions={<OfflineBatchDialog centers={centers} courses={courses} />}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-64 bg-card/50 border-none shadow-sm">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Courses</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={centerFilter} onValueChange={setCenterFilter}>
            <SelectTrigger className="w-64 bg-card/50 border-none shadow-sm">
              <SelectValue placeholder="All Centers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Centers</SelectItem>
              {centers.map(center => (
                <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <BatchesSkeleton /> : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Course & Center</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length > 0 ? batches.map((batch) => (
                  <TableRow key={batch.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{batch.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">ID: {batch.id.slice(-6)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <BookOpen size={12} className="text-primary/60" />
                          {batch.course?.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={12} className="text-primary/60" />
                          {batch.center?.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-primary/60" />
                          {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock size={12} className="text-primary/60" />
                          {batch.startTime} - {batch.endTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                               <Users size={10} />
                             </div>
                           ))}
                         </div>
                         <div className="flex flex-col">
                           <span className="text-xs font-bold">{batch._count?.bookings || 0} / {batch.capacity}</span>
                           <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary" 
                               style={{ width: `${Math.min(((batch._count?.bookings || 0) / batch.capacity) * 100, 100)}%` }}
                             />
                           </div>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {batch.isActive ? (
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
                          <DropdownMenuLabel className="text-[10px] font-bold px-2 py-2 opacity-50 uppercase tracking-[0.2em]">Manage Batch</DropdownMenuLabel>
                          <OfflineBatchDialog batch={batch} centers={centers} courses={courses} mode="edit" />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { if (confirm("Remove this batch?")) deleteBatch.mutate(batch.id); }} 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Batch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center italic text-muted-foreground bg-muted/10">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                          <Calendar size={24} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">No batches found for this selection</p>
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

function OfflineBatchDialog({ batch, centers, courses, mode = "add" }: { batch?: OfflineBatch; centers: any[]; courses: any[]; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createBatch = useCreateOfflineBatch();
  const updateBatch = useUpdateOfflineBatch();

  const [form, setForm] = useState<Partial<CreateOfflineBatchInput>>({
    name: batch?.name || "",
    capacity: batch?.capacity || 30,
    startDate: batch?.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : "",
    endDate: batch?.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : "",
    startTime: batch?.startTime || "",
    endTime: batch?.endTime || "",
    daysOfWeek: batch?.daysOfWeek || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    isActive: batch?.isActive ?? true,
    courseId: batch?.courseId || "",
    centerId: batch?.centerId || "",
  });

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && batch) {
      updateBatch.mutate({ id: batch.id, ...form } as any, { onSuccess: () => setIsOpen(false) });
    } else {
      createBatch.mutate(form as any, { onSuccess: () => setIsOpen(false) });
    }
  };

  const isPending = createBatch.isPending || updateBatch.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> New Batch
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-2 text-sm cursor-pointer hover:bg-muted transition-colors rounded-sm">
            <Edit className="w-4 h-4 mr-2 text-primary" /> Edit Details
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">{mode === "add" ? "Create New Batch" : "Edit Batch Info"}</DialogTitle>
          <DialogDescription className="text-xs">Define a schedule and capacity for this offline course batch.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Course</Label>
            <Select value={form.courseId} onValueChange={(val) => set("courseId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Center</Label>
            <Select value={form.centerId} onValueChange={(val) => set("centerId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an offline center" />
              </SelectTrigger>
              <SelectContent>
                {centers.map(center => (
                  <SelectItem key={center.id} value={center.id}>{center.name} ({center.city})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Batch Name</Label>
              <Input placeholder="e.g. Summer Batch 2024" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Capacity (Seats)</Label>
              <Input type="number" placeholder="30" value={form.capacity} onChange={(e) => set("capacity", parseInt(e.target.value) || 0)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</Label>
              <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start Time</Label>
              <Input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Time</Label>
              <Input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch checked={form.isActive} onCheckedChange={(c) => set("isActive", c)} />
            <div className="flex flex-col">
              <Label className="text-sm font-semibold">Active Batch</Label>
              <p className="text-[10px] text-muted-foreground italic">Whether this batch is currently accepting bookings.</p>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold rounded-xl" disabled={isPending}>
              {isPending ? "Syncing..." : mode === "add" ? "Create Batch" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BatchesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 border-none shadow-sm bg-card/50">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        </Card>
      ))}
    </div>
  );
}
