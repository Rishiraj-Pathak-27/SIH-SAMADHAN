import { 
  users, 
  reports, 
  categories, 
  departments, 
  notifications,
  type User, 
  type InsertUser,
  type Report,
  type InsertReport,
  type Category,
  type InsertCategory,
  type Department,
  type InsertDepartment,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
  getReportsByUser(userId: string): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  updateReportStatus(id: string, status: string, assignedToId?: string): Promise<Report | undefined>;
  getReportsByDepartment(departmentId: string): Promise<Report[]>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Department operations
  getAllDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Analytics
  getReportStats(): Promise<{
    pending: number;
    in_progress: number;
    resolved: number;
    total: number;
  }>;
  
  getReportsByCategory(): Promise<{ category: string; count: number }[]>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values({
        ...insertReport,
        updatedAt: new Date(),
      })
      .returning();
    return report;
  }

  async getReport(id: string): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.createdAt));
  }

  async getAllReports(): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .orderBy(desc(reports.createdAt));
  }

  async updateReportStatus(id: string, status: string, assignedToId?: string): Promise<Report | undefined> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    
    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId;
    }

    const [report] = await db
      .update(reports)
      .set(updateData)
      .where(eq(reports.id, id))
      .returning();
    return report || undefined;
  }

  async getReportsByDepartment(departmentId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.departmentId, departmentId))
      .orderBy(desc(reports.createdAt));
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getAllDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const [department] = await db
      .insert(departments)
      .values(insertDepartment)
      .returning();
    return department;
  }

  async getReportStats(): Promise<{
    pending: number;
    in_progress: number;
    resolved: number;
    total: number;
  }> {
    const result = await db
      .select({
        status: reports.status,
        count: count(),
      })
      .from(reports)
      .groupBy(reports.status);

    const stats = {
      pending: 0,
      in_progress: 0,
      resolved: 0,
      total: 0,
    };

    result.forEach(({ status, count: statusCount }) => {
      if (status in stats) {
        stats[status as keyof typeof stats] = statusCount;
      }
      stats.total += statusCount;
    });

    return stats;
  }

  async getReportsByCategory(): Promise<{ category: string; count: number }[]> {
    const result = await db
      .select({
        categoryId: reports.categoryId,
        count: count(),
      })
      .from(reports)
      .groupBy(reports.categoryId);

    // Get category names
    const categoriesData = await this.getAllCategories();
    const categoryMap = new Map(categoriesData.map(c => [c.id, c.name]));

    return result.map(({ categoryId, count: reportCount }) => ({
      category: categoryMap.get(categoryId || '') || 'Uncategorized',
      count: reportCount,
    }));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
