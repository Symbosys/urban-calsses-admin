import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory,
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory
} from "@/api/hooks/courses/category.hooks";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Layers, 
  Tag, 
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, SubCategory } from "@/types/courses/course.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: subCategoriesData, isLoading: subCategoriesLoading } = useSubCategories();

  const categories = categoriesData?.categories || [];
  const subCategories = subCategoriesData?.subCategories || [];

  return (
    <PageContainer 
      title="Course Categories" 
      description="Organize your courses into intuitive categories and subcategories."
    >
      <Tabs defaultValue="categories" className="w-full space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger value="categories" className="data-[state=active]:bg-background shadow-sm transition-all">
              <Layers className="w-4 h-4 mr-2" />
              Main Categories
            </TabsTrigger>
            <TabsTrigger value="subcategories" className="data-[state=active]:bg-background shadow-sm transition-all">
              <Tag className="w-4 h-4 mr-2" />
              Sub Categories
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === "categories" ? (
              <CategoryDialog />
            ) : (
              <SubCategoryDialog categories={categories} />
            )}
          </div>
        </div>

        <TabsContent value="categories" className="mt-0 outline-none">
          <CategoryTable categories={categories} isLoading={categoriesLoading} />
        </TabsContent>
        
        <TabsContent value="subcategories" className="mt-0 outline-none">
          <SubCategoryTable 
            subCategories={subCategories} 
            categories={categories}
            isLoading={subCategoriesLoading} 
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

/**
 * --- CATEGORY TABLE ---
 */
function CategoryTable({ categories, isLoading }: { categories: Category[], isLoading: boolean }) {
  const [search, setSearch] = useState("");
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  if (isLoading) return <TableSkeleton columns={5} />;

  return (
    <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search categories..." 
          className="max-w-xs border-none bg-transparent focus-visible:ring-0 shadow-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sub-categories</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <TableRow key={category.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                <TableCell className="font-medium text-muted-foreground">{category.order}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{category.name}</span>
                    {category.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">{category.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {category.isActive ? (
                      <div className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </div>
                    )}
                    <Switch 
                      checked={category.isActive} 
                      onCheckedChange={(checked) => updateCategory.mutate({ id: category.id, isActive: checked })}
                      className="data-[state=checked]:bg-emerald-500 scale-75"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{category._count?.subCategories || 0}</span>
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
                      <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 opacity-50 uppercase tracking-wider">Actions</DropdownMenuLabel>
                      <CategoryDialog category={category} mode="edit" />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this category? All sub-categories will be affected.")) {
                            deleteCategory.mutate(category.id);
                          }
                        }}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Category
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
                  <Search className="w-8 h-8 opacity-20" />
                  <p>No categories found matching your search</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * --- SUB-CATEGORY TABLE ---
 */
function SubCategoryTable({ 
  subCategories, 
  categories, 
  isLoading 
}: { 
  subCategories: SubCategory[], 
  categories: Category[], 
  isLoading: boolean 
}) {
  const [search, setSearch] = useState("");
  const updateSubCategory = useUpdateSubCategory();
  const deleteSubCategory = useDeleteSubCategory();

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      (s.category?.name?.toLowerCase() || "").includes(search.toLowerCase())
    );
  }, [subCategories, search]);

  if (isLoading) return <TableSkeleton columns={5} />;

  return (
    <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search sub-categories..." 
          className="max-w-xs border-none bg-transparent focus-visible:ring-0 shadow-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Sub Category Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((subCategory) => (
              <TableRow key={subCategory.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                <TableCell className="font-medium text-muted-foreground">{subCategory.order}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{subCategory.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center py-1">
                    <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold border border-primary/20">
                      {subCategory.category?.name || "Uncategorized"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {subCategory.isActive ? (
                      <div className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </div>
                    )}
                    <Switch 
                      checked={subCategory.isActive} 
                      onCheckedChange={(checked) => updateSubCategory.mutate({ id: subCategory.id, isActive: checked })}
                      className="data-[state=checked]:bg-emerald-500 scale-75"
                    />
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-xs text-muted-foreground">{subCategory._count?.courses || 0} Courses</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                      <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 opacity-50 uppercase tracking-wider">Actions</DropdownMenuLabel>
                      <SubCategoryDialog subCategory={subCategory} categories={categories} mode="edit" />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this sub-category?")) {
                            deleteSubCategory.mutate(subCategory.id);
                          }
                        }}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Sub-Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center italic text-muted-foreground bg-muted/10">
                <div className="flex flex-col items-center justify-center space-y-2">
                   <Tag className="w-8 h-8 opacity-20" />
                   <p>No sub-categories found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * --- CATEGORY DIALOG ---
 */
function CategoryDialog({ category, mode = "add" }: { category?: Category, mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    order: category?.order || 0,
    isActive: category?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && category) {
      updateCategory.mutate({ id: category.id, ...formData }, { onSuccess: () => setIsOpen(false) });
    } else {
      createCategory.mutate(formData, { onSuccess: () => setIsOpen(false) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted outline-none transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Category
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "Create New Category" : "Edit Category"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Add a new top-level category to organize your courses." 
              : "Update category details and settings."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">Name</Label>
            <Input 
              id="category-name" 
              className="col-span-3" 
              placeholder="e.g. Development"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-desc" className="text-right">Info</Label>
            <Textarea 
              id="category-desc" 
              className="col-span-3 resize-none h-20" 
              placeholder="Category description..."
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-order" className="text-right">Sort Order</Label>
            <Input 
              id="category-order" 
              type="number" 
              className="col-span-3" 
              value={formData.order}
              onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) }))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-active" className="text-right">Is Active</Label>
            <div className="col-span-3 flex items-center h-10">
              <Switch 
                id="category-active" 
                checked={formData.isActive} 
                onCheckedChange={(c) => setFormData(p => ({ ...p, isActive: c }))} 
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button 
                type="submit" 
                className="flex-1 shadow-lg shadow-primary/20"
                disabled={createCategory.isPending || updateCategory.isPending}
            >
              {createCategory.isPending || updateCategory.isPending ? "Saving..." : (mode === "add" ? "Create Category" : "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * --- SUB-CATEGORY DIALOG ---
 */
function SubCategoryDialog({ 
  subCategory, 
  categories, 
  mode = "add" 
}: { 
  subCategory?: SubCategory, 
  categories: Category[],
  mode?: "add" | "edit" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const createSubCategory = useCreateSubCategory();
  const updateSubCategory = useUpdateSubCategory();

  const [formData, setFormData] = useState({
    name: subCategory?.name || "",
    description: subCategory?.description || "",
    order: subCategory?.order || 0,
    isActive: subCategory?.isActive ?? true,
    categoryId: subCategory?.categoryId || categories?.[0]?.id || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return;
    
    if (mode === "edit" && subCategory) {
      updateSubCategory.mutate({ id: subCategory.id, ...formData }, { onSuccess: () => setIsOpen(false) });
    } else {
      createSubCategory.mutate(formData, { onSuccess: () => setIsOpen(false) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button variant="outline" className="shadow-sm border-primary/20 text-primary hover:bg-primary/5 transition-all">
            <Plus className="w-4 h-4 mr-2" /> Add Sub-Category
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted outline-none transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Sub-Category
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "Create Sub-Category" : "Edit Sub-Category"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Assign a new sub-category to a parent category." 
              : "Update sub-category details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent-cat" className="text-right">Parent</Label>
            <div className="col-span-3">
              <Select 
                value={formData.categoryId} 
                onValueChange={(val) => setFormData(p => ({ ...p, categoryId: val }))}
              >
                <SelectTrigger id="parent-cat" className="w-full">
                  <SelectValue placeholder="Select Parent Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sub-name" className="text-right">Name</Label>
            <Input 
              id="sub-name" 
              className="col-span-3" 
              placeholder="e.g. React.js"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sub-order" className="text-right">Sort Order</Label>
            <Input 
              id="sub-order" 
              type="number" 
              className="col-span-3" 
              value={formData.order}
              onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) }))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sub-active" className="text-right">Is Active</Label>
            <div className="col-span-3 flex items-center h-10">
              <Switch 
                id="sub-active" 
                checked={formData.isActive} 
                onCheckedChange={(c) => setFormData(p => ({ ...p, isActive: c }))} 
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button 
                type="submit" 
                className="flex-1 shadow-lg shadow-primary/20"
                disabled={createSubCategory.isPending || updateSubCategory.isPending}
            >
              {createSubCategory.isPending || updateSubCategory.isPending ? "Saving..." : (mode === "add" ? "Create Sub-Category" : "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * --- LOADING SKELETON ---
 */
function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-muted/20 animate-pulse rounded-lg" />
      <Card className="border-none shadow-sm overflow-hidden bg-card/50">
        <div className="h-12 w-full bg-muted/40 animate-pulse" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex p-4 border-t border-muted/20 gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-4 flex-1 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}
