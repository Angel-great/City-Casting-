# City Casting Corp - Operating System

Complete business operating system for City Casting Corp, a jewelry and metal casting company. This full-stack web application handles order management, customer portals, employee portals, precious metal pricing, and accounting.

## Features

### Customer Portal
- **Dashboard** - Overview of orders, outstanding balance, mold inventory, and metal prices
- **Place Orders** - 7 order types: Straight Cast, Make Mold, Mold Cast, File Cast, CAD Order, CAD Edit, Finishing
- **Order Tracking** - Real-time progress updates through each department
- **Mold Inventory** - View all molds with style numbers, photos, condition, and material
- **Metal Pricing** - Live precious metal prices (Gold 5K-24K, Silver, Platinum, Palladium)
- **Statements** - View invoices, outstanding balance, payment terms, credit limit
- **Profile** - Account information with customer code and PIN

### Employee Portal
- **Account Manager Portal** - Place orders for customers, manage pricing & payment terms
- **Department Views** - Casting, CAD, Wax, Mold, Polishing, Accounting, Admin
- **Customer Management** - Edit payment terms, credit limits, view customer history
- **Order Management** - Update order status, route between departments
- **Executive Override** - Override capabilities for executive accounts

### Order System
Each order type opens with specific service options:
- **Straight Cast** - Photo upload, metal selection (30+ metals), wax sizing, polishing services, notes
- **Make Mold** - Mold type (Silicone/Rubber/Blue), cast options, quantity, polishing
- **Mold Cast** - Select from mold inventory, multi-metal casting, per-style options
- **File Cast** - STL/3DM file upload, CAD orders with PDF/image specs, print type selection
- **CAD Edit** - Edit instructions, optional casting after edit
- **Finishing** - Polishing services only (High Polish, Satin/Matte, Oxidized, Plating, etc.)
- **Quote Request** - Request pricing quotes

### Printable Order Sheets
- A4 format with company header, customer name, order number with barcode
- Table format: Image | Style | Metal | Quantity | Size | Polishing | Notes
- Vendor Copy and Customer Copy
- Auto-adjusts to multiple pages

### Metals Available
SP S/S, Secreto, Silver, White Brass, Brass, Osby, White Osby, Bronze, Thai Gold, Stainless Steel, Aluminum, 10K-24K (Yellow/White/Rose/Green), Platinum, Palladium, 18K Palladium, Copper

### Polishing Services
High Polish, Satin/Matte, Oxidized, Pre-polish, Polish, Sprue & Tumble, Sizing, Stone Set, Sandblasting, Solder, Assemble, Goldplate (10K-24K), Rhodium Plate, Palladium Plate, Silver Plate, Metal Sizing

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Database**: SQLite via Prisma ORM with LibSQL adapter
- **Styling**: Tailwind CSS 4
- **Auth**: JWT-based (jose library)
- **State Management**: Zustand
- **File Upload**: react-dropzone
- **PDF**: Print-friendly CSS with browser print

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (development)
# Start the dev server first, then visit:
# POST http://localhost:3000/api/seed

# Start development server
npm run dev
```

### Demo Accounts

After seeding, use these accounts:

| Role | Email | Password | Code | PIN |
|------|-------|----------|------|-----|
| Executive | admin@citycastingcorp.com | admin123 | CC-ADMIN1 | 0000 |
| Account Manager | manager@citycastingcorp.com | manager123 | CC-MGR001 | 1111 |
| Customer | customer@example.com | customer123 | CC-JS0001 | 1234 |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (auth, orders, molds, metals, customers, invoices)
│   ├── dashboard/     # Customer portal pages
│   ├── employee/      # Employee portal pages
│   ├── login/         # Login page
│   └── signup/        # Signup page
├── components/
│   ├── layout/        # Sidebar, AuthProvider, DashboardLayout
│   ├── orders/        # Order forms, selectors, detail views
│   └── ui/            # Button, Input, Select, Card, Badge, Modal
├── lib/
│   ├── auth.ts        # JWT auth, token management, code/PIN generation
│   ├── constants.ts   # Metals, services, order types, statuses
│   ├── prisma.ts      # Database client
│   └── store.ts       # Zustand auth store
└── generated/prisma/  # Auto-generated Prisma client
```
