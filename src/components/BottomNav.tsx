import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, Palette, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const BottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/categories', icon: Grid3x3, label: 'Categories' },
    { path: '/customize', icon: Palette, label: 'Customize' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border bottom-nav-shadow z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ path, icon: Icon, label, badge }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  {badge && badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-foreground text-background w-4 h-4 flex items-center justify-center text-xs font-bold">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
