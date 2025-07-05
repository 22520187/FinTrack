import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Skeleton, Card } from 'antd';
import BalanceCard from '../../components/dashboard/BalanceCard';
import ExpensesByCategoryChart from '../../components/dashboard/ExpensesByCategoryChart';
import RecentTransactionsList from '../../components/dashboard/RecentTransactionsList';
import TransactionHistoryChart from '../../components/dashboard/TransactionHistoryChart';
import TransactionForm from '../../components/transactions/TransactionForm';
import GoalProgressCard from '../../components/dashboard/GoalProgressCard';
import { useToast } from '../../hooks/use-toast';
import { useDashboard, useGoals, useTransactions } from '../../hooks/useAPI';

// Component trang chủ hiển thị dashboard tài chính tổng quan
const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

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

  // Xử lý hiển thị lỗi khi load dữ liệu
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

  // Xử lý thêm transaction mới và refresh dashboard
  const handleAddTransaction = async (newTransaction) => {
    setIsAddingTransaction(true);
    try {
      // Convert frontend format to backend format
      const transactionData = {
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        categoryName: newTransaction.categoryName,
        note: newTransaction.note,
        isImportant: newTransaction.isImportant || false,
        // createdAt will be set automatically by database default value
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
    } finally {
      setIsAddingTransaction(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white text-ebony min-h-screen p-6">
        <div className="flex items-center justify-center mb-6">
          <Spin size="large" />
          <span className="ml-3 text-lg">Loading dashboard...</span>
        </div>

        {/* Skeleton for dashboard layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
          <div className="lg:col-span-2">
            <Card>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
          <Card>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <Skeleton active paragraph={{ rows: 5 }} />
          </Card>
          <div className="lg:col-span-2">
            <Card>
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-ebony min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-left">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {dashboardLoading ? (
          <Card>
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        ) : (
          <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />
        )}
        <div className="lg:col-span-2 flex justify-start">
          <TransactionForm
            onSubmit={handleAddTransaction}
            className="w-full"
            loading={isAddingTransaction}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {dashboardLoading ? (
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          ) : (
            <TransactionHistoryChart data={transactionHistory || []} />
          )}
        </div>
        {goalsLoading ? (
          <Card>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ) : (
          <GoalProgressCard goals={goals || []} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {dashboardLoading ? (
          <Card>
            <Skeleton active paragraph={{ rows: 5 }} />
          </Card>
        ) : (
          <ExpensesByCategoryChart data={categoryExpenses || []} />
        )}
        <div className="lg:col-span-2">
          {transactionsLoading ? (
            <Card>
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          ) : (
            <RecentTransactionsList
              transactions={transactions || []}
              onViewAll={() => navigate('/transactions')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;