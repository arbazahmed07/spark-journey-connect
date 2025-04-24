
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRight, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { WorkoutPlan } from "@/types";

const WorkoutPlans = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([
    {
      id: "1",
      name: "Beginner Strength",
      description: "Full body workout plan ideal for beginners",
      frequency: 3,
      exercises: [
        { name: "Squats", sets: 3, reps: 10, weight: 0 },
        { name: "Push-ups", sets: 3, reps: 10, weight: 0 },
        { name: "Dumbbell Rows", sets: 3, reps: 10, weight: 10 }
      ]
    },
    {
      id: "2",
      name: "Intermediate Hypertrophy",
      description: "Split routine focused on muscle growth",
      frequency: 5,
      exercises: [
        { name: "Bench Press", sets: 4, reps: 8, weight: 70 },
        { name: "Deadlifts", sets: 4, reps: 8, weight: 100 },
        { name: "Pull-ups", sets: 4, reps: 8, weight: 0 },
        { name: "Shoulder Press", sets: 4, reps: 10, weight: 20 }
      ]
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();

  const handleCreatePlan = () => {
    setCurrentPlan({
      id: String(Date.now()),
      name: "",
      description: "",
      frequency: 3,
      exercises: []
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setCurrentPlan({ ...plan });
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
    toast({
      title: "Workout plan deleted",
      description: "The workout plan has been successfully deleted."
    });
  };

  const handleAddExercise = () => {
    if (!currentPlan) return;
    
    setCurrentPlan({
      ...currentPlan,
      exercises: [
        ...currentPlan.exercises,
        { name: "", sets: 3, reps: 10, weight: 0 }
      ]
    });
  };

  const handleRemoveExercise = (index: number) => {
    if (!currentPlan) return;
    
    const updatedExercises = [...currentPlan.exercises];
    updatedExercises.splice(index, 1);
    
    setCurrentPlan({
      ...currentPlan,
      exercises: updatedExercises
    });
  };

  const handleUpdateExercise = (index: number, field: keyof typeof currentPlan.exercises[0], value: string | number) => {
    if (!currentPlan) return;
    
    const updatedExercises = [...currentPlan.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'name' ? value : Number(value)
    };
    
    setCurrentPlan({
      ...currentPlan,
      exercises: updatedExercises
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
        title: "Workout plan updated",
        description: "Your changes have been saved."
      });
    } else {
      setPlans([...plans, currentPlan]);
      toast({
        title: "Workout plan created",
        description: "New workout plan has been added."
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workout Plans</h1>
          <p className="text-muted-foreground">Create and manage exercise routines for your clients.</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-center text-muted-foreground">No workout plans created yet. Click the button above to create your first plan.</p>
            <Button onClick={handleCreatePlan}>Create Your First Workout Plan</Button>
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
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">Frequency: {plan.frequency}x per week</span>
                  <span className="text-sm font-medium">Exercises: {plan.exercises.length}</span>
                </div>
                <div className="space-y-2">
                  {plan.exercises.slice(0, 3).map((exercise, i) => (
                    <div key={i} className="text-xs bg-slate-50 p-2 rounded flex justify-between">
                      <span>{exercise.name}</span>
                      <span>{exercise.sets} x {exercise.reps} {exercise.weight ? `@ ${exercise.weight}kg` : ''}</span>
                    </div>
                  ))}
                  {plan.exercises.length > 3 && (
                    <p className="text-xs text-center text-muted-foreground">
                      +{plan.exercises.length - 3} more exercises
                    </p>
                  )}
                </div>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentPlan && plans.some(plan => plan.id === currentPlan.id) 
                ? "Edit Workout Plan" 
                : "Create Workout Plan"}
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
              <Label htmlFor="frequency" className="text-right">
                Weekly Frequency
              </Label>
              <Input
                id="frequency"
                type="number"
                className="col-span-3"
                min="1" 
                max="7"
                value={currentPlan?.frequency || 3}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, frequency: Number(e.target.value) } : null
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Exercises</h3>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddExercise}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Exercise
                </Button>
              </div>
              
              {currentPlan?.exercises.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No exercises added yet. Click 'Add Exercise' to start.
                </p>
              )}
              
              {currentPlan?.exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center border p-2 rounded-md">
                  <div className="col-span-4">
                    <Label htmlFor={`exercise-${index}`} className="text-xs">
                      Exercise Name
                    </Label>
                    <Input
                      id={`exercise-${index}`}
                      value={exercise.name}
                      onChange={(e) => handleUpdateExercise(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`sets-${index}`} className="text-xs">
                      Sets
                    </Label>
                    <Input
                      id={`sets-${index}`}
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => handleUpdateExercise(index, 'sets', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`reps-${index}`} className="text-xs">
                      Reps
                    </Label>
                    <Input
                      id={`reps-${index}`}
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => handleUpdateExercise(index, 'reps', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`weight-${index}`} className="text-xs">
                      Weight (kg)
                    </Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      min="0"
                      value={exercise.weight || 0}
                      onChange={(e) => handleUpdateExercise(index, 'weight', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-10 w-10 p-0 text-red-500"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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

export default WorkoutPlans;
