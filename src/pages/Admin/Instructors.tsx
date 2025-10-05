import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';

interface Instructor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  jobTitle: number;
  bio: string;
  avatarBase64?: string;
  coursesCount: number;
  createdAt: string;
}

interface InstructorFormData {
  name: string;
  email: string;
  phoneNumber: string;
  jobTitle: number;
  bio: string;
  avatarBase64?: string;
}



export const AdminInstructors: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const queryClient = useQueryClient();

  const { data: instructorsData, isLoading } = useQuery({
    queryKey: ['instructors', currentPage, searchTerm],
    queryFn: async () => {
      const response = await api.get('/catalog/instructors', {
        params: {
          page: currentPage,
          pageSize,
          search: searchTerm,
        },
      });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InstructorFormData) => {
      const response = await api.post('/instructors', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      setIsModalOpen(false);
      setEditingInstructor(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InstructorFormData }) => {
      const response = await api.put(`/instructors/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      setIsModalOpen(false);
      setEditingInstructor(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/instructors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });

  const handleSubmit = (data: InstructorFormData) => {
    if (editingInstructor) {
      updateMutation.mutate({ id: editingInstructor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };



  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
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
        'Your instructor has been deleted.',
        'success'
      );
    }
  };

  const totalPages = Math.ceil((instructorsData?.totalItems || 0) / pageSize);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructors Management</h1>
          <p className="mt-2 text-gray-600">Manage your platform instructors</p>
        </div>
        <button
          onClick={() => {
            setEditingInstructor(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          Add Instructor
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or job title..."
          className="input-field max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {instructorsData?.items?.map((instructor: Instructor) => (
            <li key={instructor.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {instructor.avatarBase64 ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`data:image/jpeg;base64,${instructor.avatarBase64}`}
                        alt=""
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {instructor.name}
                    </div>
                    <div className="text-sm text-gray-500">{getJobTitleName(instructor.jobTitle)}</div>
                    <div className="text-sm text-gray-500">{instructor.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {instructor.coursesCount} courses
                  </span>
                  <button
                    onClick={() => handleEdit(instructor)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                   <button
                    onClick={() => handleDelete(instructor.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={instructor.coursesCount > 0}
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
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, instructorsData?.totalItems || 0)} of {instructorsData?.totalItems || 0} results
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

      {/* Modal */}
      {isModalOpen && (
        <InstructorModal
          instructor={editingInstructor}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInstructor(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

interface InstructorModalProps {
  instructor: Instructor | null;
  onSubmit: (data: InstructorFormData) => void;
  onClose: () => void;
  isLoading: boolean;
}

const InstructorModal: React.FC<InstructorModalProps> = ({
  instructor,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState<InstructorFormData>({
    name: instructor?.name || '',
    email: instructor?.email || '',
    phoneNumber: instructor?.phoneNumber || '',
    jobTitle: instructor?.jobTitle || 0,
    avatarBase64: instructor?.avatarBase64 || '',
    bio: instructor?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await api.post('/fileupload/image', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && response.data.filePath) {
          setFormData(prev => ({ ...prev, avatarBase64: response.data.filePath }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFormData({
            ...formData,
            avatarBase64: base64.split(',')[1], // Remove data:image/jpeg;base64, prefix
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {instructor ? 'Edit Instructor' : 'Add New Instructor'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: parseInt(e.target.value) })}
                >
                  <option value="">Select Job Title</option>
                  <option value={0}>Fullstack Developer</option>
                  <option value={1}>Backend Developer</option>
                  <option value={2}>Frontend Developer</option>
                  <option value={3}>UX/UI Designer</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Enter instructor bio (max 1000 characters)"
                maxLength={1000}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.bio.length}/1000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFileChange}
              />
              {formData.avatarBase64 && (
                 <div className="mt-2">
                   <img
                     src={formData.avatarBase64.startsWith('data:') ? formData.avatarBase64 : `http://localhost:5000${formData.avatarBase64}`}
                     alt="Avatar preview"
                     className="w-16 h-16 rounded-full object-cover"
                   />
                 </div>
               )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Instructor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Job title mapping for display
const getJobTitleName = (jobTitle: number): string => {
  const jobTitles = {
    0: 'Fullstack Developer',
    1: 'Backend Developer', 
    2: 'Frontend Developer',
    3: 'UX/UI Designer'
  };
  return jobTitles[jobTitle as keyof typeof jobTitles] || 'Unknown';
};