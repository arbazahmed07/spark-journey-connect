
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientCard from "@/components/ClientCard";
import { mockClients } from "@/data/mockData";
import { GoalType, Client } from "@/types";
import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddClientForm from "@/components/AddClientForm";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoalType, setSelectedGoalType] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Filter clients based on search query and goal type
  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      fullName.includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGoalType = selectedGoalType === null || 
      client.goals.some(goal => goal.type === selectedGoalType);

    return matchesSearch && matchesGoalType;
  });

  // Get unique goal types from clients
  const goalTypes = Object.values(GoalType);

  // Handle new client addition
  const handleAddClient = (newClient: Client) => {
    setClients([...clients, newClient]);
    setIsAddingClient(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client profiles and progress.</p>
        </div>
        <Button onClick={() => setIsAddingClient(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filter by Goal Type</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGoalType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGoalType(null)}
              >
                All
              </Button>
              {goalTypes.map((goalType) => (
                <Button
                  key={goalType}
                  variant={selectedGoalType === goalType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGoalType(goalType)}
                >
                  {goalType}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-medium">No clients found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <AddClientForm 
            onSuccess={handleAddClient} 
            onCancel={() => setIsAddingClient(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
