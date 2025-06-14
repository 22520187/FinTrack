import { useState, useEffect } from 'react';
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
import { FileText, Loader2 } from 'lucide-react';
import reportService from '../../services/report.service';

// Colors for category chart
const COLORS = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#9C27B0', '#FF9800', '#607D8B', '#E91E63', '#3F51B5', '#00BCD4'];

const Reports = () => {
  const [timeRange, setTimeRange] = useState('year');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  // We'll use reportHistory in a future implementation
  const [reportHistory, setReportHistory] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get financial summary
        const summaryResponse = await reportService.getFinancialSummary(timeRange);
        if (summaryResponse.status === 200) {
          setFinancialSummary(summaryResponse.data);
        }

        // Get category expenses
        const categoryResponse = await reportService.getCategoryExpenses(timeRange);
        if (categoryResponse.status === 200) {
          // Add colors to the category data
          const categoriesWithColors = categoryResponse.data.map((category, index) => ({
            name: category.category,
            value: category.amount,
            color: COLORS[index % COLORS.length]
          }));
          setCategoryExpenses(categoriesWithColors);
        }

        // Get report history
        const historyResponse = await reportService.getReportHistory();
        if (historyResponse.status === 200) {
          setReportHistory(historyResponse.data);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load report data",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, toast]);

  const handleExport = async (format) => {
    setExportLoading(true);
    toast({
      title: "Exporting report",
      description: `Your report is being exported as ${format.toUpperCase()}...`,
    });

    try {
      const response = await reportService.generateReport(timeRange, format);
      if (response.status === 200) {
        toast({
          title: "Export complete",
          description: `Your ${format.toUpperCase()} report has been generated.`,
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to generate report. Please try again.",
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Prepare chart data from API response
  const getChartData = () => {
    if (!financialSummary || !financialSummary.monthlyData) {
      return [];
    }

    return financialSummary.monthlyData.map(item => ({
      name: item.month,
      income: item.income,
      expense: item.expense
    }));
  };

  // We call getChartData() directly in the components

  // Get summary data from API response
  const totalIncome = financialSummary ? financialSummary.totalIncome : 0;
  const totalExpense = financialSummary ? financialSummary.totalExpense : 0;
  const savingsRate = financialSummary ? financialSummary.savingsRate : 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Financial Reports</h1>
        <div className="flex gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={loading}
          >
            {exportLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Export PDF
          </Button>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={loading}
          >
            {exportLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Export Excel
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading report data...</span>
        </div>
      ) : (
        <>
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
        </>
      )}

      {!loading && (
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
                    <BarChart data={getChartData()}>
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
                    <LineChart data={getChartData()}>
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
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => {
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
            {categoryExpenses.length > 0 ? (
              <>
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
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No category data available for the selected period.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Reports;