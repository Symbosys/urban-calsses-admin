import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useCoupons, 
  useCreateCoupon, 
  useUpdateCoupon, 
  useDeleteCoupon 
} from "../../api/hooks/admin/coupon.hooks";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Ticket,
  Percent,
  CircleDollarSign,
  Calendar as CalendarIcon,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Hash
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Coupon, DiscountType } from "@/types/admin/coupon.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCoupons();
  const deleteCoupon = useDeleteCoupon();
  const updateCoupon = useUpdateCoupon();

  const coupons = data?.coupons || [];
  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer 
      title="Coupons" 
      description="Create and manage discount codes and promotional offers."
      actions={<CouponDialog />}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by coupon code..." 
              className="pl-9 bg-card/50 backdrop-blur-sm border-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <CouponsSkeleton />
        ) : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary opacity-50" />
                          <span className="font-mono font-bold text-foreground text-sm tracking-widest">{coupon.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <><Percent className="w-3.5 h-3.5 text-blue-500" /> {coupon.discountValue}% Off</>
                          ) : (
                            <><CircleDollarSign className="w-3.5 h-3.5 text-emerald-500" /> ₹{coupon.discountValue} Off</>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {format(new Date(coupon.validFrom), 'dd MMM yy')} — {format(new Date(coupon.validTill), 'dd MMM yy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{coupon.usedCount} / {coupon.maxUses || '∞'} used</span>
                          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${coupon.maxUses ? (coupon.usedCount / coupon.maxUses) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Switch 
                             checked={coupon.isActive}
                             onCheckedChange={(checked) => updateCoupon.mutate({ id: coupon.id, isActive: checked })}
                             className="scale-75 data-[state=checked]:bg-emerald-500"
                           />
                           {coupon.isActive ? (
                             <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-2">Active</Badge>
                           ) : (
                             <Badge variant="outline" className="text-muted-foreground bg-muted px-2">Inactive</Badge>
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
                            <CouponDialog coupon={coupon} mode="edit" />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this coupon?")) {
                                  deleteCoupon.mutate(coupon.id);
                                }
                              }}
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Coupon
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
                          <Ticket className="w-8 h-8 opacity-20" />
                          <p>No coupons found</p>
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
 * --- COUPON DIALOG ---
 */
function CouponDialog({ coupon, mode = "add" }: { coupon?: Coupon, mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: (coupon?.discountType || "PERCENTAGE") as DiscountType,
    discountValue: coupon?.discountValue || 0,
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom) : new Date(),
    validTill: coupon?.validTill ? new Date(coupon.validTill) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxUses: coupon?.maxUses || 0,
    isActive: coupon?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      validFrom: formData.validFrom.toISOString(),
      validTill: formData.validTill.toISOString(),
    };

    if (mode === "edit" && coupon) {
      updateCoupon.mutate({ id: coupon.id, ...payload }, { onSuccess: () => setIsOpen(false) });
    } else {
      createCoupon.mutate(payload, { onSuccess: () => setIsOpen(false) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Create Coupon
          </Button>
        ) : (
          <div className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted outline-none transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Coupon
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === "add" ? "New Discount Coupon" : "Edit Coupon"}</DialogTitle>
          <DialogDescription>
            Offer discounts to students to boost your course sales.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Coupon Code</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="coupon-code" 
                  placeholder="NEWYEAR50"
                  className="pl-9 font-mono font-bold uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select 
                value={formData.discountType} 
                onValueChange={(val: DiscountType) => setFormData(p => ({ ...p, discountType: val }))}
              >
                <SelectTrigger id="discount-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount-val">Discount Value</Label>
              <Input 
                id="discount-val" 
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData(p => ({ ...p, discountValue: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-amount">Min Order Amount (₹)</Label>
              <Input 
                id="min-amount" 
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData(p => ({ ...p, minOrderAmount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valid From</Label>
              <DatePicker 
                date={formData.validFrom} 
                onDateChange={(d) => d && setFormData(p => ({ ...p, validFrom: d }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Valid Till</Label>
              <DatePicker 
                date={formData.validTill} 
                onDateChange={(d) => d && setFormData(p => ({ ...p, validTill: d }))} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-uses">Max Usage Limit</Label>
              <Input 
                id="max-uses" 
                type="number"
                placeholder="0 for unlimited"
                value={formData.maxUses}
                onChange={(e) => setFormData(p => ({ ...p, maxUses: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-active">Active Status</Label>
              <div className="flex items-center h-10 gap-3">
                <Switch 
                  id="coupon-active" 
                  checked={formData.isActive} 
                  onCheckedChange={(c) => setFormData(p => ({ ...p, isActive: c }))} 
                />
                <span className="text-sm font-medium">{formData.isActive ? "Active" : "Disabled"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon-desc">Description (Internal)</Label>
            <Input 
              id="coupon-desc" 
              placeholder="e.g. For winter festive promotion"
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button 
                type="submit" 
                className="flex-1 shadow-lg shadow-primary/20 font-bold"
                disabled={createCoupon.isPending || updateCoupon.isPending}
            >
              {createCoupon.isPending || updateCoupon.isPending ? "Saving..." : (mode === "add" ? "Create Coupon" : "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * --- UTILITY: DATE PICKER ---
 */
function DatePicker({ date, onDateChange }: { date: Date, onDateChange: (d: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * --- LOADER ---
 */
function CouponsSkeleton() {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card/50">
      <div className="h-12 w-full bg-muted/40 animate-pulse" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex p-4 border-t border-muted/20 gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </Card>
  );
}
