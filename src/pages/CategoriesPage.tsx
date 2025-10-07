import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import { Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  categoryId: string;
  subcategoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesSnap, subcategoriesSnap, productsSnap] = await Promise.all([
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'subcategories')),
          getDocs(query(collection(db, 'products'), where('status', '==', 'Active')))
        ]);

        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
        setSubcategories(subcategoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subcategory)));
        setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close mobile filter overlay when clicking outside
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

  const filteredSubcategories = selectedCategory === 'ALL' 
    ? []
    : subcategories.filter(sub => sub.categoryId === selectedCategory);

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'ALL' || product.categoryId === selectedCategory;
    const subcategoryMatch = selectedSubcategories.length === 0 || 
      (product.subcategoryId && selectedSubcategories.includes(product.subcategoryId));
    return categoryMatch && subcategoryMatch;
  });

  const toggleSubcategory = (subId: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 sm:pb-24 md:pb-20 overflow-x-hidden">
      {/* Category Tabs - Horizontal Scroll */}
      <div className="sticky top-0 z-40 bg-background border-b-2 border-border shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSubcategories([]);
              }}
              className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 font-medium text-sm sm:text-base transition-all touch-manipulation active:scale-95 rounded-lg ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-secondary text-foreground hover:bg-foreground/10'
              }`}
            >
              ALL
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedSubcategories([]);
                }}
                className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 font-medium whitespace-nowrap text-sm sm:text-base transition-all touch-manipulation active:scale-95 rounded-lg ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background shadow-md'
                    : 'bg-secondary text-foreground hover:bg-foreground/10'
                }`}
              >
                {category.name}
              </button>
            ))}
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
        {/* Mobile Filter Button - Floating */}
        {filteredSubcategories.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden fixed bottom-20 sm:bottom-24 right-3 sm:right-4 bg-foreground text-background p-3 sm:p-4 rounded-full shadow-lg z-40 touch-manipulation active:scale-95 transition-transform"
            aria-label="Toggle filters"
          >
            <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
            {selectedSubcategories.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {selectedSubcategories.length}
              </span>
            )}
          </button>
        )}

        {/* Subcategory Sidebar/Drawer */}
        {filteredSubcategories.length > 0 && (
          <aside className={`
            fixed md:static
            inset-y-0 left-0 md:inset-y-auto
            w-[280px] sm:w-80 md:w-64
            bg-background border-2 md:border border-border
            z-50 md:z-auto
            transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            md:sticky md:top-[73px] md:h-fit
            overflow-y-auto md:overflow-visible
            shadow-2xl md:shadow-none
            rounded-r-lg md:rounded-lg
          `}>
            <div className="p-4 sm:p-5 md:p-4">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-4">
                <h3 className="font-bold text-base sm:text-lg">Filter by Type</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden p-1 hover:bg-secondary rounded-full transition-colors touch-manipulation"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2.5 sm:space-y-3 md:space-y-2">
                {filteredSubcategories.map(sub => (
                  <label 
                    key={sub.id} 
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-secondary/50 transition-colors touch-manipulation"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(sub.id)}
                      onChange={() => toggleSubcategory(sub.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 cursor-pointer"
                    />
                    <span className="text-sm sm:text-base group-hover:text-foreground transition-colors flex-1">
                      {sub.name}
                    </span>
                  </label>
                ))}
              </div>

              {selectedSubcategories.length > 0 && (
                <button
                  onClick={() => setSelectedSubcategories([])}
                  className="w-full mt-4 sm:mt-5 md:mt-4 py-2.5 sm:py-3 md:py-2 text-sm sm:text-base font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-all touch-manipulation active:scale-95 rounded-lg"
                >
                  Clear Filters ({selectedSubcategories.length})
                </button>
              )}
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <main className="flex-1 min-w-0">
          {/* Product Count & Active Filters */}
          <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
            
            {/* Active Filter Pills */}
            {selectedSubcategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedSubcategories.map(subId => {
                  const sub = subcategories.find(s => s.id === subId);
                  return sub ? (
                    <span 
                      key={subId}
                      className="inline-flex items-center gap-1.5 bg-foreground text-background px-2 py-1 text-xs rounded-full"
                    >
                      {sub.name}
                      <button
                        onClick={() => toggleSubcategory(subId)}
                        className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${sub.name} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 px-4">
              <div className="max-w-md mx-auto">
                <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                  No products found
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Try adjusting your filters or browse different categories
                </p>
                {selectedSubcategories.length > 0 && (
                  <button
                    onClick={() => setSelectedSubcategories([])}
                    className="mt-4 sm:mt-6 px-6 py-2.5 bg-foreground text-background font-medium text-sm sm:text-base rounded-lg hover:opacity-90 transition-opacity touch-manipulation"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {filteredProducts.map(product => (
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

export default CategoriesPage;