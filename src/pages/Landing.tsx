import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const { data: categories } = useQuery({ 
    queryKey: ['categories/top'], 
    queryFn: async () => (await api.get('/catalog/categories/top')).data 
  });
  const { data: courses } = useQuery({ 
    queryKey: ['courses/top'], 
    queryFn: async () => (await api.get('/catalog/courses/top')).data 
  });
  const { data: instructors } = useQuery({ 
    queryKey: ['instructors/top'], 
    queryFn: async () => (await api.get('/catalog/instructors/top')).data 
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full opacity-5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="text-center fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-shadow">
              Welcome to <span className="text-yellow-300">Byway</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              🚀 Unlock your potential with world-class online courses. Learn from industry experts and build the skills that matter in today's digital world.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/courses"
                className="btn-primary"
              >
                🎯 Explore Courses
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="btn-outline"
                >
                  ✨ Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-gray-50">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="card p-8">
              <div className="text-4xl font-bold gradient-text mb-3">10K+</div>
              <div className="text-gray-600 font-medium">Happy Students</div>
            </div>
            <div className="card p-8">
              <div className="text-4xl font-bold gradient-text mb-3">500+</div>
              <div className="text-gray-600 font-medium">Expert Courses</div>
            </div>
            <div className="card p-8">
              <div className="text-4xl font-bold gradient-text mb-3">100+</div>
              <div className="text-gray-600 font-medium">World-Class Instructors</div>
            </div>
            <div className="card p-8">
              <div className="text-4xl font-bold gradient-text mb-3">95%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover courses in trending fields and start your journey to expertise</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories?.map((category: any) => (
              <div key={category.id} className="text-center group cursor-pointer">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Start learning with our most popular courses designed by industry experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course: any) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="group">
                <div className="card-featured overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                  {course.imageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${course.imageBase64}`}
                      alt={course.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block">🎓</span>
                        <span className="text-gray-600 font-medium">Course Preview</span>
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {course.instructorName?.charAt(0) || 'I'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {course.instructorName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold gradient-text">
                          ${course.price}
                        </span>
                        <div className="text-xs text-gray-500">per course</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link
              to="/courses"
              className="btn-primary"
            >
              🚀 View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Expert Instructors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Learn from industry professionals and thought leaders who are passionate about sharing their knowledge</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors?.map((instructor: any) => (
              <div key={instructor.id} className="text-center group">
                <div className="card p-8 group-hover:shadow-2xl transition-all duration-300">
                  <div className="mb-6">
                    {instructor.avatarBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${instructor.avatarBase64}`}
                        alt={instructor.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-2xl font-bold">
                          {instructor.name?.charAt(0) || '👨‍🏫'}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {instructor.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-medium">
                    {instructor.expertise}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                    <span className="text-blue-600 text-sm font-semibold">
                      📚 {instructor.coursesCount || 0} courses
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 section-gradient text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-white rounded-full animate-float"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-shadow">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-pink-100 mb-12 leading-relaxed">
            🌟 Join thousands of students who are already advancing their careers with Byway. Transform your future today!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-pink-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  🚀 Sign Up Now
                </Link>
                <Link
                  to="/courses"
                  className="border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300"
                >
                  📖 Browse Courses
                </Link>
              </>
            ) : (
              <Link
                to="/courses"
                className="bg-white text-pink-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                🎯 Continue Learning
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
