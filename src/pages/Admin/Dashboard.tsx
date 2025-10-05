import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { StatCard } from "../../components/StatCard";
import { QuickLink } from "../../components/QuickLink";
import { ActivityItem } from "../../components/ActivityItem";
import { RevenueChart } from "../../components/RevenueChart";
import { EnrollmentsChart } from "../../components/EnrollmentsChart";
import StatsPie from "../../components/StatsPie"; // <-- added

interface DashboardStats {
  totalInstructors: number;
  totalCategories: number;
  totalCourses: number;
  monthlySubscriptions: number;
}

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("/admin/dashboard/stats")).data,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Instructors"
          value={stats?.totalInstructors}
          trend="+12% this month"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 21H3v-1a6 6 0 0112 0v1zM12 4.354a4 4 0 110 5.292"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Categories"
          value={`${stats?.totalCategories ?? 0}`}
          trend="+5% this month"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses}
          trend="+18% this month"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13"
              />
            </svg>
          }
        />
        <StatCard
          title="Monthly Subscriptions"
          value={stats?.monthlySubscriptions}
          trend="+25% this month"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <QuickLink
          to="/admin/instructors"
          title="Manage Instructors"
          subtitle="Add, edit, or remove instructors"
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"
              />
            </svg>
          }
        />
        <QuickLink
          to="/admin"
          title="static Manage Categories"
          subtitle="Organize your courses"
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"
              />
            </svg>
          }
        />
        <QuickLink
          to="/admin/courses"
          title="Manage Courses"
          subtitle="Create and manage all courses"
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13M7.5 5C5.754 5 4.168 5.477 3 6.253v13"
              />
            </svg>
          }
        />
      </div>

      {/* Recent Activity + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600 mt-1">
              Latest platform updates
            </p>
          </div>
          <div className="p-6 space-y-4">
            <ActivityItem
              title="New Course Added"
              text='"Advanced React Patterns" has been published by John Smith'
              time="2 hours ago"
              gradientFrom="from-green-50"
              gradientTo="to-emerald-50"
            />
            <ActivityItem
              title="New Instructor Registered"
              text="Sarah Johnson joined as a Web Development instructor"
              time="5 hours ago"
              gradientFrom="from-blue-50"
              gradientTo="to-indigo-50"
            />
            <ActivityItem
              title="Category Updated"
              text='"Machine Learning" category description has been updated'
              time="1 day ago"
              gradientFrom="from-purple-50"
              gradientTo="to-pink-50"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          <StatsPie stats={stats} /> {/* <-- added */}
          <EnrollmentsChart />
          <RevenueChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
