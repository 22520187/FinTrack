import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import TransactionCard from '../../components/transactions/TransactionCard';
import TransactionForm from '../../components/transactions/TransactionForm';
import { useToast } from '../../hooks/use-toast';

// Mock data
const mockTransactions = [
  {
    id: '1',
    amount: 2500,
    type: 'income',
    category: 'Salary',
    note: 'Monthly salary',
    timestamp: new Date(2023, 4, 1)
  },
  {
    id: '2',
    amount: 120,
    type: 'expense',
    category: 'Food',
    note: 'Grocery shopping',
    timestamp: new Date(2023, 4, 3)
  },
  {
    id: '3',
    amount: 45,
    type: 'expense',
    category: 'Transport',
    timestamp: new Date(2023, 4, 5)
  },
  {
    id: '4',
    amount: 200,
    type: 'expense',
    category: 'Entertainment',
    note: 'Movie night with friends',
    timestamp: new Date(2023, 4, 10)
  },
  {
    id: '5',
    amount: 500,
    type: 'income',
    category: 'Freelance',
    note: 'Website project',
    timestamp: new Date(2023, 4, 15)
  },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => {
    // Apply type filter
    if (filterType !== 'all' && transaction.type !== filterType) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        transaction.category.toLowerCase().includes(query) ||
        (transaction.note && transaction.note.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleAddTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prev => [transactionWithId, ...prev]);
    
    toast({
      title: "Transaction added",
      description: `Your ${newTransaction.type} has been recorded successfully.`,
    });
  };
  
  const handleEditTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === editingTransaction.id ? { ...updatedTransaction, id: t.id } : t)
    );
    
    setIsEditDialogOpen(false);
    setEditingTransaction(null);
    
    toast({
      title: "Transaction updated",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const handleDeleteTransaction = (id) => {
    setDeletingId(id);
  };
  
  const confirmDelete = () => {
    if (deletingId) {
      setTransactions(prev => prev.filter(t => t.id !== deletingId));
      
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed.",
      });
      
      setDeletingId(null);
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Transactions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search by category or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-xl text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              mode="edit"
              initialValues={editingTransaction}
              onSubmit={handleUpdateTransaction}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;