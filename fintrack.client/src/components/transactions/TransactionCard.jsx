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
  const { transactionId, amount, type, categoryName, note, createdAt } = transaction;
  console.log("createdAt", createdAt)

  console.log("transactionId", transactionId)
  const isExpense = type === 'expense';

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-full ${isExpense ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
            {isExpense ?
              <ArrowDown className="h-4 w-4 text-finance-expense" /> :
              <ArrowUp className="h-4 w-4 text-finance-income" />
            }
          </div>
          <span className="font-medium">{categoryName}</span>
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
          {formatDistanceToNow(
            (() => {
              const date = new Date(createdAt);
              // Always shift 7 hours for Vietnam time
              return new Date(date.getTime() + 7 * 60 * 60 * 1000);
            })(),
            { addSuffix: true }
          )}
        </span>
        <div className="flex space-x-2">
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => onEdit(transactionId)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => onDelete(transactionId)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionCard;