import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, MapPin, Upload, Loader2, X, Video } from "lucide-react";
import { Category } from "@shared/schema";

export default function ReportSubmissionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/reports", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit report");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Report submitted successfully!",
        description: "Your report has been submitted and is being reviewed.",
      });
      navigate("/my-reports");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter the address manually.",
        variant: "destructive",
      });
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitude, longitude }));

        // Try to get address from coordinates
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.VITE_OPENCAGE_API_KEY || 'demo'}`
          );
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            setFormData(prev => ({ 
              ...prev, 
              address: data.results[0].formatted 
            }));
          }
        } catch (error) {
          console.error("Error getting address:", error);
        }

        setLocationLoading(false);
        toast({
          title: "Location captured",
          description: "GPS coordinates have been added to your report.",
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationLoading(false);
        toast({
          title: "Location access denied",
          description: "Please enable location access or enter the address manually.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    if (formData.categoryId) submitData.append("categoryId", formData.categoryId);
    if (formData.address) submitData.append("address", formData.address);
    if (formData.latitude) submitData.append("latitude", formData.latitude.toString());
    if (formData.longitude) submitData.append("longitude", formData.longitude.toString());

    selectedFiles.forEach((file) => {
      submitData.append("media", file);
    });

    submitMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Report Civic Issue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  data-testid="input-title"
                  type="text"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo/Video Upload */}
              <div>
                <Label>Photos & Videos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium mb-2">Add photos or videos</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help us understand the issue better (Max 5 files, 10MB each)
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex gap-2 justify-center">
                    <Button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-upload-media"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Video className="h-8 w-8 text-muted-foreground" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                              data-testid={`button-remove-file-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label>Location</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getLocation}
                      disabled={locationLoading}
                      data-testid="button-get-location"
                    >
                      {locationLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      {locationLoading ? "Getting Location..." : "Use Current Location"}
                    </Button>
                    
                    {formData.latitude && formData.longitude && (
                      <div className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        GPS Captured
                      </div>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Or enter address manually"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    data-testid="input-address"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  data-testid="textarea-description"
                  placeholder="Describe the issue in detail. Include any relevant information that would help municipal staff understand and address the problem."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitMutation.isPending}
                data-testid="button-submit-report"
              >
                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
