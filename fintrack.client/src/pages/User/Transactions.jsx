import { useEffect, useState, useRef } from 'react';
import { Spin, Skeleton } from 'antd';
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
import transactionService from '../../services/transaction.service'
import { useToast } from '../../hooks/use-toast';
import categoryService from '../../services/category.service'
import { useSearchParams } from 'react-router-dom';


const Transactions = () => {
  const [categories, setCategories] = useState();
  const [filteredCategorieType, setFilteredCategorieType] = useState("")
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterImportant, setFilterImportant] = useState('all'); // 'all', 'important', 'normal'
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isFirstMounted = useRef(true)
  const didSetFromParam = useRef(false);
  const { toast } = useToast();
  const [params] = useSearchParams()

  // Loading states
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.get("categoryName")) {
      setFilteredCategorieType(params.get("categoryName"))
      setSearchQuery(params.get("categoryName"))
      didSetFromParam.current = true;
    }


  }, [])

  useEffect(() => {
    if (isFirstMounted.current) {
      isFirstMounted.current = false;
      return;
    }

    if (filterType === 'all') {

      if (didSetFromParam.current) {
        didSetFromParam.current = false; // reset this flag for future
        return;
      }

      setSearchQuery("");
    }

  }, [filterType]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        setIsLoadingCategories(true);
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
        setCategories(categories)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading categories",
          description: "Something went wrong while loading categories.",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    }

    getCategory()
  }, [])
  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        setIsLoadingTransactions(true);
        const response = await transactionService.getAllTransaction()

        if (response.status !== 200) {
          toast({
            variant: "destructive",
            title: "Fail to get transaction",
            description: "Please make sure your information is correct.",
          });
          return;
        }

        const transactions = response.data
        setTransactions(transactions)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading transactions",
          description: "Something went wrong while loading transactions.",
        });
      } finally {
        setIsLoadingTransactions(false);
      }
    }

    getAllTransaction()
  }, [])

  function toVietnamTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Get UTC+7 offset in minutes
    const vietnamOffset = 7 * 60;
    // Get local offset in minutes
    const localOffset = date.getTimezoneOffset();
    // Calculate the difference and add to the date
    const diff = vietnamOffset + localOffset;
    const vietnamDate = new Date(date.getTime() + diff * 60000);
    // Format as you like, e.g. 'YYYY-MM-DD HH:mm'
    return vietnamDate.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by type
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }

      // Filter by importance
      if (filterImportant !== 'all') {
        if (filterImportant === 'important' && !transaction.isImportant) {
          return false;
        }
        if (filterImportant === 'normal' && transaction.isImportant) {
          return false;
        }
      }

      // Apply search filter (case insensitive)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        if (!transaction.categoryName) return false
        return (
          transaction.categoryName.toLowerCase().includes(query) ||
          (transaction.note && transaction.note.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

  const handleAddTransaction = async (newTransaction) => {
    console.log("newTransaction", newTransaction);

    try {
      setIsCreating(true);
      const response = await transactionService.createTransaction(newTransaction)

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Fail to create transaction",
          description: "Please make sure your information is correct.",
        });
        return;
      }
      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Transaction added",
        description: `Your ${newTransaction.type} has been recorded successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating transaction",
        description: "Something went wrong while creating the transaction.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTransaction = (id) => {
    console.log("id", id)
    const transaction = transactions.find(t => t.transactionId === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction) => {
    console.log("editingTransaction", editingTransaction)

    try {
      setIsUpdating(true);
      const response = await transactionService.updateTransaction(updatedTransaction, editingTransaction.transactionId)

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Fail to edit transaction",
          description: "Please make sure your information is correct.",
        });
        return;
      }
      setTransactions(prev =>
        prev.map(t => t.transactionId === editingTransaction.transactionId ? { ...updatedTransaction, transactionId: t.transactionId } : t)
      );

      setIsEditDialogOpen(false);
      setEditingTransaction(null);

      toast({
        title: "Transaction updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating transaction",
        description: "Something went wrong while updating the transaction.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTransaction = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        setIsDeleting(true);
        setTransactions(prev => prev.filter(t => t.transactionId !== deletingId));
        const response = await transactionService.deleteTransaction(deletingId)

        if (response.status !== 200) {
          toast({
            variant: "destructive",
            title: "Fail to delete transaction",
            description: "Please make sure your information is correct.",
          });
          return;
        }
        toast({
          title: "Transaction deleted",
          description: "The transaction has been removed.",
        });

        setDeletingId(null);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error deleting transaction",
          description: "Something went wrong while deleting the transaction.",
        });
      } finally {
        setIsDeleting(false);
      }
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
            <TransactionForm onSubmit={handleAddTransaction} loading={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-1/2">
          <Input
            placeholder="Search by category or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full lg:w-1/4">
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
        <div className="w-full lg:w-1/4">
          <Select value={filterImportant} onValueChange={setFilterImportant}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by importance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="important">Important Only</SelectItem>
              <SelectItem value="normal">Normal Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingTransactions ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))
        ) : (
          <>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TransactionCard
                  key={transaction.transactionId}
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
          </>
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
              loading={isUpdating}
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
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? <Spin size="small" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;