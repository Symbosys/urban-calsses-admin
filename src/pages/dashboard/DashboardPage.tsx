import { PageContainer } from "@/components/layout/PageContainer";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const revenueData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 3600 },
];

const courseData = [
  { name: "Web Dev", students: 450 },
  { name: "Design", students: 320 },
  { name: "Marketing", students: 280 },
  { name: "Business", students: 190 },
  { name: "Photo", students: 150 },
];

const categoryDistribution = [
  { name: "Tech", value: 45 },
  { name: "Design", value: 25 },
  { name: "Other", value: 30 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899"];

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    trend: "up"
  },
  {
    title: "Total Students",
    value: "+2350",
    description: "+180.1% from last month",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    trend: "up"
  },
  {
    title: "Active Courses",
    value: "142",
    description: "+12 since last week",
    icon: BookOpen,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    trend: "up"
  },
  {
    title: "Active Instructors",
    value: "28",
    description: "No change this week",
    icon: GraduationCap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    trend: "neutral"
  },
];

export default function DashboardPage() {
  return (
    <PageContainer 
      title="Dashboard" 
      description="Real-time analytics and platform overview."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-xl bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bgColor)}>
                <stat.icon className={cn("size-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {stat.trend === "up" && <ArrowUpRight className="size-3 text-emerald-500" />}
                {stat.trend === "down" && <ArrowDownRight className="size-3 text-destructive" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888888', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888888', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="lg:col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-violet-500" />
              Category Share
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-8">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8 w-full">
              {categoryDistribution.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Course Popularity */}
        <Card className="lg:col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Popular Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888820" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                  <Bar dataKey="students" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "John Doe", action: "enrolled in", course: "Web Development Bootcamp", time: "2 minutes ago" },
                { name: "Sarah Smith", action: "purchased", course: "Mastering UI Design", time: "1 hour ago" },
                { name: "Mike Johnson", action: "completed", course: "Digital Marketing 101", time: "3 hours ago" },
                { name: "Emma Wilson", action: "reviewed", course: "React for Beginners", time: "5 hours ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                      {activity.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {activity.name} <span className="font-normal text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-sm font-medium text-primary/80">{activity.course}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground italic">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
