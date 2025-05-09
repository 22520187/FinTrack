import { useState } from 'react';
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

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = progressPercentage >= 100;
  const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleProgressUpdate = () => {
    const amount = parseFloat(progressAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateProgress(goal.id, amount);
      setProgressAmount('');
      setIsAddDialogOpen(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary-100 to-primary-50 px-6 py-4 flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center">
          <Flag className="h-5 w-5 text-primary-600" />
          <CardTitle className="text-xl text-primary-800">{goal.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary-50">
              <MoreVertical className="h-4 w-4 text-primary-700" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(goal.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(goal.id)}>
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
            <span>{format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
          </div>

          {goal.note && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">{goal.note}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-primary-50">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
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
              <Button className="w-full" onClick={handleProgressUpdate}>
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