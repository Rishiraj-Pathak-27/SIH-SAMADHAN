import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - email notifications will be disabled");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`Email would be sent to ${params.to}: ${params.subject}`);
    return true; // Return true for development when no API key is set
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from || 'noreply@civicreport.com',
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendReportStatusNotification(
  userEmail: string,
  reportTitle: string,
  oldStatus: string,
  newStatus: string
): Promise<boolean> {
  const statusMessages = {
    pending: "has been received and is being reviewed",
    in_progress: "is now being worked on by our team",
    resolved: "has been resolved"
  };

  const subject = `Report Update: ${reportTitle}`;
  const message = `Your report "${reportTitle}" ${statusMessages[newStatus as keyof typeof statusMessages] || `status has been updated to ${newStatus}`}.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #F59E0B;">Report Status Update</h2>
      <p>Hello,</p>
      <p>${message}</p>
      <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>Report:</strong> ${reportTitle}<br>
        <strong>Status:</strong> <span style="text-transform: capitalize;">${newStatus.replace('_', ' ')}</span>
      </div>
      <p>Thank you for helping improve our community!</p>
      <p>Best regards,<br>CivicReport Team</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    from: 'noreply@civicreport.com',
    subject,
    text: message,
    html
  });
}
