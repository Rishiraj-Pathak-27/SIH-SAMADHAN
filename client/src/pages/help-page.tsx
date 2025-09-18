import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Phone, Mail, Video, FileText } from "lucide-react";
import { Link } from "wouter";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
            Get help with using CivicReport and reporting civic issues
          </p>
        </div>

        {/* Quick Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                New to CivicReport? Learn how to submit your first report in just a few steps.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Create an account or sign in</li>
                <li>Click "Report New Issue"</li>
                <li>Fill out the form with issue details</li>
                <li>Add photos and location</li>
                <li>Submit and track your report</li>
              </ol>
              <Link href="/report">
                <Button className="mt-4" size="sm">
                  Start Reporting
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Watch step-by-step video guides to learn how to use all features.
              </p>
              <div className="space-y-2 text-sm">
                <div>• How to submit a report</div>
                <div>• Using GPS location features</div>
                <div>• Tracking report status</div>
                <div>• Downloading report PDFs</div>
              </div>
              <Button variant="outline" className="mt-4" size="sm">
                Watch Tutorials
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help via email within 24 hours
                </p>
                <Button variant="outline" size="sm">
                  Email Us
                </Button>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Monday-Friday, 9AM-5PM
                </p>
                <Button variant="outline" size="sm">
                  (555) 123-4567
                </Button>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Chat with our support team
                </p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Common Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium">Reporting Issues</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• How to choose the right category</li>
                  <li>• Adding accurate location data</li>
                  <li>• Taking effective photos</li>
                  <li>• Writing clear descriptions</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Managing Reports</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tracking report status</li>
                  <li>• Downloading PDF copies</li>
                  <li>• Understanding status updates</li>
                  <li>• Following up on reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}