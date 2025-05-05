import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Mock categories
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'];

const TransactionForm = ({ 
  onSubmit, 
  initialValues = { 
    amount: 0, 
    type: 'expense', 
    category: 'Food',  
    note: '' 
  },
  mode = 'create'
}) => {
  const [amount, setAmount] = useState(initialValues.amount);
  const [type, setType] = useState(initialValues.type);
  const [category, setCategory] = useState(initialValues.category);
  const [note, setNote] = useState(initialValues.note || '');
  
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onSubmit({
      amount,
      type,
      category,
      note: note.trim() !== '' ? note : undefined,
      timestamp: new Date(),
    });

    // Reset form if creating new transaction
    if (mode === 'create') {
      setAmount(0);
      setNote('');
    }
  };
  
  return (
    <Card className="w-full bg-white dark:bg-card-dark">
      <CardHeader>
        <CardTitle className="text-primary-900 dark:text-primary-100">
          {mode === 'create' ? 'Add New Transaction' : 'Edit Transaction'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-800 dark:text-primary-200" htmlFor="amount">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-800 dark:text-primary-200">
              Transaction Type
            </label>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className={type === 'expense' 
                  ? 'bg-compleprimary-500 hover:bg-compleprimary-600 text-white' 
                  : 'border-primary-200 hover:bg-primary-50 hover:text-primary-600'}
                onClick={() => {
                  setType('expense');
                  setCategory(EXPENSE_CATEGORIES[0]);
                }}
              >
                Expense
              </Button>
              <Button 
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className={type === 'income' 
                  ? 'bg-secondary-400 hover:bg-secondary-500 text-white' 
                  : 'border-primary-200 hover:bg-primary-50 hover:text-primary-600'}
                onClick={() => {
                  setType('income');
                  setCategory(INCOME_CATEGORIES[0]);
                }}
              >
                Income
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-800 dark:text-primary-200" htmlFor="category">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-primary-200 dark:border-primary-700">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-800 dark:text-primary-200" htmlFor="note">
              Note (Optional)
            </label>
            <Textarea
              id="note"
              placeholder="Add a note for this transaction"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-primary-400 hover:bg-primary-500 text-white" 
            type="submit"
          >
            {mode === 'create' ? 'Add Transaction' : 'Update Transaction'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TransactionForm;