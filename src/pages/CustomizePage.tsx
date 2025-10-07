import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Upload, Sparkles } from 'lucide-react';

const CustomizePage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    productType: 'T-shirt',
    color: 'Black',
    sizes: [] as string[],
    quantity: 1,
    notes: '',
  });
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const productTypes = ['T-shirt', 'Hoodie', 'Sweatshirt', 'Polo', 'Tank Top'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Please fill in your name and phone number');
      return;
    }

    if (!designFile) {
      toast.error('Please upload your design');
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    setSubmitting(true);

    try {
      // In a real app, you'd upload the file to Cloud Storage first
      // For now, we'll just store the order details
      await addDoc(collection(db, 'customOrders'), {
        ...formData,
        designFileName: designFile.name,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      toast.success('✓ Custom order submitted successfully!', {
        description: 'Our team will contact you within 24 hours'
      });

      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        productType: 'T-shirt',
        color: 'Black',
        sizes: [],
        quantity: 1,
        notes: '',
      });
      setDesignFile(null);
      setPreview('');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Design Your Custom T-shirt</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Express yourself with personalized apparel. Upload your design and we'll bring it to life on premium quality clothing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-card border-2 border-border p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div>
                <h2 className="font-bold text-lg mb-4">Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      className="input-sharp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="input-sharp"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Design Upload */}
              <div>
                <h2 className="font-bold text-lg mb-4">Upload Your Design</h2>
                <label className="block">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-foreground transition-colors">
                    {preview ? (
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto mb-4" />
                    ) : (
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    )}
                    <p className="font-medium">
                      {designFile ? designFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG or SVG (MAX. 10MB)
                    </p>
                  </div>
                </label>
              </div>

              {/* Product Details */}
              <div>
                <h2 className="font-bold text-lg mb-4">Product Specifications</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Type</label>
                    <select
                      value={formData.productType}
                      onChange={e => setFormData({ ...formData, productType: e.target.value })}
                      className="input-sharp"
                    >
                      {productTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Base Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`px-4 py-2 border-2 text-sm font-medium ${
                            formData.color === color
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-background border-border hover:border-foreground'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sizes Required *</label>
                    <div className="flex gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-6 py-2 border-2 font-medium ${
                            formData.sizes.includes(size)
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-background border-border hover:border-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="input-sharp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="input-sharp min-h-[100px] resize-none"
                      placeholder="Any special instructions? (e.g., Print on back, Add text, etc.)"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Request Quote'}
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-secondary p-6">
              <h3 className="font-bold text-lg mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background flex items-center justify-center font-bold">1</span>
                  <span>Upload your design and fill in the details</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background flex items-center justify-center font-bold">2</span>
                  <span>Our team reviews your design and prepares a quote</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background flex items-center justify-center font-bold">3</span>
                  <span>We contact you within 24 hours with pricing and timeline</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background flex items-center justify-center font-bold">4</span>
                  <span>Once approved, we print and ship your custom order</span>
                </li>
              </ol>
            </div>

            <div className="bg-secondary p-6">
              <h3 className="font-bold text-lg mb-3">Pricing</h3>
              <p className="text-sm mb-3">Custom orders start from <span className="font-bold text-lg">₹599</span> per piece</p>
              <p className="text-xs text-muted-foreground">
                Final price depends on design complexity, product type, quantity, and printing method. Bulk discounts available!
              </p>
            </div>

            <div className="bg-secondary p-6">
              <h3 className="font-bold text-lg mb-3">Design Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li>• High-resolution images (300 DPI recommended)</li>
                <li>• Vector files (SVG, AI) work best</li>
                <li>• Minimum 2000x2000 pixels for large prints</li>
                <li>• Avoid copyrighted content</li>
                <li>• Dark designs on light colors, and vice versa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
