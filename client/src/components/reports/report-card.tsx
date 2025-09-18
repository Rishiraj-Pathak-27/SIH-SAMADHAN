import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { Clock, MapPin, User, Image as ImageIcon, Download } from "lucide-react";
import { Report } from "@shared/schema";
import { generateReportPDF } from "@/lib/pdf-utils";

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const formatDate = (date: Date | string) => {
    const reportDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - reportDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      return diffInHours === 0 ? "Just now" : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return reportDate.toLocaleDateString();
    }
  };

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    generateReportPDF(report);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:bg-accent/50' : ''}`}
      onClick={onClick}
      data-testid={`report-card-${report.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Media Thumbnail */}
          <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
            {report.mediaUrls && report.mediaUrls.length > 0 ? (
              <img 
                src={report.mediaUrls[0]} 
                alt="Report media"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"><svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>

          {/* Report Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm truncate" data-testid={`text-title-${report.id}`}>
                {report.title}
              </h4>
              <StatusBadge status={report.status} />
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {report.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground space-x-4">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span data-testid={`text-date-${report.id}`}>
                    {formatDate(report.createdAt || new Date())}
                  </span>
                </div>
                
                {report.address && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate" data-testid={`text-address-${report.id}`}>
                      {report.address}
                    </span>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadPDF}
                className="h-6 w-6 p-0 hover:bg-primary/10"
                data-testid={`button-download-pdf-${report.id}`}
                title="Download PDF"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
