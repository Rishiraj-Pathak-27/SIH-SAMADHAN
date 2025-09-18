import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportCard } from "@/components/reports/report-card";
import { StatusBadge } from "@/components/reports/status-badge";
import { Link } from "wouter";
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Report } from "@shared/schema";

export default function MyReportsPage() {
  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const userReports = reports;
  
  const stats = {
    pending: userReports.filter(r => r.status === 'pending').length,
    in_progress: userReports.filter(r => r.status === 'in_progress').length,
    resolved: userReports.filter(r => r.status === 'resolved').length,
    total: userReports.length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Reports</h1>
            <p className="text-muted-foreground">Track the status of your submitted civic issues</p>
          </div>
          <Link href="/report">
            <Button data-testid="button-new-report">
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600" data-testid="stat-pending">
                  {stats.pending}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600" data-testid="stat-progress">
                  {stats.in_progress}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600" data-testid="stat-resolved">
                  {stats.resolved}
                </div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold" data-testid="stat-total">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {userReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't submitted any reports yet. Start by reporting a civic issue in your area.
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
                {userReports.map((report) => (
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
    </div>
  );
}
