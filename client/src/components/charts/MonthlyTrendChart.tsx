import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrendData } from '../../types/expense.types';
import { formatCurrency, convertCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
  currency?: string;
}

export default function MonthlyTrendChart({ data, currency = 'USD' }: MonthlyTrendChartProps) {
  const { isDark } = useTheme();

  // Convert data to display currency
  const chartData = data.map((item) => ({
    name: item.month,
    total: convertCurrency(Number(item.total), currency),
  }));

  const formatValue = (value: number) => formatCurrency(value, currency, true);

  if (chartData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        No data available
      </div>
    );
  }

  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#E5E7EB';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: textColor, fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: textColor, fontSize: 12 }}
          tickFormatter={(value) => formatValue(value)}
        />
        <Tooltip
          formatter={(value: number) => [formatValue(value), 'Total']}
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: textColor }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#6366F1"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
