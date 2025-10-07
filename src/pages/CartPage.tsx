import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const shippingFee = cartTotal >= 999 ? 0 : 99;
  const finalTotal = cartTotal + shippingFee;

  const handleRemove = (productId: string, size: string, color: string, name: string) => {
    removeFromCart(productId, size, color);
    toast.success(`Removed ${name} from cart`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link to="/categories" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-muted-foreground">({cartCount} {cartCount === 1 ? 'item' : 'items'})</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemPrice = item.discountPrice || item.price;
              const itemSubtotal = itemPrice * item.quantity;

              return (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="bg-card border-2 border-border p-4 flex gap-4">
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-32 object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link to={`/product/${item.productId}`} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    
                    <div className="flex gap-3 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Color:</span>
                        <div className="w-4 h-4 border border-border" style={{ backgroundColor: item.color.toLowerCase() }} />
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span> <span className="font-medium">{item.size}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-border hover:border-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-border hover:border-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.productId, item.size, item.color, item.name)}
                        className="ml-auto text-destructive hover:text-destructive/80 flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 text-lg font-bold">
                      ₹{itemSubtotal}
                      {item.discountPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ₹{item.price * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary border-2 border-border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                {cartTotal < 999 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{999 - cartTotal} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t-2 border-border pt-3 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/categories"
                className="block text-center py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
