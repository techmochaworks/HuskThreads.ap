import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  status: string;
}

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);

        // Fetch active products
        const productsQuery = query(collection(db, 'products'), where('status', '==', 'Active'));
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (categories.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [categories.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + categories.length) % categories.length);
  };

  const usps = [
    { icon: Sparkles, title: 'Custom T-shirts', desc: 'Design Your Own' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Across India' },
    { icon: Shield, title: '100% Quality', desc: 'Guaranteed' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '& Exchanges' },
  ];

  const reviews = [
    { name: 'Rahul Sharma', rating: 5, text: 'Amazing quality! The custom print came out perfect. Will definitely order again.', product: 'Custom Hoodie' },
    { name: 'Priya Patel', rating: 5, text: 'Fast delivery and great customer service. Love my new t-shirt!', product: 'Graphic Tee' },
    { name: 'Arjun Kumar', rating: 5, text: 'Best quality apparel I have bought online. Highly recommended!', product: 'Premium Polo' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-foreground border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 overflow-x-hidden">
      {/* Hero Carousel */}
      <section className="relative  md:h-[60vh] bg-muted overflow-hidden">
        {categories.length > 0 && (
          <>
            <div
              className="flex h-full transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {categories.map((category) => (
                <div key={category.id} className="min-w-full  relative">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full object-fill object-center"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end md:items-center justify-center pb-12 md:pb-0">
                    <div className="text-center text-white px-4">
                      <h2 className="text-3xl md:text-6xl font-bold mb-4">{category.name}</h2>
                      <button className="bg-white text-black px-8 py-3 font-semibold hover:bg-white/90 transition-colors">
                        Shop Now
                      </button>
                    </div>
                  </div> */}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {/* <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button> */}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {categories.map((_, index) => (
                <button
                title='Go to slide'
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* USPs */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {usps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-secondary p-4 text-center">
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
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
      </section>

      {/* Customer Reviews */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed">{review.text}</p>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
