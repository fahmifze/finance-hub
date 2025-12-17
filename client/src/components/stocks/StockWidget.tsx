import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useMarketOverview } from '../../hooks/useStocks';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StockWidget() {
  const { isDark } = useTheme();
  const { data, isLoading, error } = useMarketOverview();

  if (isLoading) {
    return (
      <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="animate-pulse">
          <div className={`h-5 w-24 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-12 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Market
          </h3>
        </div>
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Unable to load market data</p>
        </div>
      </div>
    );
  }

  const topStocks = data.quotes.slice(0, 5);
  const marketStatus = data.marketStatus;

  return (
    <div className={`rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Market
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              marketStatus?.isOpen
                ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                marketStatus?.isOpen ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            {marketStatus?.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {topStocks.map((quote) => {
            const isPositive = quote.change >= 0;
            return (
              <div
                key={quote.symbol}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {quote.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {quote.symbol}
                    </span>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      ${(quote.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
                  isPositive
                    ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(quote.changePercent ?? 0).toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>

        <Link
          to="/stocks"
          className={`block mt-4 text-center text-sm font-medium py-2 rounded-lg transition-colors ${
            isDark
              ? 'text-primary-400 hover:bg-gray-700/50'
              : 'text-primary-600 hover:bg-gray-50'
          }`}
        >
          View All Stocks →
        </Link>
      </div>
    </div>
  );
}
