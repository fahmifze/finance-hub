import { NewsArticle } from '../../types/news.types';
import NewsCard from './NewsCard';

interface NewsListProps {
  articles: NewsArticle[];
  isLoading?: boolean;
  showSaveButton?: boolean;
  maxItems?: number;
}

export default function NewsList({
  articles,
  isLoading,
  showSaveButton = true,
  maxItems,
}: NewsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex gap-4">
              <div className="shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">No news articles found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  const displayArticles = maxItems ? articles.slice(0, maxItems) : articles;

  return (
    <div className="space-y-4">
      {displayArticles.map((article) => (
        <NewsCard key={article.uuid} article={article} showSaveButton={showSaveButton} />
      ))}
    </div>
  );
}
