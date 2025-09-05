
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  initialQuery: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-white/10 placeholder-white/60 text-white rounded-full py-3 pl-5 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all duration-300"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors">
            <i className="fas fa-search fa-lg"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;