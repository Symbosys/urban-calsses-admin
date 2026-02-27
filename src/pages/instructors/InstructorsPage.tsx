import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useInstructors, 
  useCreateInstructor, 
  useUpdateInstructor, 
  useDeleteInstructor 
} from "@/api/hooks/instructor/instructor.hooks";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search,
  Mail,
  Phone,
  GraduationCap,
  Star,
  ShieldCheck,
  UserX,
  ExternalLink,
  Award,
  Camera,
  UserPlus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Instructor, CreateInstructorInput } from "@/types/instructor/instructor.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function InstructorsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useInstructors({ search: debouncedSearch });
  const deleteInstructor = useDeleteInstructor();
  const updateInstructor = useUpdateInstructor();

  const instructors = data?.instructors || [];

  return (
    <PageContainer 
      title="Instructors" 
      description="Manage and verify course instructors."
      actions={<InstructorDialog />}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email or specialization..." 
              className="pl-9 bg-card/50 backdrop-blur-sm border-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <InstructorsSkeleton />
        ) : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Instructor</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <TableRow key={instructor.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarImage src={instructor.avatar?.secure_url} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {instructor.name?.charAt(0) || instructor.email.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                              {instructor.name || "Unnamed Instructor"}
                              {instructor.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {instructor.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-primary/60" />
                            {instructor.specialization || "Generalist"}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-primary/60" />
                            {instructor.experience ? `${instructor.experience} years exp.` : "Fresh talent"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/5 w-fit px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {instructor.rating.toFixed(1)}
                          </div>
                          <span className="text-xs text-muted-foreground tracking-tight">
                            {instructor._count?.courses || 0} Published Courses
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                             <Switch 
                               checked={instructor.isVerified}
                               onCheckedChange={(checked) => updateInstructor.mutate({ id: instructor.id, isVerified: checked })}
                               className="scale-75 data-[state=checked]:bg-blue-500"
                             />
                             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Switch 
                               checked={instructor.isBlocked}
                               onCheckedChange={(checked) => updateInstructor.mutate({ id: instructor.id, isBlocked: checked })}
                               className="scale-75 data-[state=checked]:bg-destructive"
                             />
                             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Blocked</span>
                          </div>
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
                            <InstructorDialog instructor={instructor} mode="edit" />
                            <DropdownMenuItem className="cursor-pointer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Public Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this instructor? This action cannot be undone.")) {
                                  deleteInstructor.mutate(instructor.id);
                                }
                              }}
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Instructor
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
                          <UserX className="w-8 h-8 opacity-20" />
                          <p>No instructors found</p>
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

/**
 * --- INSTRUCTOR DIALOG ---
 */
function InstructorDialog({ instructor, mode = "add" }: { instructor?: Instructor, mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createInstructor = useCreateInstructor();
  const updateInstructor = useUpdateInstructor();

   const [formData, setFormData] = useState<CreateInstructorInput>({
     name: instructor?.name || "",
     email: instructor?.email || "",
     phone: instructor?.phone || "",
     specialization: instructor?.specialization || "",
     experience: instructor?.experience || 0,
     bio: instructor?.bio || "",
     avatar: instructor?.avatar || undefined,
   });
 
   const [avatarPreview, setAvatarPreview] = useState<string | null>(instructor?.avatar?.secure_url || null);
 
   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       setFormData(p => ({ ...p, avatar: file }));
       setAvatarPreview(URL.createObjectURL(file));
     }
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
 
     const submitData = { ...formData };
     if (submitData.avatar && !(submitData.avatar instanceof File)) {
       delete submitData.avatar;
     }
 
     if (mode === "edit" && instructor) {
       updateInstructor.mutate({ id: instructor.id, ...submitData }, { onSuccess: () => setIsOpen(false) });
     } else {
       createInstructor.mutate(submitData as any, { onSuccess: () => setIsOpen(false) });
     }
   };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Add Instructor
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted outline-none transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Details
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "Register Instructor" : "Edit Instructor"}</DialogTitle>
          <DialogDescription>
            Enter professional details for the course instructor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center space-y-3 mb-6">
             <div className="relative group">
               <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-xl transition-all group-hover:border-primary/30">
                 <AvatarImage src={avatarPreview || ""} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                  {formData.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
                <Input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </Label>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Profile Picture</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inst-name">Full Name</Label>
              <Input 
                id="inst-name" 
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst-email">Email Address</Label>
              <Input 
                id="inst-email" 
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                required
                disabled={mode === "edit"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inst-phone">Phone Number</Label>
              <Input 
                id="inst-phone" 
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst-exp">Experience (Years)</Label>
              <Input 
                id="inst-exp" 
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData(p => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inst-spec">Specialization / Expertise</Label>
            <Input 
              id="inst-spec" 
              placeholder="e.g. Senior Web Developer, UPSC Faculty"
              value={formData.specialization}
              onChange={(e) => setFormData(p => ({ ...p, specialization: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inst-bio">Professional Biography</Label>
            <Textarea 
              id="inst-bio" 
              placeholder="Tell students about the instructor's background..."
              className="resize-none h-32" 
              value={formData.bio}
              onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button 
                type="submit" 
                className="flex-1 shadow-lg shadow-primary/20 font-bold"
                disabled={createInstructor.isPending || updateInstructor.isPending}
            >
              {createInstructor.isPending || updateInstructor.isPending ? "Syncing..." : (mode === "add" ? "Onboard Instructor" : "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * --- SKELETON LOADER ---
 */
function InstructorsSkeleton() {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card/50">
      <div className="h-12 w-full bg-muted/40 animate-pulse" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex p-4 border-t border-muted/20 gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-3 w-[20%]" />
          </div>
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      ))}
    </Card>
  );
}
