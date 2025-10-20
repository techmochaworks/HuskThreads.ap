import { useState, useEffect } from 'react';
import { useData } from '@/contexts/datacontext'; // Import the context
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Sparkles } from 'lucide-react';

const HomePage = () => {
  // Use the global data context instead of fetching
  const { products, categories, loading, error } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className="pb-16 overflow-x-hidden">
      <section className="relative h-[180px] md:h-[40vh] bg-muted overflow-hidden">
        {categories.length > 0 && (
          <>
            <div
              className="flex h-full transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {categories.map((category) => (
                <div key={category.id} className="min-w-full relative">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full object-fill object-center"
                  />
                </div>
              ))}
            </div>

            <button
              aria-label="Previous Slide"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              aria-label="Next Slide"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </section>

      <section className="container mx-auto px-2 py-2 md:py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {usps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-secondary p-2 md:p-4 text-center">
              <Icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2" />
              <h3 className="font-semibold text-xs md:text-sm">{title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-2 py-1">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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

      <section className="bg-secondary py-8 mt-8">
        <div className="container mx-auto px-2">
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