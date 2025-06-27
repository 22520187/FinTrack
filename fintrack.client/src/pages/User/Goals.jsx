import { useState, useCallback } from 'react';
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
import { useGoals } from '../../hooks/useAPI';
import GoalCard from '../../components/goals/GoalCard';
import GoalForm from '../../components/goals/GoalForm';

const Goals = () => {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal, addProgress } = useGoals();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Use useCallback for handlers to prevent unnecessary re-renders
  const handleAddGoal = useCallback(async (newGoal) => {
    try {
      console.log("newGoal",newGoal)
      await createGoal(newGoal);
      setIsAddDialogOpen(false);

      toast({
        title: "Goal created",
        description: "Your new goal has been added successfully."
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was a problem creating your goal."
      });
    }
  }, [createGoal]);

  const handleEditGoal = useCallback((id) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setEditingGoal(goal);
      setIsEditDialogOpen(true);
    }
  }, [goals]);

  const handleUpdateGoal = useCallback(async (updatedGoal) => {
    if (!editingGoal) return;

    try {
      await updateGoal(editingGoal.id, updatedGoal);
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
  }, [editingGoal, updateGoal]);

  const handleDeleteGoal = useCallback(async (id) => {
    try {
      await deleteGoal(id);

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
  }, [deleteGoal]);

  const handleUpdateProgress = useCallback(async (id, amount) => {
    try {
      await addProgress(id, { savedAmount: amount });

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
  }, [addProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading goals: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Financial Goals</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
