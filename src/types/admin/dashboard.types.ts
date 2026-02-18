export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardRecentOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    title: string;
  };
}

export interface DashboardRecentUser {
  name: string;
  email: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: DashboardRecentOrder[];
  recentUsers: DashboardRecentUser[];
}
