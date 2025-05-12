import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Flag, MoreVertical, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const [progressAmount, setProgressAmount] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Use useMemo for calculations to prevent recalculations on every render
  const progressPercentage = useMemo(() => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  }, [goal.currentAmount, goal.targetAmount]);
  
  const isCompleted = useMemo(() => progressPercentage >= 100, [progressPercentage]);
  
  // Safely handle the deadline date
  const daysLeft = useMemo(() => {
    try {
      const deadlineDate = goal.deadline instanceof Date 
        ? goal.deadline 
        : new Date(goal.deadline);
        
      if (isNaN(deadlineDate.getTime())) {
        return 0; // Return a default value if date is invalid
      }
      
      return Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error("Error calculating days left:", error);
      return 0;
    }
  }, [goal.deadline]);

  const handleProgressUpdate = () => {
    try {
      const amount = parseFloat(progressAmount);
      if (!isNaN(amount) && amount > 0) {
        onUpdateProgress(goal.id, amount);
        setProgressAmount('');
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Safely format the date
  const formattedDate = useMemo(() => {
    try {
      const date = goal.deadline instanceof Date 
        ? goal.deadline 
        : new Date(goal.deadline);
        
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  }, [goal.deadline]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary-200 to-primary-100 px-6 py-4 flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center">
          <Flag className="h-5 w-5 text-primary-600" />
          <CardTitle className="text-xl text-primary-800">{goal.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary-50 cursor-pointer">
              <MoreVertical className="h-4 w-4 text-primary-700" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-primary-100 shadow-md">
            <DropdownMenuItem onClick={() => onEdit(goal.id)} className="cursor-pointer hover:bg-primary-50">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary-100" />
            <DropdownMenuItem className="text-destructive cursor-pointer hover:bg-red-50" onClick={() => onDelete(goal.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-lg font-semibold">
              ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
            </span>
          </div>

          <Progress value={progressPercentage > 100 ? 100 : progressPercentage} className="h-2" />

          <div className="flex justify-between items-center text-sm">
            <span className={`font-medium ${isCompleted ? 'text-secondary-600' : 'text-primary-600'}`}>
              {progressPercentage.toFixed(0)}%
            </span>
            <span className="text-muted-foreground">
              {daysLeft > 0 ? `${daysLeft} days left` : 'Past due'}
            </span>
          </div>

          {goal.category && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{goal.category}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Target Date</span>
            <span>{formattedDate}</span>
          </div>

          {goal.note && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">{goal.note}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-primary-100">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 cursor-pointer" variant="outline">
              <Plus size={16} />
              Add Progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Goal Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Amount to add ($)</label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                />
              </div>
              <Button className="w-full cursor-pointer" onClick={handleProgressUpdate}>
                Add to Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;
