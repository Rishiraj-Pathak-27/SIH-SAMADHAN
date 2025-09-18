import { useEffect, useRef } from "react";
import { Report } from "@shared/schema";

interface MapViewProps {
  reports: Report[];
}

export function MapView({ reports }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Leaflet map
    const initMap = async () => {
      if (!mapRef.current) return;

      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default;
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Clear existing map
      mapRef.current.innerHTML = '';

      // Create map centered on city center (using a default location)
      const map = L.map(mapRef.current).setView([40.7128, -74.0060], 12); // NYC coordinates as default

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for reports with location data
      const reportsWithLocation = reports.filter(r => r.latitude && r.longitude);
      
      if (reportsWithLocation.length > 0) {
        const group = L.featureGroup();
        
        reportsWithLocation.forEach((report) => {
          if (report.latitude && report.longitude) {
            // Choose marker color based on status
            let markerColor = '#FCD34D'; // amber for pending
            if (report.status === 'in_progress') markerColor = '#60A5FA'; // blue
            if (report.status === 'resolved') markerColor = '#34D399'; // green

            // Create custom icon
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            const marker = L.marker([report.latitude, report.longitude], { icon: customIcon })
              .bindPopup(`
                <div class="p-2">
                  <h4 class="font-medium text-sm mb-1">${report.title}</h4>
                  <p class="text-xs text-gray-600 mb-2">${report.description.substring(0, 100)}...</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs px-2 py-1 rounded-full ${
                      report.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }">${report.status.replace('_', ' ')}</span>
                    <span class="text-xs text-gray-500">${new Date(report.createdAt || '').toLocaleDateString()}</span>
                  </div>
                </div>
              `);
            
            group.addLayer(marker);
          }
        });

        group.addTo(map);
        
        // Fit map to show all markers
        if (group.getLayers().length > 0) {
          map.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
      }
    };

    initMap();
  }, [reports]);

  return (
    <div className="relative">
      {/* Add Leaflet CSS */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-border"
        data-testid="map-container"
      />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur border border-border rounded-lg shadow-sm p-3">
        <h4 className="font-semibold text-sm mb-2">Report Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Resolved</span>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur border border-border rounded-lg shadow-sm p-3">
        <h4 className="font-semibold text-sm mb-2">Active Reports</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-amber-600">
              {reports.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {reports.filter(r => r.status === 'in_progress').length}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
