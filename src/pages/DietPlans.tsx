
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DietPlan } from "@/types";

const DietPlans = () => {
  const [plans, setPlans] = useState<DietPlan[]>([
    {
      id: "1",
      name: "Weight Loss Plan",
      description: "Low calorie diet focused on healthy proteins and vegetables",
      dailyCalories: 1800,
      macros: { protein: 40, carbs: 30, fats: 30 },
      meals: [
        { name: "Breakfast", description: "Greek yogurt with berries and honey" },
        { name: "Lunch", description: "Grilled chicken salad with olive oil dressing" },
        { name: "Dinner", description: "Baked salmon with asparagus and quinoa" }
      ]
    },
    {
      id: "2",
      name: "Muscle Building",
      description: "High protein diet with balanced carbs for muscle growth",
      dailyCalories: 3000,
      macros: { protein: 40, carbs: 40, fats: 20 },
      meals: [
        { name: "Breakfast", description: "Oatmeal with banana, protein powder and peanut butter" },
        { name: "Lunch", description: "Turkey wrap with whole grain tortilla and vegetables" },
        { name: "Dinner", description: "Steak with sweet potatoes and broccoli" },
        { name: "Snack", description: "Protein shake with almonds" }
      ]
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  const handleCreatePlan = () => {
    setCurrentPlan({
      id: String(Date.now()),
      name: "",
      description: "",
      dailyCalories: 2000,
      macros: { protein: 30, carbs: 40, fats: 30 },
      meals: []
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: DietPlan) => {
    setCurrentPlan({ ...plan });
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
    toast({
      title: "Diet plan deleted",
      description: "The diet plan has been successfully deleted."
    });
  };

  const handleSavePlan = () => {
    if (!currentPlan?.name) {
      toast({
        title: "Error",
        description: "Plan name is required",
        variant: "destructive"
      });
      return;
    }

    if (plans.some(plan => plan.id === currentPlan.id)) {
      setPlans(plans.map(plan => plan.id === currentPlan.id ? currentPlan : plan));
      toast({
        title: "Diet plan updated",
        description: "Your changes have been saved."
      });
    } else {
      setPlans([...plans, currentPlan]);
      toast({
        title: "Diet plan created",
        description: "New diet plan has been added."
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Diet Plans</h1>
          <p className="text-muted-foreground">Create and manage nutrition plans for your clients.</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-center text-muted-foreground">No diet plans created yet. Click the button above to create your first plan.</p>
            <Button onClick={handleCreatePlan}>Create Your First Diet Plan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-slate-100 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-bold">{plan.dailyCalories}</p>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-bold">{plan.macros.protein}%</p>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Carbs/Fat</p>
                    <p className="font-bold">{plan.macros.carbs}/{plan.macros.fats}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Meals: {plan.meals.length}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 pb-4">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditPlan(plan)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" 
                    onClick={() => handleDeletePlan(plan.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentPlan && plans.some(plan => plan.id === currentPlan.id) 
                ? "Edit Diet Plan" 
                : "Create Diet Plan"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={currentPlan?.name || ""}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={currentPlan?.description || ""}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Daily Calories
              </Label>
              <Input
                id="calories"
                type="number"
                className="col-span-3"
                value={currentPlan?.dailyCalories || 2000}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, dailyCalories: Number(e.target.value) } : null
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Macros (%)
              </Label>
              <div className="col-span-3 flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="protein" className="text-xs">Protein</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={currentPlan?.macros.protein || 30}
                    onChange={(e) => setCurrentPlan(prev => 
                      prev ? { ...prev, macros: { ...prev.macros, protein: Number(e.target.value) } } : null
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="carbs" className="text-xs">Carbs</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={currentPlan?.macros.carbs || 40}
                    onChange={(e) => setCurrentPlan(prev => 
                      prev ? { ...prev, macros: { ...prev.macros, carbs: Number(e.target.value) } } : null
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="fats" className="text-xs">Fats</Label>
                  <Input
                    id="fats"
                    type="number"
                    value={currentPlan?.macros.fats || 30}
                    onChange={(e) => setCurrentPlan(prev => 
                      prev ? { ...prev, macros: { ...prev.macros, fats: Number(e.target.value) } } : null
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSavePlan}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietPlans;
