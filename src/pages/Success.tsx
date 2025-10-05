import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Success() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase, {user?.name || 'valued customer'}!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            What happens next?
          </h2>
          <ul className="text-left text-green-700 space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Your courses are now available in your account
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              You'll receive a confirmation email shortly
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Start learning immediately with lifetime access
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/courses"
            className="w-full sm:w-auto btn-primary"
          >
            Browse More Courses
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto btn-secondary"
          >
            Return to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@byway.com" className="text-primary-600 hover:text-primary-800">
              support@byway.com
            </a>
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>Order processed securely</span>
            <span>•</span>
            <span>30-day money-back guarantee</span>
            <span>•</span>
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
