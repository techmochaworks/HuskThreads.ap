import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '@/contexts/datacontext'; // Import the context
import ProductCard from '@/components/ProductCard';
import { Search, X, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  categoryId: string;
  subcategoryId?: string;
  description?: string;
  tags?: string[];
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Use the global data context - NO MORE API CALLS!
  const { products, categories, subcategories, loading, error } = useData();
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'under500' | '500-1000' | 'above1000'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'name'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Close mobile filter overlay
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
    setSelectedCategories([]);
    setPriceRange('all');
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      const matchesDescription = product.description?.toLowerCase().includes(searchLower);
      const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesName && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
      return false;
    }

    // Price filter
    const finalPrice = product.discountPrice || product.price;
    if (priceRange === 'under500' && finalPrice >= 500) return false;
    if (priceRange === '500-1000' && (finalPrice < 500 || finalPrice > 1000)) return false;
    if (priceRange === 'above1000' && finalPrice <= 1000) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // relevance (default order)
    }
  });

  const hasActiveFilters = selectedCategories.length > 0 || priceRange !== 'all';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 sm:pb-24 md:pb-20 overflow-x-hidden">
      {/* Search Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 sm:py-3 pr-10 border-2 border-border rounded-lg focus:outline-none focus:border-foreground transition-colors text-sm sm:text-base"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Sort Dropdown - Mobile & Desktop */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <select
            title='s'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none focus:border-foreground"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-2 bg-secondary text-foreground border-2 border-border rounded-lg flex items-center gap-2 font-medium text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-foreground text-background w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {selectedCategories.length + (priceRange !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setShowFilters(false)}
        />
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-4 sm:gap-6 relative">
        {/* Sidebar Filters */}
        <aside className={`
          fixed md:static
          inset-y-0 left-0 md:inset-y-auto
          w-[280px] sm:w-80 md:w-64
          bg-background border-2 md:border border-border
          z-50 md:z-auto
          transition-transform duration-300 ease-in-out
          ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:sticky md:top-[140px] md:h-fit
          overflow-y-auto md:overflow-visible
          shadow-2xl md:shadow-none
          rounded-r-lg md:rounded-lg
        `}>
          <div className="p-4 sm:p-5 md:p-4">
            <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-4">
              <h3 className="font-bold text-base sm:text-lg">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden p-1 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label 
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 rounded border-2 cursor-pointer"
                    />
                    <span className="text-sm group-hover:text-foreground transition-colors flex-1">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm">Price Range</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'all'}
                    onChange={() => setPriceRange('all')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-foreground transition-colors">All Prices</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'under500'}
                    onChange={() => setPriceRange('under500')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-foreground transition-colors">Under ₹500</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === '500-1000'}
                    onChange={() => setPriceRange('500-1000')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-foreground transition-colors">₹500 - ₹1000</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'above1000'}
                    onChange={() => setPriceRange('above1000')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-foreground transition-colors">Above ₹1000</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange('all');
                }}
                className="w-full py-2.5 text-sm font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-all rounded-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="mb-4">
            {searchQuery && (
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Search results for "{searchQuery}"
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
              </span>

              {/* Active Filter Pills */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    return cat ? (
                      <span 
                        key={catId}
                        className="inline-flex items-center gap-1.5 bg-foreground text-background px-2 py-1 text-xs rounded-full"
                      >
                        {cat.name}
                        <button
                          onClick={() => toggleCategory(catId)}
                          className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${cat.name} filter`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-foreground text-background px-2 py-1 text-xs rounded-full">
                  {priceRange === 'under500' && 'Under ₹500'}
                  {priceRange === '500-1000' && '₹500 - ₹1000'}
                  {priceRange === 'above1000' && 'Above ₹1000'}
                  <button
                    onClick={() => setPriceRange('all')}
                    className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 px-4">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                  {searchQuery ? 'No results found' : 'Start searching'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {searchQuery 
                    ? 'Try different keywords or adjust your filters'
                    : 'Enter a search term to find products'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange('all');
                    }}
                    className="mt-4 sm:mt-6 px-6 py-2.5 bg-foreground text-background font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  image={product.images[0]}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;