import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Pages
import Landing from '../pages/Landing';
import { Courses } from '../pages/Courses';
import { CourseDetails } from '../pages/CourseDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Success from '../pages/Success';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Admin Pages
import { AdminDashboard } from '../pages/Admin/Dashboard';
import { AdminInstructors } from '../pages/Admin/Instructors';
import { AdminCourses } from '../pages/Admin/Courses';
import '../index.css'
export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/instructors"
          element={
            <ProtectedRoute adminOnly>
              <AdminInstructors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute adminOnly>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
