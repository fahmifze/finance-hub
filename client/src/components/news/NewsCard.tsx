import { useState } from 'react';
import { NewsArticle } from '../../types/news.types';
import { useSaveArticle, useRemoveSavedArticle } from '../../hooks/useNews';

interface NewsCardProps {
  article: NewsArticle;
  showSaveButton?: boolean;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export default function NewsCard({ article, showSaveButton = true }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const saveArticle = useSaveArticle();
  const removeSavedArticle = useRemoveSavedArticle();

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (article.isSaved) {
      removeSavedArticle.mutate(article.uuid);
    } else {
      saveArticle.mutate({
        uuid: article.uuid,
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.image_url || undefined,
        source: article.source,
        publishedAt: article.published_at,
        categories: article.categories,
        tickers: article.entities?.map((e) => e.symbol).filter(Boolean),
      });
    }
  };

  const stockTickers = article.entities?.filter((e) => e.symbol).slice(0, 3) || [];

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block card hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex gap-4">
        {/* Image */}
        {article.image_url && !imageError && (
          <div className="shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {article.title}
            </h3>

            {showSaveButton && (
              <button
                onClick={handleSaveToggle}
                disabled={saveArticle.isPending || removeSavedArticle.isPending}
                className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                  article.isSaved
                    ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={article.isSaved ? 'Remove from saved' : 'Save article'}
              >
                <svg
                  className="w-5 h-5"
                  fill={article.isSaved ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            )}
          </div>

          {article.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Source and time */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">{article.source}</span>
              <span>·</span>
              <span>{formatTimeAgo(article.published_at)}</span>
            </div>

            {/* Stock tickers */}
            {stockTickers.length > 0 && (
              <div className="flex items-center gap-1.5">
                {stockTickers.map((entity) => (
                  <span
                    key={entity.symbol}
                    className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  >
                    ${entity.symbol}
                  </span>
                ))}
              </div>
            )}

            {/* Categories */}
            {article.categories?.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
