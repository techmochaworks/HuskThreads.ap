import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/datacontext'; // Import the context
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Use the global data context - NO MORE API CALLS!
  const { getProductById, getProductsBySubcategory, loading } = useData();
  
  const [product, setProduct] = useState(getProductById(id || ''));
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const foundProduct = getProductById(id);
    setProduct(foundProduct);

    if (foundProduct) {
      setSelectedColor(foundProduct.colors[0] || '');
      setSelectedSize(foundProduct.sizes[0] || '');

      // Get related products from the same subcategory
      if (foundProduct.subcategoryId) {
        const related = getProductsBySubcategory(foundProduct.subcategoryId)
          .filter(p => p.id !== id)
          .slice(0, 5);
        setRelatedProducts(related);
      }
    }
  }, [id, getProductById, getProductsBySubcategory]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    });

    toast.success('✓ Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl mb-4">Product not found</p>
          <button onClick={() => navigate('/categories')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  return (
    <div className="min-h-screen pb-24 md:pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 hover:opacity-70 active:opacity-50 transition-opacity touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 pb-6 sm:pb-8">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="pt-2 sm:pt-4">
            <div className="relative bg-muted mb-3 sm:mb-4 aspect-square rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain object-center"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                title='d'
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-md overflow-hidden touch-manipulation transition-all ${
                    selectedImage === index ? 'border-foreground scale-95' : 'border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <div className="mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">SKU: {product.sku}</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-bold">₹{finalPrice}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg sm:text-xl text-muted-foreground line-through">₹{product.price}</span>
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs sm:text-sm font-bold rounded">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-muted-foreground">{product.description}</p>

            {product.stock > 0 ? (
              product.stock < 10 && (
                <div className="badge-stock-low mb-4 inline-block text-xs sm:text-sm px-3 py-1.5">
                  Hurry! Only {product.stock} left
                </div>
              )
            ) : (
              <div className="bg-muted text-muted-foreground px-3 py-2 text-xs sm:text-sm font-bold mb-4 inline-block rounded">
                Out of Stock
              </div>
            )}

            <div className="mb-5 sm:mb-6">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Select Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-md touch-manipulation transition-all active:scale-95 ${
                      selectedColor === color ? 'border-foreground ring-2 ring-foreground ring-offset-2' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Select Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 font-medium border-2 rounded-md touch-manipulation transition-all active:scale-95 text-sm sm:text-base ${
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-foreground border-border hover:border-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Quantity</h3>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-border hover:border-foreground rounded-md touch-manipulation active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl sm:text-2xl font-semibold min-w-12 sm:min-w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-border hover:border-foreground rounded-md touch-manipulation active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3"
              >
                Buy Now
              </button>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-5 sm:mt-6">
                <div className="flex gap-2 flex-wrap">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-secondary px-3 py-1.5 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-10 sm:mt-12 md:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-1">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map(product => (
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
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 sm:p-4 z-20 shadow-lg">
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 sm:py-3.5 text-sm sm:text-base touch-manipulation active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold">Add to Cart</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed py-3 sm:py-3.5 text-sm sm:text-base font-semibold touch-manipulation active:scale-95 transition-transform"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;