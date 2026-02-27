
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useBlogs, 
  useCreateBlog, 
  useUpdateBlog, 
  useDeleteBlog 
} from "@/api/hooks/blogs/blog.hooks";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, MoreHorizontal, Search, 
  FileText, Image as ImageIcon, Tag, 
  CheckCircle2, XCircle, ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Blog, CreateBlogInput } from "@/types/blogs/blog.types";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useBlogs({
    search: debouncedSearch || undefined,
  });

  const blogs = data?.blogs || [];
  const deleteBlog = useDeleteBlog();

  return (
    <PageContainer 
      title="Blog Posts" 
      description="Create, edit, and manage your platform's editorial content." 
      actions={<BlogDialog />}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or content..." 
              className="pl-9 bg-card/50 backdrop-blur-sm border-none shadow-sm" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {isLoading ? <BlogsSkeleton /> : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.length > 0 ? blogs.map((blog) => (
                  <TableRow key={blog.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border bg-muted/50 overflow-hidden shrink-0">
                          {blog.thumbnail?.url ? (
                            <img src={blog.thumbnail.url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                              <FileText size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[300px]">
                          <span className="font-bold text-foreground line-clamp-1">{blog.title}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">slug: {blog.slug}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase py-0">{blog.category || "Uncategorized"}</Badge>
                    </TableCell>
                    <TableCell>
                      {blog.isPublished ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 py-0.5">
                          <CheckCircle2 size={12} /> Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20 gap-1.5 py-0.5">
                          <XCircle size={12} /> Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1">
                          <DropdownMenuLabel className="text-[10px] font-bold px-2 py-2 opacity-50 uppercase tracking-[0.2em]">Manage Post</DropdownMenuLabel>
                          <BlogDialog blog={blog} mode="edit" />
                          <DropdownMenuItem onClick={() => window.open(`/blogs/${blog.slug}`, "_blank")} className="cursor-pointer">
                            <ExternalLink className="w-4 h-4 mr-2 text-blue-500" /> View Live
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { if (confirm("Delete this blog post?")) deleteBlog.mutate(blog.id); }} 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Article
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
                          <FileText size={24} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">No blog posts found</p>
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

function BlogDialog({ blog, mode = "add" }: { blog?: Blog; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [form, setForm] = useState<CreateBlogInput>({
    title: blog?.title || "",
    slug: blog?.slug || "",
    content: blog?.content || "",
    excerpt: blog?.excerpt || "",
    category: blog?.category || "",
    tags: blog?.tags || [],
    isPublished: blog?.isPublished ?? false,
    authorName: blog?.authorName || "Urban Classes Team",
    thumbnail: blog?.thumbnail || undefined,
  });

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make thumbnail optional by setting to null if URL is empty
    const payload = {
      ...form,
      thumbnail: form.thumbnail?.url ? form.thumbnail : null,
      authorImage: form.authorImage?.url ? form.authorImage : null,
    };

    if (mode === "edit" && blog) {
      updateBlog.mutate({ id: blog.id, ...payload }, { onSuccess: () => setIsOpen(false) });
    } else {
      createBlog.mutate(payload, { onSuccess: () => setIsOpen(false) });
    }
  };

  const generateSlug = () => {
    const s = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    set("slug", s);
  };

  const isPending = createBlog.isPending || updateBlog.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Write Post
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-2 text-sm cursor-pointer hover:bg-muted transition-colors rounded-sm">
            <Edit className="w-4 h-4 mr-2 text-primary" /> Edit Article
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">{mode === "add" ? "Draft New Article" : "Edit Blog Content"}</DialogTitle>
          <DialogDescription className="text-xs">Create value-driven content for your students and visitors.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
              <Input placeholder="Post title" value={form.title} onChange={(e) => set("title", e.target.value)} onBlur={generateSlug} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL Slug</Label>
              <Input placeholder="post-url-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Input placeholder="e.g. Study Tips" value={form.category || ""} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Author</Label>
              <Input placeholder="Urban Classes Team" value={form.authorName || ""} onChange={(e) => set("authorName", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Thumbnail Image URL</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="https://unsplash.com/..." value={form.thumbnail?.url || ""} onChange={(e) => set("thumbnail", { url: e.target.value, publicId: "external" })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Article Excerpt (Short description)</Label>
            <Textarea placeholder="Brief summary of the post..." value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} className="h-20" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Content (Rich Text / HTML)</Label>
            <Textarea 
              placeholder="Write your article content here..." 
              value={form.content} 
              onChange={(e) => set("content", e.target.value)} 
              className="min-h-[300px] font-mono text-sm" 
              required 
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch checked={form.isPublished} onCheckedChange={(c) => set("isPublished", c)} />
            <div className="flex flex-col">
              <Label className="text-sm font-semibold">Publish to Website</Label>
              <p className="text-[10px] text-muted-foreground italic">If OFF, the post remains a draft and hidden from public.</p>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold rounded-xl" disabled={isPending}>
              {isPending ? "Syncing..." : mode === "add" ? "Publish Post" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BlogsSkeleton() {
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
