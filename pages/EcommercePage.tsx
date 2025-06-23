import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Product, ProductCategory, CartItem as CartItemType, Review as ReviewType } from '../types';
import { fetchProducts, fetchProductById, submitProductReview, submitLead } from '../services/mockDataService';
import { ECOMMERCE_CATEGORIES } from '../constants';
import { Button, Card, SectionWrapper, LoadingSpinner, Input, Select, StarRating, Modal, Alert, ProductCard as ProductCardUI, EnquiryForm, Textarea } from '../components/CommonUI';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';


const ProductListPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts()
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data); // Initially show all products
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setNotification({ type: 'error', message: 'Failed to load products.' });
      });
  }, []);

  const handleFilter = useCallback(() => {
    let tempProducts = [...allProducts];
    if (selectedCategory) {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      tempProducts = tempProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(tempProducts);
  }, [allProducts, selectedCategory, searchTerm]);

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, searchTerm, handleFilter]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification({ type: 'success', message: `${product.name} added to cart!` });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/store/product/${productId}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <SectionWrapper title="Our Products">
      {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
      
      <div className="mb-8 p-4 bg-white shadow rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Select
            label="Filter by Category"
            options={[{ value: '', label: 'All Categories' }, ...ECOMMERCE_CATEGORIES.map(c => ({ value: c.name, label: c.name }))]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64"
          />
          <Input
            label="Search Products"
            type="text"
            placeholder="Enter product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
        <Button onClick={() => {setSelectedCategory(''); setSearchTerm('');}} className="w-full md:w-auto mt-4 md:mt-0 self-end">Clear Filters</Button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCardUI
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onViewDetails={() => handleViewDetails(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found matching your criteria. Try adjusting the filters.</p>
      )}
    </SectionWrapper>
  );
};

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string, userName: string) => void;
    isLoading: boolean;
}

const ProductReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setUserName(user.name);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        if (!userName.trim()) {
            alert("Please enter your name.");
            return;
        }
        onSubmit(rating, comment, userName);
        setRating(0);
        setComment('');
        // setUserName(''); // Keep username if logged in
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input 
                label="Your Name" 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                required 
                disabled={!!user} // Disable if logged in and name pre-filled
            />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
                <StarRating rating={rating} setRating={setRating} size="md" />
            </div>
            <Textarea 
                label="Your Review" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Share your experience with this product..." 
                rows={4} 
            />
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Submit Review'}
            </Button>
        </form>
    );
};


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      fetchProductById(productId)
        .then(data => {
          setProduct(data || null);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setNotification({ type: 'error', message: 'Failed to load product details.' });
        });
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setNotification({ type: 'success', message: `${product.name} added to cart!` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEnquirySubmit = async (details: { name: string, email: string, phone: string, message: string }) => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      const response = await submitLead({
        ...details,
        location: 'N/A for product enquiry', 
        productInterest: product.name,
      });
      setNotification({type: 'success', message: response.message});
      setIsEnquiryModalOpen(false);
    } catch (error) {
       setNotification({type: 'error', message: 'Failed to submit enquiry. Please try again.'});
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string, userName: string) => {
    if (!product) return;
    setIsSubmitting(true);
    try {
        const response = await submitProductReview(product.id, { userName, rating, comment });
        setNotification({type: 'success', message: response.message});
        // Refresh product data to show new review
        if (productId) {
            const updatedProduct = await fetchProductById(productId);
            setProduct(updatedProduct || null);
        }
    } catch (error) {
        setNotification({type: 'error', message: 'Failed to submit review.'});
    } finally {
        setIsSubmitting(false);
    }
  };


  if (isLoading) return <LoadingSpinner />;
  if (!product) return <SectionWrapper title="Product Not Found"><Alert type="error" message="The product you are looking for does not exist or could not be loaded." /></SectionWrapper>;

  return (
    <SectionWrapper title={product.name}>
      {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto md:h-full max-h-[500px] object-contain p-4 bg-gray-100" />
          <div className="p-6 flex flex-col">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <StarRating rating={product.userRating} />
            <p className="text-xs text-gray-500 mb-3">{product.reviews.length} reviews</p>
            <p className="text-3xl font-bold text-primary mb-4">₹{product.price.toLocaleString()}</p>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{product.description}</p>
            <p className={`font-semibold mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
            <div className="mt-auto space-y-3">
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsEnquiryModalOpen(true)}>Enquire Now</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h3>
        {product.reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {product.reviews.map((review: ReviewType) => (
              <Card key={review.id} className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-800">{review.userName}</p>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mb-2">{new Date(review.date).toLocaleDateString()}</p>
                <p className="text-gray-700">{review.comment}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-6">No reviews for this product yet. Be the first to review!</p>
        )}
         <h4 className="text-xl font-semibold text-gray-700 mb-2">Write a Review</h4>
        <ProductReviewForm onSubmit={handleReviewSubmit} isLoading={isSubmitting} />
      </div>

      {isEnquiryModalOpen && (
        <Modal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} title={`Enquire about ${product.name}`}>
          <EnquiryForm 
            productName={product.name}
            onSubmit={handleEnquirySubmit}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </SectionWrapper>
  );
};

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <SectionWrapper title="Shopping Cart">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/store">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="Shopping Cart">
      <div className="bg-white shadow-md rounded-lg p-6">
        {cart.map(item => (
          <div key={item.id} className="flex flex-col md:flex-row items-center justify-between py-4 border-b last:border-b-0">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">Price: ₹{item.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
              <span>{item.quantity}</span>
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
            </div>
            <p className="font-semibold text-gray-700 my-2 md:my-0">Subtotal: ₹{(item.price * item.quantity).toLocaleString()}</p>
            <Button size="sm" variant="danger" onClick={() => removeFromCart(item.id)}>Remove</Button>
          </div>
        ))}
        <div className="mt-6 text-right">
          <h3 className="text-2xl font-bold text-gray-800">Total: ₹{getTotalPrice().toLocaleString()}</h3>
          <div className="mt-4 space-x-3">
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            <Button variant="primary" size="lg" onClick={() => navigate('/store/checkout')}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

const CheckoutPage: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { user } = useAuth(); // Pre-fill form if user is logged in

  useEffect(() => {
    if (user) {
        setName(user.name);
        setEmail(user.email);
        // Phone and address might not be in basic user object, would need to fetch profile
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/store'); // Redirect if cart is empty and order not yet placed
    }
  }, [cart, navigate, orderPlaced]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call for order placement
    console.log("Placing order:", { name, email, phone, address, cart, total: getTotalPrice() });
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    setIsProcessing(false);
    setOrderPlaced(true);
    clearCart(); 
  };

  if (orderPlaced) {
    return (
      <SectionWrapper title="Order Successful!">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          <p className="text-xl text-gray-700 mb-2">Thank you for your order, {name}!</p>
          <p className="text-gray-600 mb-6">Your order has been placed successfully. You will receive a confirmation email at {email} shortly.</p>
          <Link to="/store">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="Checkout">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handlePlaceOrder} className="md:col-span-2 bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h3>
          <Input label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
          <Textarea label="Shipping Address" value={address} onChange={e => setAddress(e.target.value)} required rows={4} />
          <Button type="submit" variant="primary" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? <LoadingSpinner /> : `Place Order (Pay ₹${getTotalPrice().toLocaleString()})`}
          </Button>
           <p className="text-xs text-gray-500 text-center mt-2">Note: This is a demo. No actual payment will be processed.</p>
        </form>

        <div className="md:col-span-1 bg-gray-50 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b text-sm">
              <span className="text-gray-600">{item.name} (x{item.quantity})</span>
              <span className="text-gray-700 font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-2 font-bold text-lg">
            <span className="text-gray-800">Total</span>
            <span className="text-primary">₹{getTotalPrice().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};


const EcommercePage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProductListPage />} />
      <Route path="product/:productId" element={<ProductDetailPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
    </Routes>
  );
};

export default EcommercePage;
