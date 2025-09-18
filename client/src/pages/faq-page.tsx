import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I submit a report?",
      answer: "Click on 'Report New Issue' on the homepage, fill out the form with your issue details, add photos if needed, and include location information. Your report will be submitted to the appropriate municipal department."
    },
    {
      question: "What types of issues can I report?",
      answer: "You can report various civic issues including potholes and road problems, garbage collection issues, broken street lights, water leaks, graffiti, damaged public property, and other municipal concerns."
    },
    {
      question: "How long does it take to resolve an issue?",
      answer: "Resolution time varies depending on the type and severity of the issue. Simple issues like broken street lights may be resolved within 3-5 business days, while road repairs might take 2-4 weeks. You'll receive email notifications about status updates."
    },
    {
      question: "Can I submit reports anonymously?",
      answer: "Currently, you need to create an account to submit reports. This helps us track progress and send you updates. Your personal information is kept private and only used for communication about your reports."
    },
    {
      question: "How do I track my reports?",
      answer: "You can view all your submitted reports by clicking 'My Reports' in the navigation menu. Each report shows its current status (pending, in progress, or resolved) and any updates from municipal staff."
    },
    {
      question: "Can I download a copy of my report?",
      answer: "Yes! Each report card has a download button that allows you to generate a PDF copy of your report for your records. The PDF includes all details, photos, and current status."
    },
    {
      question: "What should I include in my report?",
      answer: "Provide a clear title, detailed description of the issue, exact location or GPS coordinates, and photos if possible. The more information you provide, the faster and more effectively the issue can be addressed."
    },
    {
      question: "Why do I need to provide location information?",
      answer: "Accurate location information helps municipal crews find and address the issue quickly. You can use GPS location or manually enter an address. This ensures resources are deployed to the correct location."
    },
    {
      question: "Can I submit multiple photos or videos?",
      answer: "Yes, you can upload up to 5 photos or videos per report, with each file being up to 10MB. Visual evidence helps municipal staff better understand the issue and prioritize their response."
    },
    {
      question: "How will I know when my issue is resolved?",
      answer: "You'll receive email notifications when your report status changes. You can also check the status anytime by visiting 'My Reports' section of your account."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about reporting civic issues
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Contact our support team for additional help
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Email: support@civicreport.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}