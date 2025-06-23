
import React, { useState, ReactNode, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartItem, Product } from '../types'; // Added Product import
// LOGO_URL constants are removed as we are using text-based logo

// --- Icon Components (Simple SVGs or Unicode) ---
export const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>
);

// SunIcon is no longer used for the logo, but kept in case it's used elsewhere or for future features.
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.35.936 2.528 2.25 2.528s2.25-1.178 2.25-2.528c0-1.242-1.008-2.25-2.25-2.25z" />
 </svg>
);


// --- Basic UI Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  let variantStyle = '';
  switch (variant) {
    case 'primary': variantStyle = 'bg-primary hover:bg-green-700 text-white focus:ring-primary'; break; // Updated hover for new primary
    case 'secondary': variantStyle = 'bg-secondary hover:bg-gray-700 text-white focus:ring-secondary'; break; // Updated hover for new secondary
    case 'accent': variantStyle = 'bg-accent hover:bg-yellow-600 text-white focus:ring-accent'; break; // Kept accent as is
    case 'danger': variantStyle = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'; break;
    case 'outline': variantStyle = 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary'; break;
  }
  const sizeStyle = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base';
  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      id={id}
      className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 text-gray-900 ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      id={id}
      className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 text-gray-900 ${className}`}
      rows={3}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      id={id}
      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white disabled:bg-gray-100 text-gray-900 ${className}`}
      {...props}
    >
      <option value="">Select...</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-white shadow-lg rounded-lg overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" 
         aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className={`bg-white rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}>
        <div className="flex justify-between items-center mb-4">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'}> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'h-5 w-5 border-2' : size === 'lg' ? 'h-16 w-16 border-4' : 'h-10 w-10 border-t-2 border-b-2';
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${sizeClasses} border-primary ${size !== 'md' ? 'border-t-transparent' : ''}`}></div>
    </div>
  );
};


interface BadgeProps {
  text: string;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'primary';
  className?: string;
}
export const Badge: React.FC<BadgeProps> = ({ text, color = 'green', className = '' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800', 
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/20 text-primary', // Using theme primary
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {text}
    </span>
  );
};

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}
export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const baseClasses = "p-4 mb-4 text-sm rounded-lg flex justify-between items-start";
  const typeClasses = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700", // Tailwind yellow is generally okay for warnings
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div>
        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}!</span> {message}
      </div>
      {onClose && (
        <button onClick={onClose} className={`-mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 rounded-lg focus:ring-2 items-center justify-center
          ${type === 'success' ? 'hover:bg-green-200 focus:ring-green-400' : ''}
          ${type === 'error' ? 'hover:bg-red-200 focus:ring-red-400' : ''}
          ${type === 'info' ? 'hover:bg-blue-200 focus:ring-blue-400' : ''}
          ${type === 'warning' ? 'hover:bg-yellow-200 focus:ring-yellow-400' : ''}
        `}
         aria-label="Close alert">
          <span className="sr-only">Close</span>
          &times;
        </button>
      )}
    </div>
  );
};

interface StarRatingProps {
  rating: number; // 0-5
  setRating?: (rating: number) => void; // Optional: for interactive rating
  size?: 'sm' | 'md' | 'lg';
}
export const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, size = 'md' }) => {
  const starSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => setRating && setRating(star)}
          className={`
            ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'} 
            ${starSize} 
            ${setRating ? 'cursor-pointer hover:text-yellow-500' : ''}
          `}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={setRating ? `Set rating to ${star}` : `${star} out of 5 stars`}
          role={setRating ? "button" : "img"}
          aria-valuenow={setRating ? rating : undefined}
          aria-valuetext={setRating ? `${rating} out of 5 stars` : undefined}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};


// --- Layout Components ---
export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navLinkClasses = "text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors";
  // Adjusted active class to ensure text color contrasts with yellow background
  const activeNavLinkClasses = "text-primary bg-yellow-100 hover:text-green-700"; 

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/'); // Navigate to home on logout
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-2xl md:text-3xl font-bold">
              <span className="text-primary">Solar</span>
              <span className="text-secondary">Com</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} end>Home</NavLink>
              <NavLink to="/compare-panels" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Panels</NavLink>
              <NavLink to="/calculators" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Calculators</NavLink>
              <NavLink to="/services" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Services</NavLink>
              <NavLink to="/store" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Store</NavLink>
              <NavLink to="/loans" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Loans</NavLink>
              <NavLink to="/ai-assistant" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>AI Assistant</NavLink>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/store/cart" className={`${navLinkClasses} relative`} aria-label="View Shopping Cart">
              <CartIcon />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-hidden="true">{totalCartItems}</span>
              )}
            </NavLink>
            {user ? (
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} aria-expanded={isUserDropdownOpen} aria-controls="user-dropdown-menu" aria-haspopup="true">
                  {user.name.split(' ')[0]}
                  <UserIcon className="inline ml-1 w-4 h-4" />
                </Button>
                 {isUserDropdownOpen && (
                    <div id="user-dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5" role="menu">
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => setIsUserDropdownOpen(false)}
                          role="menuitem"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <NavLink to="/auth" className={navLinkClasses} aria-label="Login or Register"><UserIcon /></NavLink>
            )}
          </div>
          <div className="md:hidden flex items-center">
             <NavLink to="/store/cart" className={`${navLinkClasses} relative mr-2`} aria-label="View Shopping Cart">
              <CartIcon />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-hidden="true">{totalCartItems}</span>
              )}
            </NavLink>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/compare-panels" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Panels</NavLink>
            <NavLink to="/calculators" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Calculators</NavLink>
            <NavLink to="/services" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Services</NavLink>
            <NavLink to="/store" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Store</NavLink>
            <NavLink to="/loans" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Loans</NavLink>
            <NavLink to="/ai-assistant" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>AI Assistant</NavLink>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Admin Panel</NavLink>
                )}
                <button onClick={handleLogout} className={`block w-full text-left ${navLinkClasses}`}>Logout ({user.name.split(' ')[0]})</button>
              </>
            ) : (
              <NavLink to="/auth" className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={()=>setIsMobileMenuOpen(false)}>Login/Register</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-darkgray text-gray-300 py-8">
    <div className="container mx-auto px-4 text-center">
      <div className="text-3xl font-bold mx-auto mb-4">
        <span className="text-white">Solar</span>
        <span className="text-gray-300">Com</span>
      </div>
      <p>&copy; {new Date().getFullYear()} SolarCom. All rights reserved.</p>
      <p className="text-sm mt-2">Your one-stop solution for a brighter, greener future.</p>
    </div>
  </footer>
);

interface SectionWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children, className = '', titleClassName = '' }) => (
  <section className={`py-8 md:py-12 ${className}`}>
    {title && <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center ${titleClassName}`}>{title}</h2>}
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </section>
);

// --- Form Components ---
interface EnquiryFormProps {
  productName?: string;
  serviceName?: string;
  onSubmit: (details: { name: string, email: string, phone: string, message: string }) => void;
  isLoading?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ productName, serviceName, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, message });
    // Optionally clear form: setName(''); setEmail(''); setPhone(''); setMessage('');
  };

  const subject = productName ? `Enquiry for ${productName}` : serviceName ? `Enquiry for ${serviceName}` : 'General Enquiry';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-lg font-medium text-gray-700">{subject}</h4>
      <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <Textarea label="Your Message / Requirements" value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size="sm"/> : 'Submit Enquiry'}
      </Button>
    </form>
  );
};

// --- E-commerce Specific Components (Simplified) ---
interface ProductCardProps {
  product: Product | CartItem; // Can be Product or CartItem
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (productId: string) => void;
  showQuantityControls?: boolean;
  onIncreaseQuantity?: (productId: string) => void;
  onDecreaseQuantity?: (productId: string) => void;
  onRemoveFromCart?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, onAddToCart, onViewDetails, showQuantityControls, onIncreaseQuantity, onDecreaseQuantity, onRemoveFromCart 
}) => {
  const isCartItem = (p: Product | CartItem): p is CartItem => 'quantity' in p;

  return (
    <Card className="flex flex-col h-full">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 h-12 overflow-hidden">{product.name}</h3> {/* Fixed height for name */}
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        <p className="text-xl font-bold text-primary mb-2">₹{product.price.toLocaleString()}</p>
        <div className="mb-2">
            <StarRating rating={product.userRating} size="sm" />
            <p className="text-xs text-gray-500">{product.reviews.length} review{product.reviews.length !==1 ? 's' : ''}</p>
        </div>
        
        <div className="mt-auto space-y-2">
          {showQuantityControls && isCartItem(product) && onIncreaseQuantity && onDecreaseQuantity && onRemoveFromCart && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => onDecreaseQuantity(product.id)} disabled={product.quantity <= 1} aria-label="Decrease quantity">-</Button>
                <span aria-live="polite">{product.quantity}</span>
                <Button size="sm" variant="outline" onClick={() => onIncreaseQuantity(product.id)} aria-label="Increase quantity">+</Button>
              </div>
              <Button size="sm" variant="danger" onClick={() => onRemoveFromCart(product.id)}>Remove</Button>
            </div>
          )}
          {!showQuantityControls && onAddToCart && (
            <Button variant="primary" className="w-full" onClick={() => onAddToCart(product as Product)} disabled={(product as Product).stock === 0}>
                {(product as Product).stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
          {onViewDetails && (
            <Button variant="outline" className="w-full" onClick={() => onViewDetails(product.id)}>View Details</Button>
          )}
        </div>
      </div>
    </Card>
  );
};
