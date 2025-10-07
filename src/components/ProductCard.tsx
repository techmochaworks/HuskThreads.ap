import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  stock?: number;
}

const ProductCard = ({ id, name, price, discountPrice, image, stock = 0 }: ProductCardProps) => {
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const finalPrice = discountPrice || price;

  return (
    <Link to={`/product/${id}`} className="product-card group">
      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {hasDiscount && (
          <div className="badge-discount">
            {discountPercent}% OFF
          </div>
        )}

        {stock > 0 && stock < 10 && (
          <div className="absolute top-2 left-2 badge-stock-low">
            Only {stock} left!
          </div>
        )}

        <div className="product-card-overlay">
          <button className="bg-background text-foreground px-6 py-3 font-medium flex items-center gap-2 hover:bg-background/90 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">₹{finalPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">₹{price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
