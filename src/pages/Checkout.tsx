import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  
  const [errors, setErrors] = useState<Partial<PaymentForm & { billingAddress: Partial<PaymentForm['billingAddress']> }>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Redirect to cart if empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const validateForm = (): boolean => {
    const newErrors: any = {};

    // Card validation
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }

    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    // Billing address validation
    if (!formData.billingAddress.street.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, street: 'Street address is required' };
    }

    if (!formData.billingAddress.city.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, city: 'City is required' };
    }

    if (!formData.billingAddress.state.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, state: 'State is required' };
    }

    if (!formData.billingAddress.zipCode.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, zipCode: 'ZIP code is required' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PaymentForm],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle payment error
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`input ${errors.expiryDate ? 'border-red-500' : ''}`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    placeholder="John Doe"
                    className={`input ${errors.cardholderName ? 'border-red-500' : ''}`}
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.street}
                    onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                    placeholder="123 Main St"
                    className={`input ${errors.billingAddress?.street ? 'border-red-500' : ''}`}
                  />
                  {errors.billingAddress?.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingAddress.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.city}
                      onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                      placeholder="New York"
                      className={`input ${errors.billingAddress?.city ? 'border-red-500' : ''}`}
                    />
                    {errors.billingAddress?.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingAddress.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.state}
                      onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                      placeholder="NY"
                      className={`input ${errors.billingAddress?.state ? 'border-red-500' : ''}`}
                    />
                    {errors.billingAddress?.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingAddress.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.zipCode}
                      onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                      placeholder="10001"
                      className={`input ${errors.billingAddress?.zipCode ? 'border-red-500' : ''}`}
                    />
                    {errors.billingAddress?.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingAddress.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={formData.billingAddress.country}
                      onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                      className="input"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing Payment...' : `Complete Payment - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Course List */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {item.imagePath ? (
                    <img
                      src={item.imagePath}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      By {item.instructor}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${item.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (15%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
