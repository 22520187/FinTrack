import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const BalanceCard = ({ balance, income, expense }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardDescription>Total Balance</CardDescription>
        <CardTitle className="text-3xl font-bold">${balance.toFixed(2)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="text-lg font-medium income-text">+${income.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-lg font-medium expense-text">-${expense.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;