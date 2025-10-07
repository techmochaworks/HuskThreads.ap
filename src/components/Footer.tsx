import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-16 pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">HUSKTHREADS</h3>
            <p className="text-background/80 text-sm leading-relaxed">
              Premium custom apparel designed for those who dare to stand out. Quality craftsmanship meets bold expression.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-background/70 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-background/70 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-background/70 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/categories" className="hover:text-background transition-colors">All Categories</Link></li>
              <li><Link to="/customize" className="hover:text-background transition-colors">Custom Orders</Link></li>
              <li><Link to="#" className="hover:text-background transition-colors">Shipping Info</Link></li>
              <li><Link to="#" className="hover:text-background transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="#" className="hover:text-background transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-background transition-colors">Return Policy</Link></li>
              <li><Link to="#" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-background transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>support@huskthreads.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          © 2025 HuskThreads. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
