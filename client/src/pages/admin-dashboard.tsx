import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapView } from "@/components/admin/map-view";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { StatusBadge } from "@/components/reports/status-badge";
import { TrendingUp, Clock, CheckCircle, AlertCircle, User, MapPin, Calendar } from "lucide-react";
import { Report, User as UserType } from "@shared/schema";
import { Redirect } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    return <Redirect to="/" />;
  }

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
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/reports/${reportId}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "Status updated",
        description: "Report status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (reportId: string, newStatus: string) => {
    updateStatusMutation.mutate({ reportId, status: newStatus });
  };

  const formatDate = (date: Date | string) => {
    const reportDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - reportDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return reportDate.toLocaleDateString();
  };

  const recentReports = reports
    .filter(r => r.status !== 'resolved')
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 10);

  if (reportsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage civic reports and monitor municipal response</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="admin-stat-total">
                {stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600" data-testid="admin-stat-pending">
                {stats?.pending || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="admin-stat-progress">
                {stats?.in_progress || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="admin-stat-resolved">
                {stats?.resolved || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending reports</p>
                </div>
              ) : (
                recentReports.map((report) => (
                  <div key={report.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate" data-testid={`admin-report-title-${report.id}`}>
                          {report.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {report.description}
                        </p>
                      </div>
                      <StatusBadge status={report.status} />
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(report.createdAt || new Date())}</span>
                      </div>
                      {report.address && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{report.address}</span>
                        </div>
                      )}
                    </div>

                    {report.status !== 'resolved' && (
                      <div className="flex gap-2">
                        <Select onValueChange={(value) => handleStatusUpdate(report.id, value)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Map View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Reports Map</CardTitle>
            </CardHeader>
            <CardContent>
              <MapView reports={reports} />
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="mt-8">
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
}
