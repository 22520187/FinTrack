import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const COLORS = [
  '#50bbf5', // primary-400
  '#5069f5', // secondary-400
  '#f58a50', // compleprimary-300
  '#f4ee69', // complesecond-400
  '#46aff2', // primary-500
  '#214cf0', // secondary-500
  '#f27225', // compleprimary-400
  '#f1e951', // complesecond-500
];

const ExpensesByCategoryChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-primary-800 dark:text-primary-300">Expenses by Category</CardTitle>
        <CardDescription className="text-primary-600 dark:text-primary-400">Your spending distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-primary-500 dark:text-primary-400">No expense data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategoryChart;