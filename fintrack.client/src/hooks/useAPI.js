import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboard.service';
import goalService from '../services/goal.service';
import transactionService from '../services/transaction.service';
import categoryService from '../services/category.service';

// Custom hook for dashboard data
export const useDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryResponse, categoryResponse, historyResponse] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getCategoryExpenses(),
        dashboardService.getTransactionHistory(),
      ]);

      setSummary(summaryResponse.data);

      setCategoryExpenses(categoryResponse.data);
      setTransactionHistory(historyResponse.data);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    summary,
    categoryExpenses,
    transactionHistory,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

// Custom hook for goals
export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await goalService.getAllGoals();
      const data = response.data;

      // Map API response to frontend format
      const mappedGoals = data.map(goal => ({
        id: goal.goalId,
        name: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.savedAmount || 0,
        deadline: new Date(goal.deadline + 'T00:00:00'), // Add time to DateOnly format
        createdAt: new Date(goal.createdAt),
        progressPercentage: goal.progressPercentage,
        isCompleted: goal.isCompleted
      }));

      setGoals(mappedGoals);
    } catch (err) {
      setError(err.message);
      console.error('Goals API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData) => {
    try {
      // Convert frontend format to backend format
      const backendGoalData = {
        title: goalData.name,
        targetAmount: goalData.targetAmount,
        deadline: goalData.deadline.toISOString().split('T')[0], // Convert to DateOnly format
        savedAmount: goalData.currentAmount || 0
      };

      const response = await goalService.createGoal(backendGoalData);
      const newGoal = response.data;

      // Map response back to frontend format
      const mappedGoal = {
        id: newGoal.goalId,
        name: newGoal.title,
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.savedAmount || 0,
        deadline: new Date(newGoal.deadline + 'T00:00:00'), // Add time to DateOnly format
        createdAt: new Date(newGoal.createdAt),
        progressPercentage: newGoal.progressPercentage,
        isCompleted: newGoal.isCompleted
      };

      setGoals(prev => [mappedGoal, ...prev]);
      return mappedGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateGoal = async (goalId, goalData) => {
    try {
      // Convert frontend format to backend format
      const backendGoalData = {
        title: goalData.name,
        targetAmount: goalData.targetAmount,
        deadline: goalData.deadline.toISOString().split('T')[0], // Convert to DateOnly format
        savedAmount: goalData.currentAmount || 0
      };

      const response = await goalService.updateGoal(goalId, backendGoalData);
      const updatedGoal = response.data;

      // Map response back to frontend format
      const mappedGoal = {
        id: updatedGoal.goalId,
        name: updatedGoal.title,
        targetAmount: updatedGoal.targetAmount,
        currentAmount: updatedGoal.savedAmount || 0,
        deadline: new Date(updatedGoal.deadline + 'T00:00:00'),
        createdAt: new Date(updatedGoal.createdAt),
        progressPercentage: updatedGoal.progressPercentage,
        isCompleted: updatedGoal.isCompleted
      };

      setGoals(prev => prev.map(goal =>
        goal.id === goalId ? mappedGoal : goal
      ));
      return mappedGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await goalService.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addProgress = async (goalId, progressData) => {
    try {
      await goalService.addGoalProgress(goalId, progressData);
      // Refresh goals to get updated saved amount
      await fetchGoals();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    addProgress,
    refetch: fetchGoals,
  };
};

// Custom hook for transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getAllTransaction();
      const data = response.data;

      // Map API response to frontend format
      const mappedTransactions = data.map(transaction => ({
        id: transaction.transactionId,
        type: transaction.type,
        category: transaction.categoryName,
        timestamp: transaction.createdAt,
        amount: transaction.amount,
        note: transaction.note,
        isImportant: transaction.isImportant
      }));

      // Sort by newest first (backend should already be sorted, but ensure it)
      const sortedTransactions = mappedTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTransactions(sortedTransactions);
    } catch (err) {
      setError(err.message);
      console.error('Transactions API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const response = await transactionService.createTransaction(transactionData);
      const newTransaction = response.data;

      // Map API response to frontend format
      const mappedTransaction = {
        id: newTransaction.transactionId,
        type: newTransaction.type,
        category: newTransaction.categoryName,
        timestamp: newTransaction.createdAt,
        amount: newTransaction.amount,
        note: newTransaction.note,
        isImportant: newTransaction.isImportant
      };

      // Add new transaction to the beginning of the list (newest first)
      setTransactions(prev => [mappedTransaction, ...prev]);
      return mappedTransaction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    refetch: fetchTransactions,
  };
};

// Custom hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getAllCategory();
      const data = response.data;
      setCategories(data);
    } catch (err) {
      setError(err.message);
      console.error('Categories API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      const newCategory = response.data;
      setCategories(prev => [newCategory, ...prev]);
      return newCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    refetch: fetchCategories,
  };
};
