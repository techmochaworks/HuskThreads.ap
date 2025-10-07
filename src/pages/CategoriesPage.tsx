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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-foreground border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Category Tabs */}
      <div className="sticky top-16 z-40 bg-background border-b-2 border-border">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSubcategories([]);
              }}
              className={`px-6 py-2 font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-foreground text-background'
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
                className={`px-6 py-2 font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-foreground/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden fixed bottom-20 right-4 bg-foreground text-background p-4 shadow-lg z-40"
        >
          <Filter className="w-6 h-6" />
        </button>

        {/* Subcategory Sidebar/Drawer */}
        {filteredSubcategories.length > 0 && (
          <aside className={`
            ${showFilters ? 'fixed' : 'hidden'}
            md:sticky md:block
            top-32 left-0 bottom-0 md:top-32
            w-64 h-fit
            bg-background border-2 border-border p-4
            z-30
            ${showFilters ? 'shadow-2xl' : ''}
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filter by Type</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {filteredSubcategories.map(sub => (
                <label key={sub.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(sub.id)}
                    onChange={() => toggleSubcategory(sub.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm group-hover:text-foreground transition-colors">
                    {sub.name}
                  </span>
                </label>
              ))}
            </div>

            {selectedSubcategories.length > 0 && (
              <button
                onClick={() => setSelectedSubcategories([])}
                className="w-full mt-4 py-2 text-sm border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Clear Filters
              </button>
            )}
          </aside>
        )}

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
