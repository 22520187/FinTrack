import { useState } from 'react';
import { Spin } from 'antd';
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
import { useEffect } from 'react';
import categoryService from '../../services/category.service';

const TransactionForm = ({
  onSubmit,
  initialValues = {
    amount: 0,
    type: 'expense',
    category: 'Food',
    note: ''
  },
  mode = 'create',
  className = '',
  loading = false
}) => {
  const [categories, setCategories] = useState(null);
  const [amount, setAmount] = useState(initialValues.amount);
  const [type, setType] = useState(initialValues.type);
  const [categoryName, setCategoryName] = useState(initialValues.category || '');
  const [note, setNote] = useState(initialValues.note || '');

  useEffect(() => {
    const getCategory = async () => {
      const response = await categoryService.getAllCategory()

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Fail to get category",
          description: "Please make sure your information is correct.",
        });
        return;
      }

      const categories = response.data
      console.log("categories", categories);

      setCategories(categories)
    }

    getCategory()
  }, [])

  // Reset category when type changes
  useEffect(() => {
    setCategoryName('');
  }, [type])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!categoryName || categoryName.trim() === '') {
      alert('Please select a category');
      return;
    }

    onSubmit({
      amount,
      type,
      categoryName,
      note: note.trim() !== '' ? note : undefined,
      createdAt: new Date(),
    });

    // Reset form if creating new transaction
    if (mode === 'create') {
      setAmount(0);
      setCategoryName('');
      setNote('');
    }
  };

  return (
    <Card className={`w-full bg-white ${className} ${loading ? 'relative' : ''}`}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <Spin size="large" />
            <span className="mt-2 text-sm text-gray-600">Processing transaction...</span>
          </div>
        </div>
      )}
      <CardHeader className="text-left">
        <CardTitle className="text-primary-900">
          {mode === 'create' ? 'Add New Transaction' : 'Edit Transaction'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-left">
            <label className=" text-sm font-medium text-primary-800" htmlFor="amount">
              Amount
            </label>
            <Input
              className="mt-2"
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

          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-primary-800">
              Transaction Type
            </label>
            <div className="flex gap-2">
              <Button

                type="button"
                variant={type === 'expense' ? 'destructive' : 'outline'}
                className={type === 'expense'
                  ? 'mt-2 bg-compleprimary-500 hover:bg-compleprimary-600 text-white cursor-pointer'
                  : 'mt-2 border-primary-200 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'}
                onClick={() => {
                  setType('expense');
                }}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={type === 'income' ? 'secondary' : 'outline'}
                className={type === 'income'
                  ? 'mt-2 bg-secondary-500 hover:bg-secondary-600 text-white cursor-pointer'
                  : 'mt-2 border-primary-200 hover:bg-primary-50 hover:text-primary-600 cursor-pointer'}
                onClick={() => {
                  setType('income');
                }}
              >
                Income
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-primary-800" htmlFor="category">
              Category
            </label>
            <Select value={categoryName} onValueChange={setCategoryName} required>
              <SelectTrigger className="mt-2 border-primary-200 cursor-pointer">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories ? categories
                  .filter(cat => cat.type === type)
                  .map((cat) => (
                  <SelectItem key={cat.categoryName + '-' + cat.type} value={cat.categoryName}>
                    {cat.categoryName}
                  </SelectItem>
                )) : ""}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-primary-800" htmlFor="note">
              Note (Optional)
            </label>
            <Textarea
              className="mt-2"
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
            className="w-full bg-primary-500 hover:bg-primary-600 text-white cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spin size="small" className="mr-2" />
                {mode === 'create' ? 'Adding...' : 'Updating...'}
              </div>
            ) : (
              mode === 'create' ? 'Add Transaction' : 'Update Transaction'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TransactionForm;