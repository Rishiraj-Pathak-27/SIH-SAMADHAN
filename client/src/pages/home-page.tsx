import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportCard } from "@/components/reports/report-card";
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Report } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();

  const { data: reports = [], isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    pending: number;
    in_progress: number;
    resolved: number;
    total: number;
  }>({
    queryKey: ["/api/analytics/stats"],
    enabled: user?.role === 'admin',
  });

  const recentReports = reports.slice(0, 3);
  const userReports = user?.role === 'admin' ? reports : reports.filter(r => r.userId === user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Welcome to CivicReport
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Help improve your community by reporting civic issues
          </p>
          <Link href="/report">
            <Button size="lg" data-testid="button-create-report">
              <Plus className="mr-2 h-5 w-5" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {user?.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total">
                  {statsLoading ? "..." : stats?.total || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600" data-testid="stat-pending">
                  {statsLoading ? "..." : stats?.pending || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600" data-testid="stat-progress">
                  {statsLoading ? "..." : stats?.in_progress || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600" data-testid="stat-resolved">
                  {statsLoading ? "..." : stats?.resolved || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/report">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Report Issue</h3>
                  <p className="text-sm text-muted-foreground">Submit a new civic issue report</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/my-reports">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Track Reports</h3>
                  <p className="text-sm text-muted-foreground">View your submitted reports</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {user?.role === 'admin' && (
            <Link href="/admin">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Admin Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Manage all reports and analytics</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {user?.role === 'admin' ? 'Recent Reports' : 'Your Recent Reports'}
            </CardTitle>
            <Link href={user?.role === 'admin' ? '/admin' : '/my-reports'}>
              <Button variant="outline" size="sm" data-testid="button-view-all">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : recentReports.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                <p className="text-muted-foreground mb-4">
                  {user?.role === 'admin' 
                    ? 'No reports have been submitted yet.' 
                    : "You haven't submitted any reports yet."}
                </p>
                <Link href="/report">
                  <Button data-testid="button-first-report">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Your First Report
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <ReportCard 
                    key={report.id} 
                    report={report}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
