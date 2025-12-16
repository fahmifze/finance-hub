import { useState } from 'react';
import {
  useNews,
  useNewsSearch,
  useSavedArticles,
  useNewsRateLimitStatus,
} from '../hooks/useNews';
import { NewsList, NewsFilters } from '../components/news';
import { NewsFilters as NewsFiltersType } from '../types/news.types';

type Tab = 'feed' | 'saved';

export default function News() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [filters, setFilters] = useState<NewsFiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);

  // Queries
  const { data: newsData, isLoading: newsLoading } = useNews({
    ...filters,
    page,
    limit: 20,
  });

  const { data: searchData, isLoading: searchLoading } = useNewsSearch(searchQuery, page);

  const { data: savedData, isLoading: savedLoading } = useSavedArticles(savedPage, 20);

  const { data: rateLimitStatus } = useNewsRateLimitStatus();

  // Determine which data to show
  const showSearchResults = searchQuery.length > 0;
  const currentData = showSearchResults ? searchData : newsData;
  const currentLoading = showSearchResults ? searchLoading : newsLoading;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (newFilters: { industries?: string; symbols?: string }) => {
    setFilters((prev) => ({
      ...prev,
      industries: newFilters.industries,
      symbols: newFilters.symbols,
    }));
    setSearchQuery(''); // Clear search when using filters
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (activeTab === 'feed') {
      setPage(newPage);
    } else {
      setSavedPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial News</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with the latest market news and insights
          </p>
        </div>

        {/* Rate limit indicator */}
        {rateLimitStatus && (
          <div className="hidden md:block text-right text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              API calls: {rateLimitStatus.used}/{rateLimitStatus.used + rateLimitStatus.remaining}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Resets {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'feed'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          News Feed
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Saved
          {savedData && savedData.pagination.total > 0 && (
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'saved'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              {savedData.pagination.total}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'feed' ? (
        <>
          {/* Filters */}
          <NewsFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            isLoading={currentLoading}
          />

          {/* Search indicator */}
          {showSearchResults && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Search results for "{searchQuery}"
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* News List */}
          <NewsList
            articles={currentData?.articles || []}
            isLoading={currentLoading}
            showSaveButton
          />

          {/* Pagination */}
          {currentData?.meta && currentData.meta.found > currentData.meta.limit && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
                Page {page}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={currentData.articles.length < currentData.meta.limit}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Empty state for API not configured */}
          {!currentLoading && currentData?.articles.length === 0 && !searchQuery && (
            <div className="card p-12 text-center">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                News API Not Configured
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                To view financial news, please configure your Marketaux API key in the .env file.
                Visit{' '}
                <a
                  href="https://www.marketaux.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  marketaux.com
                </a>{' '}
                to get a free API key.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Saved Articles */}
          <NewsList
            articles={
              savedData?.data.map((saved) => ({
                uuid: saved.articleUuid,
                title: saved.title,
                description: saved.description || '',
                snippet: '',
                url: saved.url,
                image_url: saved.imageUrl,
                language: 'en',
                published_at: saved.publishedAt,
                source: saved.source || '',
                categories: saved.categories || [],
                relevance_score: null,
                entities: (saved.tickers || []).map((ticker) => ({
                  symbol: ticker,
                  name: '',
                  type: 'stock',
                  industry: null,
                  match_score: 0,
                  sentiment_score: null,
                  highlights: [],
                })),
                isSaved: true,
              })) || []
            }
            isLoading={savedLoading}
            showSaveButton
          />

          {/* Saved Pagination */}
          {savedData && savedData.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(savedPage - 1)}
                disabled={savedPage === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
                Page {savedPage} of {savedData.pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(savedPage + 1)}
                disabled={savedPage >= savedData.pagination.totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Empty state for saved */}
          {!savedLoading && savedData?.data.length === 0 && (
            <div className="card p-12 text-center">
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Saved Articles
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Save articles from the news feed to read them later.
              </p>
              <button
                onClick={() => setActiveTab('feed')}
                className="btn-primary mt-4"
              >
                Browse News Feed
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
