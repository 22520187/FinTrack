import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const BalanceCard = ({ balance, income, expense }) => {
  return (
    <Card className="w-full bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-card-dark">
      <CardHeader className="pb-2">
        <CardDescription className="text-primary-700 dark:text-primary-300">Total Balance</CardDescription>
        <CardTitle className="text-3xl font-bold text-primary-800 dark:text-primary-200">${balance.toFixed(2)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-primary-600">Income</p>
            <p className="text-lg font-medium income-text">+${income.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-primary-600">Expenses</p>
            <p className="text-lg font-medium expense-text">-${expense.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;