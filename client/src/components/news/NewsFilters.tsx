import { useState } from 'react';

interface NewsFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: { industries?: string; symbols?: string }) => void;
  isLoading?: boolean;
}

const INDUSTRIES = [
  { value: 'Financial', label: 'Financial' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Energy', label: 'Energy' },
  { value: 'Consumer', label: 'Consumer' },
  { value: 'Industrial', label: 'Industrial' },
];

export default function NewsFilters({ onSearch, onFilterChange, isLoading }: NewsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [symbolInput, setSymbolInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    onFilterChange({ industries: industry || undefined });
  };

  const handleSymbolSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbolInput.trim()) {
      onFilterChange({ symbols: symbolInput.toUpperCase() });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    setSymbolInput('');
    onSearch('');
    onFilterChange({});
  };

  return (
    <div className="card mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="input pr-10"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Industry filter */}
        <select
          value={selectedIndustry}
          onChange={(e) => handleIndustryChange(e.target.value)}
          className="input md:w-48"
          disabled={isLoading}
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry.value} value={industry.value}>
              {industry.label}
            </option>
          ))}
        </select>

        {/* Symbol search */}
        <form onSubmit={handleSymbolSearch} className="flex gap-2">
          <input
            type="text"
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
            placeholder="Stock symbol (e.g. AAPL)"
            className="input md:w-48"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
            disabled={isLoading || !symbolInput.trim()}
          >
            Find
          </button>
        </form>

        {/* Clear filters */}
        {(searchQuery || selectedIndustry || symbolInput) && (
          <button
            onClick={clearFilters}
            className="btn-secondary text-sm"
            disabled={isLoading}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
