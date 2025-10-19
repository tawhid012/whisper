# Whispr - Secret Message Sharing Application

## Overview

Whispr is a privacy-focused web application for sharing ephemeral secret messages. Messages are designed to self-destruct after being viewed once, emphasizing security and temporary communication. The application features a minimal dark design inspired by privacy-focused applications like Signal and ProtonMail, prioritizing trust through simplicity and a distraction-free interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (no React Router dependency)
- TailwindCSS for utility-first styling with custom design tokens

**UI Component System:**
- shadcn/ui component library (New York style variant) providing pre-built, accessible React components
- Radix UI primitives for accessible, unstyled component foundations
- Custom design system with dark mode as primary theme, using HSL color values for consistent theming
- Inter font family from Google Fonts for modern typography

**State Management & Data Fetching:**
- TanStack Query (React Query) for server state management, caching, and API interactions
- Custom query client configuration with infinite stale time and disabled refetching to optimize for ephemeral data patterns
- React Hook Form with Zod resolvers for form validation (hookform/resolvers integration)

**Design Philosophy:**
- Progressive disclosure pattern: show only necessary information at each step
- Trust through simplicity: clean interface reinforces security messaging
- Instant feedback: clear visual confirmation for all user actions
- Dark mode first with carefully chosen accent colors (vibrant blue for trust/security)

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server framework
- TypeScript throughout for type safety
- ESM module system (type: "module" in package.json)

**API Design:**
- RESTful endpoints for message operations:
  - `POST /api/messages` - Create new secret message
  - `GET /msg/:id` - Retrieve and immediately delete message (one-time view)
- Simple, stateless API design aligned with ephemeral message requirements

**Data Storage Strategy:**
- Currently using in-memory storage (MemStorage class) for development
- Abstract storage interface (IStorage) allowing easy swap to persistent storage
- Messages stored with minimal schema: `id` and `content` fields only
- Automatic message deletion after first retrieval enforcing one-time view requirement

**Validation:**
- Shared Zod schemas between client and server for consistent validation
- Message content validation: 1-5000 characters
- Type-safe data transfer using shared TypeScript types

### Data Architecture

**Schema Design:**
- Drizzle ORM configured for PostgreSQL (via @neondatabase/serverless)
- Schema defined in shared folder for client-server type sharing
- Currently minimal message schema, easily extensible for future features
- Drizzle Kit for database migrations management

**Database Strategy:**
- PostgreSQL as target database (Neon serverless platform support)
- Configuration expects DATABASE_URL environment variable
- Migration files stored in `/migrations` directory
- Note: Current implementation uses in-memory storage; PostgreSQL integration prepared but not active

### Build & Deployment

**Development:**
- Concurrent client (Vite) and server (tsx) processes
- Hot module replacement for rapid development
- Runtime error overlay via Replit plugin
- Cartographer and dev banner plugins for Replit environment

**Production:**
- Vite builds frontend to `dist/public`
- esbuild bundles backend to `dist/index.js` with external packages
- Static file serving through Express
- Single compiled artifact for deployment

**Type Safety:**
- Strict TypeScript configuration across entire codebase
- Path aliases for clean imports: `@/` for client, `@shared/` for shared code
- Incremental compilation with build info caching

## External Dependencies

### Database & ORM
- **Neon Serverless PostgreSQL** (@neondatabase/serverless): Serverless PostgreSQL database platform
- **Drizzle ORM**: Type-safe ORM for database operations with PostgreSQL dialect
- **Drizzle Zod**: Integration between Drizzle and Zod for schema validation

### UI & Styling
- **Radix UI**: Complete suite of accessible, unstyled React components (accordion, dialog, dropdown, popover, etc.)
- **TailwindCSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Utility for creating type-safe component variants
- **clsx & tailwind-merge**: Conditional className utilities
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command menu component

### Forms & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for runtime type safety
- **@hookform/resolvers**: Adapters for various validation libraries with React Hook Form

### Data Fetching & State
- **TanStack React Query**: Async state management, caching, and data synchronization
- **date-fns**: Modern date utility library for timestamp handling

### Development Tools
- **Vite**: Next-generation frontend build tool with plugin ecosystem
- **tsx**: TypeScript execution engine for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development experience enhancements (error modal, cartographer, dev banner)

### Sessions (Prepared but unused)
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not currently utilized)

### Carousel Components
- **embla-carousel-react**: Lightweight carousel library with React bindings

### Routing
- **wouter**: Minimalist routing library (~1.5KB) as React Router alternative