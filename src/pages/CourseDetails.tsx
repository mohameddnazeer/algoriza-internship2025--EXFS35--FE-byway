import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  categoryId: string;
  categoryName: string;
  instructorId: string;
  instructorName: string;
  imagePath?: string;
  rating: number;
  studentsCount: number;
  createdAt: string;
}

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, items } = useCart();

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: relatedCourses } = useQuery<Course[]>({
    queryKey: ['related-courses', course?.categoryId],
    queryFn: async () => {
      const response = await api.get('/courses', {
        params: {
          categoryId: course?.categoryId,
          pageSize: 4,
          excludeId: id,
        },
      });
      return response.data.items;
    },
    enabled: !!course?.categoryId,
  });

  const isInCart = items.some(item => item.id === id);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course) {
      addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        imagePath: course.imagePath,
        instructor: course.instructorName,
      });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course && !isInCart) {
      addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        imagePath: course.imagePath,
        instructor: course.instructorName,
      });
    }
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Image */}
          <div className="mb-6">
            {course.imagePath ? (
              <img
                src={course.imagePath}
                alt={course.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">No Image Available</span>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                {course.categoryName}
              </span>
              <span className="text-sm text-gray-600">{course.level}</span>
              <div className="flex items-center">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-4">By {course.instructorName}</p>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{course.studentsCount}</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{course.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">⭐ {course.rating}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">${course.price}</div>
              <div className="text-sm text-gray-600">Price</div>
            </div>
          </div>

          {/* Static Sections */}
          <div className="space-y-8">
            {/* Reviews Section */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 text-center">
                  Reviews feature coming soon! Students will be able to share their learning experience here.
                </p>
              </div>
            </div>

            {/* Share Section */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share this Course</h3>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                  <span>💼</span>
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="card p-6">
              <div className="text-3xl font-bold text-primary-600 mb-4">${course.price}</div>
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    isInCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full btn-secondary"
                >
                  Buy Now
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-medium">{course.instructorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{course.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-medium">{course.studentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      {relatedCourses && relatedCourses.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Courses Like This</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCourses.map((relatedCourse) => (
              <div
                key={relatedCourse.id}
                onClick={() => navigate(`/courses/${relatedCourse.id}`)}
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  {relatedCourse.imagePath ? (
                    <img
                      src={relatedCourse.imagePath}
                      alt={relatedCourse.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedCourse.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">By {relatedCourse.instructorName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">${relatedCourse.price}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">{relatedCourse.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
