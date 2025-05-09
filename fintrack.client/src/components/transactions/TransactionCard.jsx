import { formatDistanceToNow } from 'date-fns';
import { ArrowDown, ArrowUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '../ui/card';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { id, amount, type, category, note, timestamp } = transaction;
  const isExpense = type === 'expense';
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-full ${isExpense ? 'bg-finance-expense/10' : 'bg-finance-income/10'}`}>
            {isExpense ? 
              <ArrowDown className="h-4 w-4 text-finance-expense" /> : 
              <ArrowUp className="h-4 w-4 text-finance-income" />
            }
          </div>
          <span className="font-medium">{category}</span>
        </div>
        <div className={`font-bold ${isExpense ? 'expense-text' : 'income-text'}`}>
          {isExpense ? '-' : '+'} ${amount.toFixed(2)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {note && <p className="text-sm text-muted-foreground">{note}</p>}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionCard;