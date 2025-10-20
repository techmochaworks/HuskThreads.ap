import { Link } from 'react-router-dom';
import { ShoppingCart, Sparkles, Star, Zap } from 'lucide-react';

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

  const specialTags = [
    { keyword: 'limited edition', label: 'Limited Edition', icon: Sparkles, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { keyword: 'exclusive', label: 'Exclusive', icon: Star, color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    { keyword: 'new arrival', label: 'New', icon: Zap, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { keyword: 'bestseller', label: 'Bestseller', icon: Star, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  ];

  const nameLower = name.toLowerCase();
  const matchedTag = specialTags.find(tag => nameLower.includes(tag.keyword));
  
  // Remove the tag from display name if found
  let displayName = name;
  if (matchedTag) {
    const regex = new RegExp(matchedTag.keyword, 'gi');
    displayName = name.replace(regex, '').replace(/\s+/g, ' ').trim();
  }

  return (
    <Link to={`/product/${id}`} className="product-card group">
      <div className="aspect-[4/5] relative overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
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
        {/* Show special tag in title area too */}
        {matchedTag && (
          <div className="flex items-center gap-1 mb-1">
            <matchedTag.icon className="w-3 h-3 text-purple-500" />
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wide">
              {matchedTag.label}
            </span>
          </div>
        )}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{displayName}</h3>
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