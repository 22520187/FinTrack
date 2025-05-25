import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceCard from '../../components/dashboard/BalanceCard';
import ExpensesByCategoryChart from '../../components/dashboard/ExpensesByCategoryChart';
import RecentTransactionsList from '../../components/dashboard/RecentTransactionsList';
import TransactionHistoryChart from '../../components/dashboard/TransactionHistoryChart';
import TransactionForm from '../../components/transactions/TransactionForm';
import GoalProgressCard from '../../components/dashboard/GoalProgressCard';
import { useToast } from '../../hooks/use-toast';
import { useDashboard, useGoals, useTransactions } from '../../hooks/useAPI';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use API hooks
  const {
    summary,
    categoryExpenses,
    transactionHistory,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useDashboard();

  const {
    goals,
    loading: goalsLoading,
    error: goalsError
  } = useGoals();

  const {
    transactions,
    createTransaction,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions
  } = useTransactions();

  // Handle loading states
  const isLoading = dashboardLoading || goalsLoading || transactionsLoading;

  // Handle errors
  useEffect(() => {
    if (dashboardError || goalsError || transactionsError) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    }
  }, [dashboardError, goalsError, transactionsError, toast]);

  // Get balance from summary or calculate from transactions
  const balance = summary?.balance || 0;
  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;

  const handleAddTransaction = async (newTransaction) => {
    try {
      // Convert frontend format to backend format
      const transactionData = {
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        categoryName: newTransaction.category,
        note: newTransaction.note,
        isImportant: newTransaction.isImportant || false,
        createdAt: new Date().toISOString(),
      };

      await createTransaction(transactionData);

      // Refresh dashboard data to get updated totals
      refetchDashboard();
      refetchTransactions();

      toast({
        title: "Transaction added",
        description: `Your ${newTransaction.type} has been recorded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white text-ebony min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-ebony min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-left">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />
        <div className="lg:col-span-2 flex justify-start">
          <TransactionForm onSubmit={handleAddTransaction} className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TransactionHistoryChart data={transactionHistory || []} />
        </div>
        <GoalProgressCard goals={goals || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ExpensesByCategoryChart data={categoryExpenses || []} />
        <div className="lg:col-span-2">
          <RecentTransactionsList
            transactions={transactions || []}
            onViewAll={() => navigate('/transactions')}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;