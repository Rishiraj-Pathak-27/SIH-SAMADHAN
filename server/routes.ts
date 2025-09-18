import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { insertReportSchema, insertCategorySchema, insertDepartmentSchema } from "@shared/schema";
import { sendReportStatusNotification } from "./services/emailService";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', requireAuth, (req, res, next) => {
    // Add basic security check - users can only access files from their own reports
    // In production, implement proper access control
    next();
  }, express.static(uploadDir));

  // Reports endpoints
  app.post("/api/reports", requireAuth, upload.array('media', 5), async (req, res) => {
    try {
      const reportData = insertReportSchema.parse({
        ...req.body,
        userId: req.user!.id,
        mediaUrls: req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [],
      });

      // Auto-assign department based on category
      if (reportData.categoryId) {
        const categories = await storage.getAllCategories();
        const category = categories.find(c => c.id === reportData.categoryId);
        if (category && category.departmentId) {
          reportData.departmentId = category.departmentId;
        }
      }

      const report = await storage.createReport(reportData);

      // Create notification for user
      await storage.createNotification({
        userId: req.user!.id,
        reportId: report.id,
        type: 'status_update',
        title: 'Report Submitted',
        message: `Your report "${report.title}" has been submitted and is being reviewed.`,
      });

      // Send email notification
      if (req.user!.email) {
        await sendReportStatusNotification(
          req.user!.email,
          report.title,
          '',
          'pending'
        );
      }

      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid report data' });
    }
  });

  app.get("/api/reports", requireAuth, async (req, res) => {
    try {
      let reports;
      if (req.user!.role === 'admin') {
        reports = await storage.getAllReports();
      } else {
        reports = await storage.getReportsByUser(req.user!.id);
      }
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ message: 'Failed to fetch reports' });
    }
  });

  app.get("/api/reports/:id", requireAuth, async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      // Check if user owns the report or is admin
      if (report.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ message: 'Failed to fetch report' });
    }
  });

  app.patch("/api/reports/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status, assignedToId } = req.body;
      const reportId = req.params.id;
      
      const oldReport = await storage.getReport(reportId);
      if (!oldReport) {
        return res.status(404).json({ message: 'Report not found' });
      }

      const report = await storage.updateReportStatus(reportId, status, assignedToId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      // Create notification for the report owner
      await storage.createNotification({
        userId: report.userId,
        reportId: report.id,
        type: 'status_update',
        title: 'Report Status Updated',
        message: `Your report "${report.title}" status has been updated to ${status.replace('_', ' ')}.`,
      });

      // Send email notification
      const user = await storage.getUser(report.userId);
      if (user && user.email) {
        await sendReportStatusNotification(
          user.email,
          report.title,
          oldReport.status,
          status
        );
      }

      res.json(report);
    } catch (error) {
      console.error('Error updating report status:', error);
      res.status(500).json({ message: 'Failed to update report status' });
    }
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid category data' });
    }
  });

  // Departments endpoints
  app.get("/api/departments", requireAdmin, async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ message: 'Failed to fetch departments' });
    }
  });

  app.post("/api/departments", requireAdmin, async (req, res) => {
    try {
      const departmentData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid department data' });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getReportStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  app.get("/api/analytics/categories", requireAdmin, async (req, res) => {
    try {
      const categoryStats = await storage.getReportsByCategory();
      res.json(categoryStats);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      res.status(500).json({ message: 'Failed to fetch category statistics' });
    }
  });

  // Notifications endpoints
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user!.id);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
