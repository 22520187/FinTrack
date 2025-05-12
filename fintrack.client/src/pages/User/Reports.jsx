import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

// Mock data
const monthlyData = [
  { name: 'Jan', income: 5000, expense: 3200 },
  { name: 'Feb', income: 4800, expense: 3400 },
  { name: 'Mar', income: 5200, expense: 3300 },
  { name: 'Apr', income: 5400, expense: 3800 },
  { name: 'May', income: 5100, expense: 3600 },
  { name: 'Jun', income: 5300, expense: 3700 },
  { name: 'Jul', income: 5600, expense: 3500 },
  { name: 'Aug', income: 5200, expense: 3200 },
  { name: 'Sep', income: 5400, expense: 3400 },
  { name: 'Oct', income: 5800, expense: 3900 },
  { name: 'Nov', income: 5500, expense: 3700 },
  { name: 'Dec', income: 6000, expense: 4500 },
];

const categoryExpenses = [
  { name: 'Food', value: 1200, color: '#F44336' },
  { name: 'Transport', value: 800, color: '#2196F3' },
  { name: 'Housing', value: 2000, color: '#FFEB3B' },
  { name: 'Entertainment', value: 600, color: '#4CAF50' },
  { name: 'Shopping', value: 900, color: '#9C27B0' },
  { name: 'Utilities', value: 500, color: '#FF9800' },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState('year');
  const { toast } = useToast();
  
  const handleExport = (format) => {
    // This would be implemented with actual export functionality
    toast({
      title: "Exporting report",
      description: `Your report is being exported as ${format.toUpperCase()}...`,
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your ${format.toUpperCase()} report has been downloaded.`,
      });
    }, 2000);
  };
  
  // Filter data based on time range selection
  const getFilteredData = () => {
    switch (timeRange) {
      case 'month':
        return monthlyData.slice(-1);
      case 'quarter':
        return monthlyData.slice(-3);
      case 'halfYear':
        return monthlyData.slice(-6);
      case 'year':
      default:
        return monthlyData;
    }
  };
  
  const filteredData = getFilteredData();
  
  // Calculate summary data
  const totalIncome = filteredData.reduce((sum, month) => sum + month.income, 0);
  const totalExpense = filteredData.reduce((sum, month) => sum + month.expense, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Financial Reports</h1>
        <div className="flex gap-2">
          <Button className="cursor-pointer" variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="cursor-pointer" variant="outline" onClick={() => handleExport('excel')}>
            <FileText className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="cursor-pointer">
            <SelectItem className="cursor-pointer" value="month">Last Month</SelectItem>
            <SelectItem className="cursor-pointer" value="quarter">Last Quarter</SelectItem>
            <SelectItem className="cursor-pointer" value="halfYear">Last 6 Months</SelectItem>
            <SelectItem className="cursor-pointer" value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold income-text">${totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold expense-text">${totalExpense.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${savingsRate >= 0 ? 'income-text' : 'expense-text'}`}>
              {savingsRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger className="cursor-pointer" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="income-expense">Income vs. Expenses</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4CAF50" />
                    <Bar dataKey="expense" name="Expense" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income-expense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (name === 'savings') {
                          return [`$${value.toLocaleString()}`, 'Monthly Savings'];
                        }
                        return [`$${value.toLocaleString()}`, name];
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey={(data) => data.income - data.expense} 
                      name="savings"
                      fill="#9b87f5"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[...categoryExpenses].sort((a, b) => b.value - a.value)} 
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="value" name="Amount">
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;