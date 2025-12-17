import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyTotal } from '../../types/expense.types';
import { formatCurrency, convertCurrency, getCurrencySymbol } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

interface DailyBarChartProps {
  data: DailyTotal[];
  currency?: string;
}

export default function DailyBarChart({ data, currency = 'USD' }: DailyBarChartProps) {
  const { isDark } = useTheme();
  const formatValue = (value: number) => formatCurrency(value, currency, true);

  const chartData = data.map((item) => ({
    name: item.day.toString(),
    total: convertCurrency(Number(item.total), currency),
  }));

  if (chartData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-48 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        No daily data available
      </div>
    );
  }

  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#E5E7EB';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: textColor, fontSize: 10 }}
          interval={4}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: textColor, fontSize: 10 }}
          tickFormatter={(value) => `${getCurrencySymbol(currency)}${value}`}
          width={40}
        />
        <Tooltip
          formatter={(value: number) => [formatValue(value), 'Spent']}
          labelFormatter={(label) => `Day ${label}`}
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: textColor }}
        />
        <Bar dataKey="total" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
