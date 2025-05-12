import { useState, useEffect, useCallback } from 'react';
import { Target, Trophy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog';
import { toast } from '../../hooks/use-toast';
import GoalCard from '../../components/goals/GoalCard';
import GoalForm from '../../components/goals/GoalForm';

// Mock data
const mockGoals = [
  {
    id: '1',
    name: 'Save for a new laptop',
    targetAmount: 1200,
    currentAmount: 500,
    deadline: new Date(2023, 10, 1),
    category: 'Electronics',
    note: 'Want to buy a MacBook Pro',
    createdAt: new Date(2023, 5, 15)
  },
  {
    id: '2',
    name: 'Emergency fund',
    targetAmount: 5000,
    currentAmount: 2000,
    deadline: new Date(2023, 12, 31),
    category: 'Savings',
    createdAt: new Date(2023, 4, 20)
  },
  {
    id: '3',
    name: 'Vacation trip',
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: new Date(2024, 6, 15),
    category: 'Travel',
    note: 'Summer vacation to Europe',
    createdAt: new Date(2023, 5, 1)
  }
];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use useCallback for handlers to prevent unnecessary re-renders
  const handleAddGoal = useCallback((newGoal) => {
    // Generate a unique ID for the new goal
    const goalWithId = {
      ...newGoal,
      id: Date.now().toString(),
      createdAt: new Date(),
      currentAmount: 0
    };
    
    setGoals(prev => [...prev, goalWithId]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Goal created",
      description: "Your new goal has been added successfully."
    });
  }, []);

  const handleEditGoal = useCallback((id) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setEditingGoal(goal);
      setIsEditDialogOpen(true);
    }
  }, [goals]);

  const handleUpdateGoal = useCallback((updatedGoal) => {
    if (!editingGoal) return;
    
    try {
      setGoals(prev => 
        prev.map(g => g.id === editingGoal.id ? { 
          ...updatedGoal, 
          id: g.id, 
          createdAt: g.createdAt,
          // Ensure deadline is properly handled
          deadline: updatedGoal.deadline instanceof Date ? 
            updatedGoal.deadline : 
            new Date(updatedGoal.deadline)
        } : g)
      );
      
      setIsEditDialogOpen(false);
      setEditingGoal(null);
      
      toast({
        title: "Goal updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your goal."
      });
    }
  }, [editingGoal]);

  const handleDeleteGoal = useCallback((id) => {
    try {
      setGoals(prev => prev.filter(g => g.id !== id));
      
      toast({
        title: "Goal deleted",
        description: "The goal has been removed."
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was a problem deleting your goal."
      });
    }
  }, []);

  const handleUpdateProgress = useCallback((id, amount) => {
    try {
      setGoals(prev => 
        prev.map(g => g.id === id ? { 
          ...g, 
          currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) 
        } : g)
      );
      
      toast({
        title: "Progress updated",
        description: `Added $${amount} to your goal progress.`
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your progress."
      });
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Financial Goals</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 cursor-pointer">
              <Target size={18} />
              Create New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <GoalForm onSubmit={handleAddGoal} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onUpdateProgress={handleUpdateProgress}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No goals created yet</p>
            <p className="text-muted-foreground mb-6">Create your first financial goal to start tracking your progress</p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Target size={18} />
                  Create Your First Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                </DialogHeader>
                <GoalForm onSubmit={handleAddGoal} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          {editingGoal && (
            <GoalForm
              mode="edit"
              initialValues={editingGoal}
              onSubmit={handleUpdateGoal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
