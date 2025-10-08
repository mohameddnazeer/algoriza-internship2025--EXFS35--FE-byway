# Byway  Client

A modern  web application built with React, TypeScript, and Vite. This client application provides a complete online learning platform with course management, user authentication, shopping cart functionality, and admin dashboard.


## 📄 License to Login

login by admin role => admin@byway.com for mail and Admin123! for password
login by user role => mohamed55nazeer55@gmail.com for mail and Nazeer@123 for password


## 🚀 Features

### User Features
- **Course Catalog**: Browse and search through available courses
- **Course Details**: View detailed course information and enrollment
- **User Authentication**: Login and registration system
- **Shopping Cart**: Add courses to cart and manage purchases
- **Checkout Process**: Complete course purchases with integrated payment flow
- **User Dashboard**: Track enrollments and learning progress

### Admin Features  
- **Admin Dashboard**: Comprehensive analytics and metrics
- **Course Management**: Create, edit, and manage courses
- **Instructor Management**: Manage instructor profiles and assignments
- **Revenue Analytics**: Track sales and enrollment statistics
- **User Management**: Monitor user activity and enrollments

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **State Management**: Jotai + React Context
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Notifications**: SweetAlert2

## 📁 Project Structure

```
src/
├── app/
│   └── routes.tsx          # Application routing configuration
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx      # Main layout component
│   │   └── Navbar.tsx      # Navigation bar
│   ├── ActivityItem.tsx    # Activity list item component
│   ├── EnrollmentsChart.tsx # Enrollment statistics chart
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   ├── QuickLink.tsx       # Quick action link component
│   ├── RevenueChart.tsx    # Revenue analytics chart
│   ├── StatCard.tsx        # Statistics display card
│   └── StatsPie.tsx        # Pie chart for statistics
├── contexts/
│   ├── AuthContext.tsx     # Authentication state management
│   └── CartContext.tsx     # Shopping cart state management
├── lib/
│   └── api.ts              # API client configuration
├── pages/
│   ├── Admin/
│   │   ├── Courses.tsx     # Admin course management
│   │   ├── Dashboard.tsx   # Admin dashboard
│   │   └── Instructors.tsx # Admin instructor management
│   ├── Cart.tsx            # Shopping cart page
│   ├── Checkout.tsx        # Checkout process page
│   ├── CourseDetails.tsx   # Individual course details
│   ├── Courses.tsx         # Course catalog page
│   ├── Landing.tsx         # Homepage/landing page
│   ├── Login.tsx           # User login page
│   ├── Register.tsx        # User registration page
│   └── Success.tsx         # Purchase success page
├── types/
│   └── auth.ts             # Authentication type definitions
├── index.css               # Global styles
└── main.tsx                # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd byway-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your API configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## 🔧 Configuration

### API Configuration
The API client is configured in `src/lib/api.ts`. Update the base URL and other settings as needed for your backend service.

### Routing
Application routes are defined in `src/app/routes.tsx`. The app uses React Router v6 with protected routes for authenticated users and admin-only sections.

### Styling
The project uses Tailwind CSS v4 for styling. Custom styles and animations are defined in `src/index.css`.

## 🔐 Authentication

The application includes a complete authentication system with:
- User registration and login
- Protected routes for authenticated users  
- Admin-only routes and components
- Persistent authentication state using React Context

## 🛒  Features

### Shopping Cart
- Add/remove courses from cart
- Persistent cart state across sessions
- Real-time cart updates

### Checkout Process
- Secure checkout flow
- Course enrollment upon successful purchase
- Success page with confirmation

## 📊 Admin Dashboard

The admin section provides comprehensive management tools:
- **Dashboard**: Key metrics and analytics
- **Course Management**: CRUD operations for courses
- **Instructor Management**: Manage instructor profiles
- **Analytics**: Revenue and enrollment tracking with interactive charts

## 🎨 UI Components

The application features a modern, responsive design with:
- Reusable component library
- Consistent design system
- Interactive charts and data visualizations
- Mobile-responsive layouts
- Smooth animations and transitions

## 🔄 State Management

The app uses a hybrid approach to state management:
- **React Context**: Authentication and cart state
- **Jotai**: Atomic state management for complex UI state
- **TanStack Query**: Server state and caching

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be generated in the `dist` directory, ready for deployment to any static hosting service.

### Preview Production Build

```bash
npm run preview
```




## 🙋‍♂️ Support

For support and questions, please [open an issue](https://github.com/mohameddnazeer/algoriza-internship2025--EXFS35--FE-byway) on GitHub.

---

Built with ❤️ using React, TypeScript, and Vite
