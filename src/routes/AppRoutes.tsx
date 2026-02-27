import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import { 
  CategoriesPage, 
  StudentsPage, 
  InstructorsPage, 
  OrdersPage, 
  BannersPage, 
  CouponsPage, 
  ReviewsPage,
  ResultsPage,
  OfflineCentersPage,
  BlogsPage
} from "@/pages/Pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="instructors" element={<InstructorsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="offline-centers" element={<OfflineCentersPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
             <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
             <p className="text-xl font-medium text-muted-foreground italic">Oops! The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}
