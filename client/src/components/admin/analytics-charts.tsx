import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp } from "lucide-react";

export function AnalyticsCharts() {
  const { data: categoryStats = [] } = useQuery<{ category: string; count: number }[]>({
    queryKey: ["/api/analytics/categories"],
  });

  // Mock data for response times (in a real app, this would come from the API)
  const responseTimeData = [
    { department: "Public Works", time: "2.3 days", color: "bg-green-500" },
    { department: "Utilities", time: "1.8 days", color: "bg-blue-500" },
    { department: "Parks Department", time: "3.1 days", color: "bg-amber-500" },
    { department: "Traffic Department", time: "1.5 days", color: "bg-purple-500" },
  ];

  // Mock monthly trends data
  const monthlyData = [
    { month: "Jan", count: 124 },
    { month: "Feb", count: 98 },
    { month: "Mar", count: 167 },
    { month: "Apr", count: 142 },
    { month: "May", count: 189 },
    { month: "Jun", count: 203 },
    { month: "Jul", count: 174 },
  ];

  const maxCount = Math.max(...monthlyData.map(d => d.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Reports by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Reports by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((item, index) => {
              const maxValue = Math.max(...categoryStats.map(c => c.count));
              const percentage = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center space-x-2 flex-1 max-w-[200px]">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[2rem] text-right" data-testid={`category-count-${item.category}`}>
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
            {categoryStats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No category data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Average Response Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Average Response Time by Department</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responseTimeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="text-sm font-medium">{item.department}</span>
                </div>
                <span className="text-sm font-medium" data-testid={`response-time-${item.department}`}>
                  {item.time}
                </span>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Average</span>
                <span className="text-lg font-bold text-primary" data-testid="overall-response-time">
                  2.2 days
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Report Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4 text-center text-sm">
            {monthlyData.map((item, index) => {
              const height = (item.count / maxCount) * 100;
              
              return (
                <div key={index}>
                  <div className="text-xs text-muted-foreground mb-2">{item.month}</div>
                  <div className="h-20 flex items-end justify-center">
                    <div 
                      className="w-6 bg-primary rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                      data-testid={`chart-bar-${item.month}`}
                    />
                  </div>
                  <div className="text-xs mt-1" data-testid={`chart-value-${item.month}`}>
                    {item.count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="text-green-600 font-medium">↗ +15%</span> increase compared to last year
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
