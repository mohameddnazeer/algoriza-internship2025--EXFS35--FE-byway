import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  level: string;
  categoryName?: string;
  instructorName?: string;
  imagePath?: string;
  rating: number;
  studentsCount: number;
}

interface Category {
  id: string;
  name: string;
}

export const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', currentPage, searchTerm, selectedCategory, sortBy],
    queryFn: async () => {
      const response = await api.get('/catalog/courses', {
        params: {
          page: currentPage,
          pageSize,
          search: searchTerm,
          categoryId: selectedCategory,
          sort: sortBy,
        },
      });
      return response.data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/catalog/categories');
      return response.data;
    },
  });

  const totalPages = Math.ceil((coursesData?.totalItems || 0) / pageSize);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
        <p className="text-gray-600">Discover and learn new skills with our comprehensive courses</p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search courses..."
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            className="input-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {coursesData?.items?.length || 0} of {coursesData?.totalItems || 0} courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
        {coursesData?.items?.map((course: Course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
            <div className="relative overflow-hidden">
              {course.imagePath ? (
                <img
                  src={course.imagePath}
                  alt={course.name}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-52 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <span className="text-gray-600 font-medium">Course Image</span>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {course.categoryName || 'General'}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {course.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">
                    {(course.instructorName || 'Instructor').charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">By {course.instructorName || 'Instructor'}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {'⭐'.repeat(Math.floor(course.rating))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {course.studentsCount} students
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold gradient-text">${course.price}</span>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Course →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {coursesData?.items?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  currentPage === pageNum
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
