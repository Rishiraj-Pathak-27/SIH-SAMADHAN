import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-primary">CivicReport</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Empowering citizens to report civic issues and help improve their communities.
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                Made for better communities
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/report" className="text-muted-foreground hover:text-primary transition-colors">
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link href="/my-reports" className="text-muted-foreground hover:text-primary transition-colors">
                    My Reports
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help & Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium mb-4">Issue Types</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Potholes & Road Issues</li>
                <li>Garbage & Waste</li>
                <li>Street Light Problems</li>
                <li>Other Municipal Issues</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-medium mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  support@civicreport.com
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  (555) 123-4567
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Municipal Services Office
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>&copy; 2024 CivicReport. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}