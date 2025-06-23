import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DatePicker } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2 } from 'lucide-react';
import reportService from '../../services/report.service';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const COLORS = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#9C27B0', '#FF9800', '#607D8B', '#E91E63', '#3F51B5', '#00BCD4'];

// Predefined date range presets
const datePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().subtract(7, 'day'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().subtract(30, 'day'), dayjs()],
  },
  {
    label: 'Last 3 Months',
    value: [dayjs().subtract(3, 'month'), dayjs()],
  },
  {
    label: 'Last 6 Months',
    value: [dayjs().subtract(6, 'month'), dayjs()],
  },
  {
    label: 'Last 12 Months',
    value: [dayjs().subtract(12, 'month'), dayjs()],
  },
  {
    label: 'This Year',
    value: [dayjs().startOf('year'), dayjs()],
  },
];

const Reports = () => {
  // Initialize with last 12 months as default
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, 'month'),
    dayjs()
  ]);
  
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  useEffect(() => {
    const fetchReportData = async () => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        return;
      }

      setLoading(true);
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        const [summaryResponse, categoryResponse] = await Promise.all([
          reportService.getFinancialSummaryByDateRange(startDate, endDate),
          reportService.getCategoryExpensesByDateRange(startDate, endDate)
        ]);

        setFinancialSummary(summaryResponse.data);

        const categoriesWithColors = categoryResponse.data.map((category, index) => ({
          name: category.category,
          value: category.amount,
          color: COLORS[index % COLORS.length]
        }));
        setCategoryExpenses(categoriesWithColors);

      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load report data",
          description: error.response?.data?.message || "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange, toast]);

  const handleExport = async (format) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      toast({
        variant: "destructive",
        title: "Date range required",
        description: "Please select a date range before exporting.",
      });
      return;
    }

    setExportLoading(true);
    toast({
      title: "Generating report",
      description: `Your report is being generated as ${format.toUpperCase()}...`,
    });

    try {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');

      const generateResponse = await reportService.generateReportByDateRange(startDate, endDate, format);
      
      if (generateResponse.status === 200) {
        const { fileName } = generateResponse.data;
        
        const downloadResponse = await reportService.downloadReport(fileName);
        const blob = await downloadResponse.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Export complete",
          description: `Your ${format.toUpperCase()} report has been downloaded.`,
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error.response?.data?.message || "Failed to generate report. Please try again.",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const getChartData = () => {
    if (!financialSummary?.monthlyData) {
      return [];
    }

    return financialSummary.monthlyData.map(item => ({
      name: item.month,
      income: item.income,
      expense: item.expense
    }));
  };

  const { totalIncome = 0, totalExpense = 0, savingsRate = 0 } = financialSummary || {};

  const renderExportButton = (format, label) => (
    <Button
      variant="outline"
      onClick={() => handleExport(format)}
      disabled={loading || exportLoading}
    >
      {exportLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileText className="w-4 h-4 mr-2" />
      )}
      {label}
    </Button>
  );

  const renderSummaryCard = (title, value, className) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${className}`}>
          {typeof value === 'number' && title !== 'Savings Rate' 
            ? `$${value.toLocaleString()}` 
            : `${value.toFixed(1)}%`
          }
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Financial Reports</h1>
        <div className="flex gap-2">
          {renderExportButton('pdf', 'Export PDF')}
          {renderExportButton('excel', 'Export Excel')}
        </div>
      </div>

      <div className="mb-6 flex justify-start ">
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          presets={datePresets}
          className="w-full sm:w-[400px]"
          disabled={loading}
          placeholder={['Start Date', 'End Date']}
          style={{ height: '40px' }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading report data...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {renderSummaryCard("Total Income", totalIncome, "income-text")}
            {renderSummaryCard("Total Expenses", totalExpense, "expense-text")}
            {renderSummaryCard("Savings Rate", savingsRate, savingsRate >= 0 ? 'income-text' : 'expense-text')}
          </div>

          {/* Monthly Income/Expense Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4CAF50" />
                    <Bar dataKey="expense" name="Expense" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;