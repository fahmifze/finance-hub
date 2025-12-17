import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useExpenseStats } from '../hooks/useExpenses';
import { useBudgetAlerts } from '../hooks/useBudgets';
import { useIncomeStats } from '../hooks/useIncomes';
import { useInsights } from '../hooks/useInsights';
import { useUpcomingRecurring } from '../hooks/useRecurring';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { Link } from 'react-router-dom';
import { MonthlyTrendChart, CategoryPieChart, DailyBarChart } from '../components/charts';
import { LoadingSection } from '../components/ui';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import InsightsList from '../components/insights/InsightsList';
import BudgetProgressBar from '../components/budget/BudgetProgressBar';
import StockWidget from '../components/stocks/StockWidget';
import {
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
  RefreshCw,
  Receipt,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { data: stats, isLoading: statsLoading } = useExpenseStats();
  const { data: budgetAlerts } = useBudgetAlerts();
  const { data: incomeStats } = useIncomeStats();
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: upcomingRecurring } = useUpcomingRecurring(7);
  const { data: exchangeRates } = useExchangeRates();

  const currency = user?.currency || 'MYR';

  const monthlyExpenses = Number(stats?.monthlyTotal || 0);
  const lastMonthExpenses = Number(stats?.lastMonthTotal || 0);
  const monthChange = lastMonthExpenses > 0
    ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
    : 0;

  const monthlyIncome = Number(incomeStats?.monthlyTotal || 0);
  const netSavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (netSavings / monthlyIncome) * 100 : 0;

  // Quick rates to show (limited to 4 most useful)
  const quickRates = ['EUR', 'GBP', 'SGD', 'JPY'].filter(c => c !== currency);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.firstName}
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Here's what's happening with your finances today
          </p>
        </div>
        <div className={`hidden sm:flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Primary KPI Cards - Expenses & Income */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expenses Card - Primary */}
        <div className={`relative overflow-hidden rounded-2xl p-6 ${isDark ? 'bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-800/30' : 'bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                Total Expenses
              </p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {statsLoading ? '...' : formatCurrency(monthlyExpenses, currency)}
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This month
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-500/10'}`}>
              <TrendingDown className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
            </div>
          </div>
          {!statsLoading && lastMonthExpenses > 0 && (
            <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
              monthChange >= 0
                ? isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                : isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
            }`}>
              {monthChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(monthChange).toFixed(0)}% vs last month
            </div>
          )}
        </div>

        {/* Income Card - Primary */}
        <div className={`relative overflow-hidden rounded-2xl p-6 ${isDark ? 'bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-800/30' : 'bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                Total Income
              </p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(monthlyIncome, currency)}
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This month
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
              <Wallet className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
            </div>
          </div>
          <Link
            to="/income"
            className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
          >
            View details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Secondary KPI Cards - Savings & Quick Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Savings */}
        <div className={`rounded-xl p-5 border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${netSavings >= 0 ? isDark ? 'bg-blue-500/20' : 'bg-blue-50' : isDark ? 'bg-orange-500/20' : 'bg-orange-50'}`}>
              <PiggyBank className={`w-5 h-5 ${netSavings >= 0 ? isDark ? 'text-blue-400' : 'text-blue-500' : isDark ? 'text-orange-400' : 'text-orange-500'}`} />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Net Savings</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(netSavings, currency)}
              </p>
            </div>
          </div>
          <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {savingsRate >= 0 ? (savingsRate ?? 0).toFixed(0) : 0}% savings rate
          </p>
        </div>

        {/* Quick Exchange Rates */}
        {exchangeRates && quickRates.slice(0, 3).map((code) => {
          const rate = exchangeRates.rates[code];
          const userRate = currency !== 'USD' && exchangeRates.rates[currency]
            ? rate / exchangeRates.rates[currency]
            : rate;
          return (
            <div key={code} className={`rounded-xl p-5 border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currency}/{code}
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userRate ? (1 / userRate).toFixed(4) : '--'}
                  </p>
                </div>
                <span className="text-2xl">{code === 'EUR' ? '🇪🇺' : code === 'GBP' ? '🇬🇧' : code === 'SGD' ? '🇸🇬' : code === 'JPY' ? '🇯🇵' : '💱'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget, Insights & Market Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Status */}
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Budget Status</h3>
            <Link to="/budget" className={`text-sm font-medium ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}>
              Manage
            </Link>
          </div>
          {budgetAlerts && budgetAlerts.length > 0 ? (
            <div className="space-y-4">
              {budgetAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {alert.categoryName || 'Overall Budget'}
                    </span>
                    {alert.isOverBudget && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        Exceeded
                      </span>
                    )}
                    {alert.isWarning && !alert.isOverBudget && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                        Warning
                      </span>
                    )}
                  </div>
                  <BudgetProgressBar
                    spent={alert.spent}
                    budget={alert.amount}
                    percentage={alert.percentage}
                    isWarning={alert.isWarning}
                    isOverBudget={alert.isOverBudget}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <PiggyBank className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No budget alerts</p>
              <Link to="/budget" className={`text-sm font-medium mt-2 inline-block ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                Set up your first budget
              </Link>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Insights</h3>
          </div>
          <InsightsList
            insights={insights || []}
            isLoading={insightsLoading}
            maxItems={3}
          />
        </div>

        {/* Stock Market Widget */}
        <StockWidget />
      </div>

      {/* Upcoming Recurring */}
      {upcomingRecurring && upcomingRecurring.length > 0 && (
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming (Next 7 Days)</h3>
            </div>
            <Link to="/recurring" className={`text-sm font-medium ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}>
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingRecurring.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  item.type === 'expense'
                    ? isDark ? 'bg-red-900/10 border-red-800/30' : 'bg-red-50 border-red-100'
                    : isDark ? 'bg-green-900/10 border-green-800/30' : 'bg-green-50 border-green-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: item.categoryColor }}
                  >
                    {item.categoryIcon?.charAt(0).toUpperCase() || (item.type === 'expense' ? '−' : '+')}
                  </div>
                  <span className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.categoryName}
                  </span>
                </div>
                <p className={`text-xl font-bold ${
                  item.type === 'expense'
                    ? isDark ? 'text-red-400' : 'text-red-600'
                    : isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {item.type === 'expense' ? '−' : '+'}{formatCurrency(item.amount, currency)}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.daysUntil === 0 ? 'Today' : item.daysUntil === 1 ? 'Tomorrow' : `In ${item.daysUntil} days`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Spending Trend</h3>
          {statsLoading ? (
            <LoadingSection />
          ) : (
            <MonthlyTrendChart data={stats?.monthlyTrend || []} currency={currency} />
          )}
        </div>

        <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Spending by Category</h3>
          {statsLoading ? (
            <LoadingSection />
          ) : (
            <CategoryPieChart data={stats?.categoryBreakdown || []} currency={currency} />
          )}
        </div>
      </div>

      {/* Daily Chart */}
      <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Daily Spending — {' '}
          <span className={`font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {stats?.currentMonth
              ? new Date(stats.currentMonth.year, stats.currentMonth.month - 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              : 'This Month'}
          </span>
        </h3>
        {statsLoading ? (
          <LoadingSection />
        ) : (
          <DailyBarChart data={stats?.dailyTotals || []} currency={currency} />
        )}
      </div>

      {/* Recent Expenses */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-6 pb-4 flex justify-between items-center">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Expenses</h3>
          <Link to="/expenses" className={`text-sm font-medium ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}>
            View all
          </Link>
        </div>
        {statsLoading ? (
          <div className="px-6 pb-6">
            <LoadingSection />
          </div>
        ) : stats?.recentExpenses && stats.recentExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-y ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <th className={`text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
                  <th className={`text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Category</th>
                  <th className={`text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Description</th>
                  <th className={`text-right py-3 px-6 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.recentExpenses.map((expense) => (
                  <tr key={expense.id} className={`${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className={`py-3 px-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDateShort(expense.expenseDate)}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: expense.categoryColor }}
                        >
                          {expense.categoryIcon?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{expense.categoryName}</span>
                      </div>
                    </td>
                    <td className={`py-3 px-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{expense.description || '—'}</td>
                    <td className={`py-3 px-6 text-right text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(Number(expense.amount), currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No expenses yet</p>
            <Link to="/expenses" className={`text-sm font-medium mt-2 inline-block ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              Add your first expense
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
