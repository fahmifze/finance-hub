import { Link } from 'react-router-dom';
import { useTopNews } from '../../hooks/useNews';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 60) {
    return `${diffMins}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export default function NewsWidget() {
  const { data, isLoading } = useTopNews();

  const articles = data?.articles?.slice(0, 5) || [];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market News</h3>
        <Link to="/news" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>No news available</p>
          <p className="text-sm mt-1">Check back later for market updates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <a
              key={article.uuid}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTimeAgo(article.published_at)}
                </span>
                {article.entities?.slice(0, 2).map((entity) => (
                  <span
                    key={entity.symbol}
                    className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  >
                    ${entity.symbol}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
