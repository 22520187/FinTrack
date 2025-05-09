import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceCard from '../../components/dashboard/BalanceCard';
import ExpensesByCategoryChart from '../../components/dashboard/ExpensesByCategoryChart';
import RecentTransactionsList from '../../components/dashboard/RecentTransactionsList';
import TransactionHistoryChart from '../../components/dashboard/TransactionHistoryChart';
import TransactionForm from '../../components/transactions/TransactionForm';
import GoalProgressCard from '../../components/dashboard/GoalProgressCard';
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
  // ...existing transactions
];

const categoryExpenses = [
  { name: 'Food', value: 450, color: '#50bbf5' }, // primary-400
  { name: 'Transport', value: 200, color: '#5069f5' }, // secondary-400
  { name: 'Entertainment', value: 320, color: '#f58a50' }, // compleprimary-300
  { name: 'Shopping', value: 180, color: '#f4ee69' }, // complesecond-400
  { name: 'Utilities', value: 150, color: '#46aff2' }, // primary-500
];

const transactionHistory = [
  { date: 'Jan', income: 3000, expense: 1200 },
  { date: 'Feb', income: 3200, expense: 1500 },
  { date: 'Mar', income: 2800, expense: 1800 },
  { date: 'Apr', income: 3500, expense: 1300 },
  { date: 'May', income: 3000, expense: 1400 },
];

const mockGoals = [
  {
    id: '1',
    name: 'Save for a new laptop',
    targetAmount: 1200,
    currentAmount: 500,
    deadline: new Date(2023, 10, 1)
  },
  // ...existing goals
];

const Home = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [goals, setGoals] = useState(mockGoals);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

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

  return (
    <div className="bg-white dark:bg-card-dark text-ebony dark:text-white-smoke min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-800 dark:text-primary-300">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />
        <div className="lg:col-span-2">
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TransactionHistoryChart data={transactionHistory} />
        </div>
        <GoalProgressCard goals={goals} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ExpensesByCategoryChart data={categoryExpenses} />
        <div className="lg:col-span-2">
          <RecentTransactionsList
            transactions={transactions}
            onViewAll={() => navigate('/transactions')}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;