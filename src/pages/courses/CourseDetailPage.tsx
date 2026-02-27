import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "@/api/hooks/courses/course.hooks";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "@/api/hooks/courses/subject.hooks";
import { useSections, useCreateSection, useUpdateSection, useDeleteSection } from "@/api/hooks/courses/section.hooks";
import { useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson } from "@/api/hooks/courses/lesson.hooks";
import { useLessonResources, useAddResource, useUpdateResource, useDeleteResource } from "@/api/hooks/courses/resource.hooks";
import type { Subject, Section, Lesson, LessonType } from "@/types/courses/course.types";
import type { LessonResource } from "@/api/hooks/courses/resource.hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ArrowLeft, Plus, Edit, Trash2, BookOpen, Layers, FileText, Video, ChevronDown, ChevronRight,
  GripVertical, MoreHorizontal, FolderOpen, Play, File, X, Youtube, Check
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useCourse(id!);
  const course = data?.course;

  if (isLoading) return <DetailSkeleton />;
  if (!course) return <div className="text-center py-20 text-muted-foreground">Course not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/courses")} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight truncate">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.subCategory?.name || "Uncategorized"} · {course.level} · <Badge variant="outline" className="text-[10px]">{course.status}</Badge></p>
        </div>
      </div>
      <SubjectsPanel courseId={course.id} />
    </div>
  );
}

/* ─── SUBJECTS PANEL ─── */
function SubjectsPanel({ courseId }: { courseId: string }) {
  const { data, isLoading } = useSubjects({ courseId });
  const subjects = data?.subjects || [];
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2"><Layers className="w-5 h-5 text-primary" />Subjects ({subjects.length})</h2>
        <ItemDialog kind="subject" parentId={courseId} />
      </div>
      {isLoading ? <Skeleton className="h-20 w-full" /> : subjects.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/20 p-8 text-center text-muted-foreground"><FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-20" /><p>No subjects yet. Add one to get started.</p></Card>
      ) : (
        <div className="space-y-2">
          {subjects.map((s) => (
            <SubjectRow key={s.id} subject={s} isExpanded={expandedSubjectId === s.id} onToggle={() => setExpandedSubjectId(expandedSubjectId === s.id ? null : s.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubjectRow({ subject, isExpanded, onToggle }: { subject: Subject; isExpanded: boolean; onToggle: () => void }) {
  const deleteSubject = useDeleteSubject();
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={onToggle}>
        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
        {isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <div className="h-6 w-6 rounded bg-muted/50 overflow-hidden border border-border/50 flex-shrink-0 flex items-center justify-center">
          {subject.icon?.secure_url ? (
            <img src={subject.icon.secure_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-primary/60" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm">{subject.title}</span>
          <span className="text-[10px] text-muted-foreground ml-2">{subject._count?.sections || 0} sections</span>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <ItemDialog kind="subject" parentId={subject.courseId} item={subject} mode="edit" />
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete this subject and all its content?")) deleteSubject.mutate(subject.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      </div>
      {isExpanded && <div className="border-t border-border/30 p-3 pl-10 bg-muted/10"><SectionsPanel subjectId={subject.id} /></div>}
    </div>
  );
}

/* ─── SECTIONS PANEL ─── */
function SectionsPanel({ subjectId }: { subjectId: string }) {
  const { data, isLoading } = useSections({ subjectId });
  const sections = data?.sections || [];
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sections ({sections.length})</span>
        <ItemDialog kind="section" parentId={subjectId} />
      </div>
      {isLoading ? <Skeleton className="h-12 w-full" /> : sections.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-2">No sections. Click + to add one.</p>
      ) : sections.map((sec) => (
        <SectionRow key={sec.id} section={sec} isExpanded={expandedSectionId === sec.id} onToggle={() => setExpandedSectionId(expandedSectionId === sec.id ? null : sec.id)} />
      ))}
    </div>
  );
}

function SectionRow({ section, isExpanded, onToggle }: { section: Section; isExpanded: boolean; onToggle: () => void }) {
  const deleteSection = useDeleteSection();
  return (
    <div className="rounded-lg border border-border/40 bg-card/30 overflow-hidden">
      <div className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-muted/20 transition-colors" onClick={onToggle}>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <FileText className="w-3.5 h-3.5 text-primary/50" />
        <span className="flex-1 text-sm font-medium">{section.title}</span>
        <span className="text-[10px] text-muted-foreground">{section._count?.lessons || 0} lessons</span>
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <ItemDialog kind="section" parentId={section.subjectId} item={section} mode="edit" />
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete section?")) deleteSection.mutate(section.id); }}><Trash2 className="w-3 h-3" /></Button>
        </div>
      </div>
      {isExpanded && <div className="border-t border-border/20 p-2.5 pl-8 bg-muted/5"><LessonsPanel sectionId={section.id} /></div>}
    </div>
  );
}

/* ─── LESSONS PANEL ─── */
function LessonsPanel({ sectionId }: { sectionId: string }) {
  const { data, isLoading } = useLessons({ sectionId });
  const lessons = data?.lessons || [];
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const ICONS: Record<string, any> = { VIDEO: Video, PDF: File, TEXT: FileText, QUIZ: FileText, LIVE: Play };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Lessons ({lessons.length})</span>
        <ItemDialog kind="lesson" parentId={sectionId} />
      </div>
      {isLoading ? <Skeleton className="h-8 w-full" /> : lessons.length === 0 ? (
        <p className="text-[10px] text-muted-foreground italic py-1">No lessons yet.</p>
      ) : lessons.map((les) => {
        const Icon = ICONS[les.type] || FileText;
        return (
          <LessonRow key={les.id} lesson={les} Icon={Icon} isExpanded={expandedLessonId === les.id} onToggle={() => setExpandedLessonId(expandedLessonId === les.id ? null : les.id)} />
        );
      })}
    </div>
  );
}

function LessonRow({ lesson, Icon, isExpanded, onToggle }: { lesson: Lesson; Icon: any; isExpanded: boolean; onToggle: () => void }) {
  const deleteLesson = useDeleteLesson();
  return (
    <div className="rounded-md border border-border/30 bg-card/20 overflow-hidden">
      <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/15 transition-colors" onClick={onToggle}>
        {isExpanded ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        <Icon className="w-3.5 h-3.5 text-primary/50" />
        <span className="flex-1 text-xs font-medium truncate">{lesson.title}</span>
        <Badge variant="outline" className="text-[8px] py-0 px-1">{lesson.type}</Badge>
        {lesson.isFree && <Badge className="text-[8px] py-0 px-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20" variant="outline">FREE</Badge>}
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <ItemDialog kind="lesson" parentId={lesson.sectionId} item={lesson} mode="edit" />
          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete lesson?")) deleteLesson.mutate(lesson.id); }}><Trash2 className="w-2.5 h-2.5" /></Button>
        </div>
      </div>
      {isExpanded && <div className="border-t border-border/15 p-2 pl-7 bg-muted/5"><ResourcesPanel lessonId={lesson.id} /></div>}
    </div>
  );
}

/* ─── RESOURCES PANEL ─── */
function ResourcesPanel({ lessonId }: { lessonId: string }) {
  const { data, isLoading } = useLessonResources(lessonId);
  const resources = data?.resources || [];
  const deleteResource = useDeleteResource();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Resources ({resources.length})</span>
        <ItemDialog kind="resource" parentId={lessonId} />
      </div>
      {isLoading ? <Skeleton className="h-6 w-full" /> : resources.length === 0 ? (
        <p className="text-[9px] text-muted-foreground italic">No resources attached.</p>
      ) : resources.map((r) => (
        <div key={r.id} className="flex items-center gap-2 py-1 px-2 rounded bg-card/30 border border-border/20 text-xs">
          <File className="w-3 h-3 text-primary/40" />
          <span className="flex-1 truncate">{r.title}</span>
          <ItemDialog kind="resource" parentId={r.lessonId} item={r} mode="edit" />
          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete resource?")) deleteResource.mutate(r.id); }}><X className="w-2.5 h-2.5" /></Button>
        </div>
      ))}
    </div>
  );
}

/* ─── UNIVERSAL ITEM DIALOG ─── */
type DialogKind = "subject" | "section" | "lesson" | "resource";

function ItemDialog({ kind, parentId, item, mode = "add" }: { kind: DialogKind; parentId: string; item?: any; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);

  // Subject
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  // Section
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  // Lesson
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  // Resource
  const addResource = useAddResource();
  const updateResource = useUpdateResource();

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [order, setOrder] = useState(item?.order || 0);
  const [icon, setIcon] = useState<any>(item?.icon || undefined);
  const [iconPreview, setIconPreview] = useState<string | null>(item?.icon?.secure_url || null);

  // Lesson-specific
  const [lessonType, setLessonType] = useState<LessonType>(item?.type || "VIDEO");
  const [isFree, setIsFree] = useState(item?.isFree || false);
  const [content, setContent] = useState(item?.content || "");
  const [duration, setDuration] = useState(item?.duration || 0);
  const [videoUrl, setVideoUrl] = useState(item?.video?.url || "");

  const isPending = createSubject.isPending || updateSubject.isPending || createSection.isPending || updateSection.isPending || createLesson.isPending || updateLesson.isPending || addResource.isPending || updateResource.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const onDone = { onSuccess: () => setIsOpen(false) };

    if (kind === "subject") {
      const payload: any = { title, description, order, courseId: parentId, icon };
      if (payload.icon && !(payload.icon instanceof File)) {
        delete payload.icon;
      }
      mode === "edit" ? updateSubject.mutate({ id: item.id, ...payload }, onDone) : createSubject.mutate(payload, onDone);
    } else if (kind === "section") {
      const payload = { title, order, subjectId: parentId };
      mode === "edit" ? updateSection.mutate({ id: item.id, ...payload }, onDone) : createSection.mutate(payload, onDone);
    } else if (kind === "lesson") {
      const videoObj = videoUrl.trim() ? { url: videoUrl.trim(), publicId: "youtube", duration: 0 } : undefined;
      const payload = { title, description, type: lessonType, isFree, content, duration, order, sectionId: parentId, video: videoObj };
      mode === "edit" ? updateLesson.mutate({ id: item.id, ...payload }, onDone) : createLesson.mutate(payload, onDone);
    } else if (kind === "resource") {
      if (mode === "edit") {
        updateResource.mutate({ id: item.id, title }, onDone);
      } else {
        addResource.mutate({ title, file: { url: "", publicId: "", fileName: title, size: 0, mimeType: "" }, lessonId: parentId }, onDone);
      }
    }
  };

  const labels: Record<DialogKind, string> = { subject: "Subject", section: "Section", lesson: "Lesson", resource: "Resource" };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button variant="outline" size="sm" className="h-7 text-xs shadow-sm"><Plus className="w-3 h-3 mr-1" />Add {labels[kind]}</Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10"><Edit className="w-3 h-3" /></Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{mode === "add" ? `Add ${labels[kind]}` : `Edit ${labels[kind]}`}</DialogTitle>
          <DialogDescription>Provide the required details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder={`${labels[kind]} title…`} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {kind === "subject" && (
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded bg-muted border border-dashed border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {iconPreview ? <img src={iconPreview} className="h-full w-full object-cover" alt="" /> : <Layers className="w-5 h-5 text-muted-foreground/30" />}
                </div>
                <Label htmlFor="subject-icon" className="cursor-pointer bg-primary/10 text-primary px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-primary/20 transition-colors">
                  Choose Icon
                  <Input id="subject-icon" type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setIcon(f);
                      setIconPreview(URL.createObjectURL(f));
                    }
                  }} />
                </Label>
              </div>
            </div>
          )}

          {(kind === "subject" || kind === "lesson") && (
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Optional description…" className="resize-none h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          )}

          {kind !== "resource" && (
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} />
            </div>
          )}

          {kind === "lesson" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={lessonType} onValueChange={(v) => setLessonType(v as LessonType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="QUIZ">Quiz</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} />
                </div>
              </div>
              {(lessonType === "TEXT" || lessonType === "QUIZ") && (
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea placeholder="Lesson content or quiz data…" className="resize-none h-24" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
              )}
              {(lessonType === "VIDEO" || lessonType === "LIVE") && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Youtube className="w-4 h-4 text-red-500" />YouTube Video URL</Label>
                  <Input placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                  {videoUrl && videoUrl.includes("youtu") && (
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" />YouTube link detected</p>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3">
                <Switch checked={isFree} onCheckedChange={setIsFree} />
                <Label className="text-sm">Free Preview</Label>
              </div>
            </>
          )}

          <DialogFooter className="pt-3 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold" disabled={isPending}>{isPending ? "Saving…" : mode === "add" ? `Add ${labels[kind]}` : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[60%]" />
      <Skeleton className="h-5 w-[30%]" />
      <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
    </div>
  );
}
