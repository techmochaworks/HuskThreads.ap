import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  status: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  colors: string[];
  sizes: string[];
  sku: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface DataContextType {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsBySubcategory: (subcategoryId: string) => Product[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [categoriesSnap, subcategoriesSnap, productsSnap] = await Promise.all([
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'subcategories')),
        getDocs(query(collection(db, 'products'), where('status', '==', 'Active')))
      ]);

      const categoriesData = categoriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];

      const subcategoriesData = subcategoriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subcategory[];

      const productsData = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setProducts(productsData);

      console.log('✅ Data fetched successfully:', {
        categories: categoriesData.length,
        subcategories: subcategoriesData.length,
        products: productsData.length
      });
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data once on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Helper functions to filter data
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId);
  };

  const getProductsBySubcategory = (subcategoryId: string) => {
    return products.filter(p => p.subcategoryId === subcategoryId);
  };

  const value: DataContextType = {
    products,
    categories,
    subcategories,
    loading,
    error,
    refetchData: fetchData,
    getProductById,
    getProductsByCategory,
    getProductsBySubcategory
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};