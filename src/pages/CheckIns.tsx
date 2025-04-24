
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, CalendarCheck, Clock } from "lucide-react";
import { mockClients } from "@/data/mockData";
import { Client, CheckIn } from "@/types";

const initialCheckIns: CheckIn[] = [
  {
    id: "checkin-1",
    clientId: mockClients[0].id,
    clientName: `${mockClients[0].firstName} ${mockClients[0].lastName}`,
    date: new Date(Date.now() + 86400000), // Tomorrow
    status: "scheduled",
    notes: "Initial assessment and program review",
    duration: 30,
  },
  {
    id: "checkin-2",
    clientId: mockClients[1].id,
    clientName: `${mockClients[1].firstName} ${mockClients[1].lastName}`,
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    status: "scheduled",
    notes: "Monthly progress review",
    duration: 45,
  },
];

const CheckIns = () => {
  const { toast } = useToast();
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [duration, setDuration] = useState<string>("30");
  const [notes, setNotes] = useState<string>("");

  const handleScheduleCheckIn = () => {
    if (!selectedClient || !selectedDate) {
      toast({
        title: "Missing information",
        description: "Please select a client and date for the check-in.",
        variant: "destructive",
      });
      return;
    }

    const client = mockClients.find((c) => c.id === selectedClient);
    if (!client) return;

    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      clientId: selectedClient,
      clientName: `${client.firstName} ${client.lastName}`,
      date: selectedDate,
      status: "scheduled",
      notes: notes,
      duration: parseInt(duration),
    };

    setCheckIns([...checkIns, newCheckIn]);
    setIsDialogOpen(false);

    // Reset form
    setSelectedClient("");
    setSelectedDate(new Date());
    setDuration("30");
    setNotes("");

    toast({
      title: "Check-in scheduled",
      description: `Check-in scheduled with ${client.firstName} ${client.lastName} on ${format(selectedDate, "PPP")}`,
    });
  };

  const handleStatusChange = (checkInId: string, newStatus: "scheduled" | "completed" | "cancelled") => {
    setCheckIns(
      checkIns.map((checkIn) => 
        checkIn.id === checkInId 
          ? { ...checkIn, status: newStatus } 
          : checkIn
      )
    );
    
    toast({
      title: "Status updated",
      description: `Check-in status updated to ${newStatus}`,
    });
  };

  // Sort check-ins by date (closest first)
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check-Ins</h1>
          <p className="text-muted-foreground">Schedule and manage client review sessions.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Check-In
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Check-In</DialogTitle>
              <DialogDescription>
                Create a new client check-in session to review progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Select Client</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clients</SelectLabel>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  initialFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={duration}
                  onValueChange={setDuration}
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or discussion points for the check-in"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleCheckIn}>Schedule Check-In</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {checkIns.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">No Check-Ins Scheduled</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-center text-muted-foreground max-w-md">
              No check-ins have been scheduled yet. Create your first check-in to start tracking client progress.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Schedule Your First Check-In</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCheckIns.map((checkIn) => (
                  <TableRow key={checkIn.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(checkIn.date), "PPP")}
                      </div>
                    </TableCell>
                    <TableCell>{checkIn.clientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {checkIn.duration} minutes
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${checkIn.status === "scheduled" ? "bg-blue-50 text-blue-700" : ""}
                        ${checkIn.status === "completed" ? "bg-green-50 text-green-700" : ""}
                        ${checkIn.status === "cancelled" ? "bg-red-50 text-red-700" : ""}`
                      }>
                        {checkIn.status.charAt(0).toUpperCase() + checkIn.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={checkIn.status}
                          onValueChange={(value: "scheduled" | "completed" | "cancelled") => 
                            handleStatusChange(checkIn.id, value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckIns;
