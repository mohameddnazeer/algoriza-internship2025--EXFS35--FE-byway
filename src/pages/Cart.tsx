import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax;

  if (!user) {
    return null; // Will redirect to login
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any courses to your cart yet. Start exploring our amazing courses!
          </p>
          <Link
            to="/courses"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 inline-block"
          >
            🚀 Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-3">Shopping Cart</h1>
        <p className="text-xl text-gray-600">Review your selected courses before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {item.imagePath ? (
                      <img
                        src={item.imagePath}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📚</div>
                          <span className="text-xs text-gray-600 font-medium">Course</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">
                          {item.instructorName?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        By {item.instructorName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold gradient-text">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart Button */}
          <div className="mt-8 text-center">
            <button
              onClick={clearCart}
              className="bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
            >
              🧹 Clear All Items
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8 border border-gray-100 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Tax (15%)</span>
                <span className="font-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 mb-4"
            >
              💳 Proceed to Checkout
            </button>

            <Link
              to="/courses"
              className="block w-full text-center bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-xl text-lg font-medium transition-all duration-300"
            >
              ← Continue Shopping
            </Link>

            {/* Course List */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-4">📚 Courses in your cart:</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <span className="font-medium">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
