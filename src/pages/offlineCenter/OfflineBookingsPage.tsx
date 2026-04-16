import { PageContainer } from "@/components/layout/PageContainer";
import { 
  useOfflineBookings, 
  useUpdateOfflineBookingStatus, 
  useDeleteOfflineBooking 
} from "@/api/hooks/offlineCenter/offlineBooking.hooks";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MoreHorizontal, User, Mail, Phone, 
  Calendar, CheckCircle2, XCircle, Clock, Trash2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function OfflineBookingsPage() {
  const { data, isLoading } = useOfflineBookings();
  const bookings = data?.bookings || [];

  const updateStatus = useUpdateOfflineBookingStatus();
  const deleteBooking = useDeleteOfflineBooking();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5">Completed</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5">Pending</Badge>;
      case "FAILED":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 gap-1.5">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageContainer 
      title="Offline Bookings" 
      description="Track and manage student registrations for offline batches." 
    >
      <div className="space-y-4">
        {isLoading ? <div className="p-12 text-center text-muted-foreground italic">Loading bookings...</div> : (
          <Card className="border-none shadow-xl bg-card/30 backdrop-blur-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Student Info</TableHead>
                  <TableHead>Batch Details</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? bookings.map((booking) => (
                  <TableRow key={booking.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <User size={14} className="text-primary/60" />
                          {booking.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail size={12} className="text-primary/60" />
                          {booking.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone size={12} className="text-primary/60" />
                          {booking.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">{booking.batch?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Center: {booking.batch?.center?.name}
                        </span>
                        <span className="text-[10px] bg-primary/5 text-primary w-fit px-1.5 py-0.5 rounded font-bold uppercase">
                          {booking.batch?.course?.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-primary/60" />
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(booking.bookingDate).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1">
                          <DropdownMenuLabel className="text-[10px] font-bold px-2 py-2 opacity-50 uppercase tracking-[0.2em]">Update Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ id: booking.id, status: "COMPLETED" })} className="cursor-pointer">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ id: booking.id, status: "PENDING" })} className="cursor-pointer">
                            <Clock className="w-4 h-4 mr-2 text-amber-500" /> Mark Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ id: booking.id, status: "FAILED" })} className="cursor-pointer">
                            <XCircle className="w-4 h-4 mr-2 text-rose-500" /> Mark Failed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                             onClick={() => { if (confirm("Delete this booking?")) deleteBooking.mutate(booking.id); }}
                             className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                     <TableCell colSpan={5} className="h-48 text-center italic text-muted-foreground bg-muted/10">
                        No offline bookings registered yet.
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
