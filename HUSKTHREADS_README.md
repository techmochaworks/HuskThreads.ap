# HuskThreads E-commerce Website

A modern, mobile-first e-commerce platform for custom apparel built with React, TypeScript, Firebase, and Tailwind CSS.

## 🎯 Features

### Core Pages
- **Homepage** - Hero carousel, featured products, customer reviews, USPs
- **Categories** - Dynamic filtering by category and subcategory
- **Product Detail** - Image gallery, variant selection (color/size), add to cart
- **Customize** - Custom t-shirt design upload and order form
- **Cart** - Shopping cart with localStorage persistence
- **Checkout** - Complete order flow with Firebase integration

### Key Functionality
- ✅ Firebase Firestore integration for products, categories, and orders
- ✅ Cart management with Context API and localStorage
- ✅ Responsive mobile-first design with bottom navigation
- ✅ Sharp-edged, professional design system (0px border-radius)
- ✅ Dynamic product filtering and search
- ✅ Real-time stock management
- ✅ Order placement and tracking
- ✅ Custom order submission

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase Firestore
- **State Management**: React Context API
- **UI Components**: Custom components + Radix UI
- **Notifications**: Sonner for toast messages

### Design System
- **Colors**: Pure black (#000), white (#FFF), grays
- **Typography**: Inter font family
- **Borders**: Sharp edges (0px border-radius throughout)
- **Spacing**: Consistent 4px grid system
- **Transitions**: Smooth 300ms animations

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Top navigation with cart badge
│   ├── BottomNav.tsx        # Fixed bottom navigation (4 sections)
│   ├── Footer.tsx           # Footer with links and info
│   └── ProductCard.tsx      # Reusable product card component
├── contexts/
│   └── CartContext.tsx      # Cart state management
├── lib/
│   └── firebase.ts          # Firebase configuration
├── pages/
│   ├── HomePage.tsx         # Landing page with hero & products
│   ├── CategoriesPage.tsx   # Category browsing with filters
│   ├── ProductDetailPage.tsx # Single product view
│   ├── CustomizePage.tsx    # Custom t-shirt orders
│   ├── CartPage.tsx         # Shopping cart
│   ├── CheckoutPage.tsx     # Order placement
│   └── NotFound.tsx         # 404 page
└── App.tsx                  # Main app with routing
```

## 🔥 Firebase Setup

### Collections Structure

#### 1. Categories
```typescript
{
  name: string,
  imageUrl: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. Subcategories
```typescript
{
  name: string,
  imageUrl: string,
  categoryId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. Products
```typescript
{
  name: string,
  description: string,
  price: number,
  discountPrice?: number,
  images: string[],
  colors: string[],
  sizes: string[],
  stock: number,
  sku: string,
  status: "Active" | "Inactive",
  tags: string[],
  categoryId: string,
  subcategoryId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. Orders
```typescript
{
  customerName: string,
  customerPhone: string,
  shippingAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  products: Array<{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    size: string,
    color: string,
    image: string
  }>,
  totalAmount: number,
  status: "Pending" | "Processing" | "Shipped" | "Delivered",
  paymentStatus: "Pending" | "Paid" | "Failed",
  paymentMethod: "COD" | "UPI" | "Card" | "Net Banking",
  createdAt: timestamp
}
```

#### 5. Custom Orders
```typescript
{
  customerName: string,
  customerPhone: string,
  productType: string,
  color: string,
  sizes: string[],
  quantity: number,
  notes: string,
  designFileName: string,
  status: "Pending" | "Approved" | "In Production" | "Completed",
  createdAt: timestamp
}
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Firebase is already configured in `src/lib/firebase.ts`
   - Make sure your Firebase project has Firestore enabled
   - Create the collections: categories, subcategories, products, orders, customOrders

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📱 Navigation Flow

### Bottom Navigation (Always Visible)
1. **Home** → Homepage with hero carousel
2. **Categories** → Browse all products with filters
3. **Customize** → Upload custom designs
4. **Cart** → View cart and checkout

### User Journey
```
Homepage → Categories → Product Detail → Cart → Checkout → Order Confirmation
              ↓
         Customize → Custom Order Submission
```

## 🎨 Design Guidelines

### Color Palette
- Primary: `hsl(0 0% 0%)` - Pure Black
- Background: `hsl(0 0% 100%)` - Pure White
- Secondary: `hsl(0 0% 96%)` - Light Gray
- Muted: `hsl(0 0% 45%)` - Medium Gray

### Component Classes
- `btn-primary` - Black background, white text
- `btn-secondary` - White background, black border
- `input-sharp` - Sharp-edged input fields
- `product-card` - Hover effects for products
- `badge-discount` - Red discount badge
- `badge-stock-low` - Yellow low stock warning

## 🔧 Cart Management

Cart data is stored in:
- **Runtime**: React Context (CartContext)
- **Persistence**: localStorage (`huskthreads_cart`)

Cart operations:
- `addToCart(item)` - Add or update item quantity
- `removeFromCart(productId, size, color)` - Remove specific item
- `updateQuantity(productId, size, color, quantity)` - Update quantity
- `clearCart()` - Clear entire cart (after checkout)

## 📦 Deployment

The app is optimized for:
- **Vercel/Netlify**: Simple static hosting
- **Firebase Hosting**: Native integration
- **Custom domains**: SEO-optimized meta tags included

## 🔍 SEO Optimization

- Semantic HTML structure (`<header>`, `<main>`, `<section>`, `<article>`)
- Optimized meta tags for social sharing
- Alt text on all images
- Clean, descriptive URLs
- Mobile-first responsive design

## 📝 Notes

- All product images should be optimized (WebP format recommended)
- Firebase security rules should be configured for production
- Consider adding Firebase Storage for custom design uploads
- Implement payment gateway integration (Razorpay/Stripe) for production
- Add order tracking functionality
- Implement email notifications for orders

## 🤝 Support

For issues or questions:
- Email: support@huskthreads.com
- Phone: +91 98765 43210

---

**Built with ❤️ by HuskThreads Team**
