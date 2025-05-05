import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const RecentTransactionsList = ({ transactions, onViewAll }) => {
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length > 0 ? (
          <ul className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'expense' ? 'bg-finance-expense/10' : 'bg-finance-income/10'
                  }`}>
                    {transaction.type === 'expense' ? (
                      <ArrowDown className="h-4 w-4 text-finance-expense" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-finance-income" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${
                  transaction.type === 'expense' ? 'expense-text' : 'income-text'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No recent transactions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsList;