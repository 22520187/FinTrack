import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

const GoalProgressCard = ({ goals }) => {
  const navigate = useNavigate();
  
  // Show at most the top 3 goals that aren't completed
  const activeGoals = goals
    .filter(goal => goal.currentAmount < goal.targetAmount)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);
    
  const hasGoals = activeGoals.length > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Goal Progress</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/goals')}
          className="text-xs cursor-pointer"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {hasGoals ? (
          <div className="space-y-4">
            {activeGoals.map(goal => {
              const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={progressPercentage > 100 ? 100 : progressPercentage} className="h-2" />
                </div>
              );
            })}
            
            <Button 
              variant="outline" 
              className="w-full mt-2 gap-2 cursor-pointer" 
              size="sm"
              onClick={() => navigate('/goals')}
            >
              <Plus size={16} />
              Update Goal Progress
            </Button>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-3" />
            <h4 className="text-lg font-medium mb-1">No active goals</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Set financial goals to track your savings progress
            </p>
            <Button 
              onClick={() => navigate('/goals')} 
              className="gap-2"
            >
              <Plus size={16} />
              Create a Goal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressCard;