import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';

// Level enum to match backend
enum Level {
  AllLevels = 0,
  Beginner = 1,
  Intermediate = 2,
  Expert = 3
}

interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
  level: Level;
  categoryId: number;
  categoryName: string;
  instructorId: number;
  instructorName: string;
  thumbnailPath?: string;
  rating: number;
  studentsCount: number;
  duration: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
}

interface CourseFormData {
  name: string;
  description: string;
  price: number;
  level: Level;
  categoryId: number;
  instructorId: number;
  thumbnailPath?: string;
  duration: number;
  rating: number;
}

export const AdminCourses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pageSize = 10;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Back to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', currentPage, searchTerm],
    queryFn: async () => {
      const response = await api.get('/courses', {
        params: {
          page: currentPage,
          pageSize,
          search: searchTerm,
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

  const { data: instructors } = useQuery<Instructor[]>({
    queryKey: ['instructors-list'],
    queryFn: async () => {
      const response = await api.get('/catalog/instructors');
      return response.data.items;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const response = await api.post('/courses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsModalOpen(false);
      setEditingCourse(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CourseFormData }) => {
      const response = await api.put(`/courses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsModalOpen(false);
      setEditingCourse(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleSubmit = (data: CourseFormData) => {
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (course: Course) => {
    console.log('Edit button clicked for course:', course.name);
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
      Swal.fire(
        'Deleted!',
        'Your course has been deleted.',
        'success'
      );
    }
  };

  const totalPages = Math.ceil((coursesData?.totalCourses || 0) / pageSize);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 py-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Admin Panal</span>
          </button>
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
            <p className="mt-2 text-gray-600">Manage your platform courses</p>
          </div>
        </div>
        <button
          onClick={() => {
            console.log('Add Course button clicked');
            setEditingCourse(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          Add Course
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, category, rating, or price..."
          className="input-field max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {coursesData?.courses?.map((course: Course) => (
            <li key={course.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16">
                    {course.thumbnailPath ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={course.thumbnailPath.startsWith('data:') ? course.thumbnailPath : `http://localhost:5000${course.thumbnailPath}`}
                        alt={course.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                    <div className="text-sm text-gray-500">{course.description}</div>
                    <div className="text-sm text-gray-500">{course.categoryName}</div>
                    <div className="text-sm text-gray-500">By {course.instructorName}</div>
                    <div className="text-sm text-gray-500">
                      ${course.price} • {getLevelName(course.level)} • ⭐ {course.rating} • {course.duration}h
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {course.studentsCount} students
                  </span>
                  <button
                    onClick={() => handleEdit(course)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={course.studentsCount > 0}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, coursesData?.totalCourses || 0)} of {coursesData?.totalCourses || 0} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <CourseModal
          course={editingCourse}
          categories={categories || []}
          instructors={instructors || []}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCourse(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

interface CourseModalProps {
  course: Course | null;
  categories: Category[];
  instructors: Instructor[];
  onSubmit: (data: CourseFormData) => void;
  onClose: () => void;
  isLoading: boolean;
}

// Helper function to convert Level enum to string
const getLevelName = (level: Level): string => {
  switch (level) {
    case Level.AllLevels:
      return 'All Levels';
    case Level.Beginner:
      return 'Beginner';
    case Level.Intermediate:
      return 'Intermediate';
    case Level.Expert:
      return 'Expert';
    default:
      return 'Unknown';
  }
};

// Star Rating Component
interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} transition-colors duration-200 focus:outline-none`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <svg
            className={`w-full h-full ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );
};

const CourseModal: React.FC<CourseModalProps> = ({
  course,
  categories,
  instructors,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    name: course?.name || '',
    description: course?.description || '',
    price: course?.price || 0,
    level: course?.level ?? Level.Beginner,
    categoryId: course?.categoryId || 0,
    instructorId: course?.instructorId || 0,
    thumbnailPath: course?.thumbnailPath || '',
    duration: course?.duration || 1,
    rating: course?.rating || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/fileupload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && response.data.filePath) {
          setFormData(prev => ({ ...prev, thumbnailPath: response.data.filePath }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData(prev => ({ ...prev, thumbnailPath: result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {course ? 'Edit Course' : 'Add New Course'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {course ? 'Update course information' : 'Create a new course for your platform'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Image Preview */}
            {formData.thumbnailPath && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={formData.thumbnailPath.startsWith('data:') ? formData.thumbnailPath : `http://localhost:5000${formData.thumbnailPath}`}
                    alt="Course preview"
                    className="w-32 h-32 object-cover rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnailPath: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter course name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Hours"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    />
                    <span className="absolute right-3 top-3 text-gray-500">hours</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={(rating) => setFormData({ ...formData, rating })}
                      size="lg"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) as Level })}
                  >
                    <option value={Level.AllLevels}>All Levels</option>
                    <option value={Level.Beginner}>Beginner</option>
                    <option value={Level.Intermediate}>Intermediate</option>
                    <option value={Level.Expert}>Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructor <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.instructorId || ''}
                    onChange={(e) => setFormData({ ...formData, instructorId: parseInt(e.target.value) })}
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="course-image"
                      onChange={handleFileChange}
                    />
                    
                    {/* Image Preview */}
                    {formData.thumbnailPath ? (
                      <div className="relative">
                        <img
                          src={formData.thumbnailPath.startsWith('data:') ? formData.thumbnailPath : `http://localhost:5000${formData.thumbnailPath}`}
                          alt="Course preview"
                          className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, thumbnailPath: undefined })}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <label htmlFor="course-image" className="block mt-3 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                          Change Image
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="course-image" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">Click to upload image</span>
                          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe what students will learn in this course..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{course ? 'Update Course' : 'Create Course'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};