# Overview

CivicReport is a full-stack web application that enables citizens to report municipal issues and allows administrators to track and manage these reports. The application features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM. Citizens can submit reports with media attachments and location data, while administrators can view reports on a dashboard with analytics and map visualization.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Routing**: Wouter for client-side routing with protected routes for authenticated users
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system and Tailwind CSS for styling
- **Forms**: React Hook Form with Zod validation schemas
- **Authentication**: Context-based auth provider with session management

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **File Upload**: Multer middleware for handling media attachments (images/videos)
- **API Design**: RESTful endpoints with proper error handling and request logging
- **Email Service**: SendGrid integration for status change notifications

## Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Design**: 
  - Users table with role-based access (citizen, admin, staff)
  - Reports table with status tracking, location data, and media URLs
  - Categories and Departments for report organization
  - Notifications table for system alerts
- **Migrations**: Drizzle Kit for schema migrations and database management

## Security and Access Control
- **Authentication**: Session-based authentication with secure password hashing
- **Authorization**: Role-based access control (RBAC) with middleware protection
- **File Security**: Authenticated file serving with access control checks
- **Data Validation**: Zod schemas for input validation on both client and server

## Development and Deployment
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Development**: Hot reload with Vite dev server and TypeScript checking
- **Environment**: Replit-optimized with cartographer and dev banner plugins
- **Static Assets**: Express static serving for uploaded files and built frontend

# External Dependencies

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **File Storage**: Local filesystem storage for uploaded media files

## Email Services
- **SendGrid**: Transactional email service for report status notifications and system communications

## Maps and Location
- **Leaflet**: Interactive maps for report location visualization and selection
- **OpenStreetMap**: Map tile provider for geographic data

## UI and Styling
- **Radix UI**: Headless component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Google Fonts**: Web fonts including Inter, Lora, Geist, and Space Grotesk

## Development Tools
- **Replit Platform**: Development environment with integrated tooling
- **TypeScript**: Static type checking across the entire application
- **ESLint/Prettier**: Code formatting and linting (implied by project structure)