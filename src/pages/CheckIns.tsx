
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const CheckIns = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check-Ins</h1>
          <p className="text-muted-foreground">Schedule and manage client review sessions.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule Check-In
        </Button>
      </div>

      <Card className="border-dashed border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Check-Ins Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <p className="text-center text-muted-foreground max-w-md">
            This feature is coming in the next update. Soon you'll be able to schedule, track and record client check-in sessions.
          </p>
          <Button disabled>Schedule Your First Check-In</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckIns;
