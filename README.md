<div align="center">

# 🔗 Mankray

### Enterprise SaaS Procurement & Vendor Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://mankray-app.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-blue?style=for-the-badge&logo=render)](https://task-1mu1.onrender.com/api/status)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](LICENSE)

*A full-stack, role-based procurement intelligence platform that streamlines software purchase requests, vendor onboarding, contract lifecycle management, third-party integrations, and SaaS analytics — all in one unified workspace.*

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Live Deployment](#-live-deployment)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control-rbac)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#-deployment)
- [File Upload System](#-file-upload-system)
- [Known Issues & Roadmap](#-known-issues--roadmap)
- [Contributing](#-contributing)

---

## 🌐 Overview

**Mankray** is a modern, enterprise-grade SaaS procurement management platform built for organizations that need visibility, governance, and efficiency across their software spend. It enables employees to raise purchase requests, managers to review and approve them, and admins to manage the full vendor-contract-integration lifecycle with analytics and Shadow IT detection.

The platform is designed around a **multi-role permission model** where:
- **Employees / Requesters** submit software purchase requests.
- **Approvers / Admins** review, approve, or reject requests and manage the entire vendor ecosystem.
- **Super-Admins** have access to the full dashboard and system-level controls.

---

## 🚀 Live Deployment

| Service | URL | Platform |
|---------|-----|----------|
| **Frontend** | [https://mankray-app.vercel.app/](https://mankray-app.vercel.app/) | Vercel |
| **Backend API** | [https://task-1mu1.onrender.com](https://task-1mu1.onrender.com) | Render |
| **API Status Check** | [/api/status](https://task-1mu1.onrender.com/api/status) | Render |

> **Note:** The backend is hosted on Render's free tier. It may take 30–60 seconds to "wake up" on first request after inactivity (cold start).

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication (token stored in `localStorage`)
- Password hashing with **bcrypt** (10 salt rounds)
- Role-based route protection on both the frontend (`ProtectedRoute`) and backend (RBAC middleware)
- Profile management with avatar upload support

### 📋 Purchase Request Management
- Multi-step request form with support for existing or **proposed new vendors**
- File attachment upload (PDF, DOCX, XLSX, CSV, PNG, JPG — max 15 MB)
- Advanced filtering by department, status, and cost range
- Full request lifecycle: `Pending` → `In Review` → `Clarification Needed` → `Approved` / `Rejected` / `Withdrawn`
- Two-way communication: reviewer notes ↔ requester replies

### 🏢 Vendor Management
- Complete vendor onboarding with billing address, company address, and primary contact sub-schemas
- Compliance status tracking (`Compliant`, `Pending`, `Non-Compliant`)
- Document upload per vendor
- Vendor details page showing all linked contracts

### 📄 Contract Lifecycle Management
- Create, view, and renew contracts linked to vendors
- Track `start_date`, `end_date`, `contractValue`, and `renewalStatus`
- Support for payment frequency and contract-specific contact persons
- Upcoming renewals dashboard view
- Contract document upload and storage

### 📊 Analytics & Shadow IT Detection
- Application license usage analytics (active users, high/low engagement)
- Engagement breakdown: No Usage / Low / Medium / High
- Shadow IT detection (unapproved application identification)
- AI-driven recommendations panel (consolidate tools, reclaim licenses)
- Aggregated metrics: total applications, total licenses, utilization rates

### 🔌 Third-Party Integrations
- Integration hub supporting ERP systems (Coupa, NetSuite), Accounting (QuickBooks, Sage Intacct), HRMS (BambooHR, Workday, ADP), CRM (Salesforce), and SSO (Okta)
- Connect, configure, and track sync frequency per integration
- Seeded integration data via `/api/integrations/seed`

### 👥 Requestor Management
- Admins can add, view, and remove employee/requester accounts
- Default password provisioning for new requestors

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vercel)                         │
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────────────┐ │
│  │  React   │   │ React Router │   │  Tailwind CSS + Lucide  │ │
│  │  19 SPA  │──▶│  v7 (Client  │──▶│  Icons + react-icons   │ │
│  └──────────┘   │   Routing)   │   └─────────────────────────┘ │
│                 └──────────────┘                                │
│         │  Axios HTTP (x-auth-token header)                     │
└─────────┼───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Render)                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Express.js v5                        │    │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────────────┐  │    │
│  │  │   CORS   │  │  JWT Auth │  │  Role-Guard         │  │    │
│  │  │Middleware│  │Middleware │  │  Middleware(role.js) │  │    │
│  │  └──────────┘  └───────────┘  └─────────────────────┘  │    │
│  │                                                         │    │
│  │  API Routes: auth | requests | vendors | contracts      │    │
│  │             analytics | integrations | dashboard        │    │
│  │             requestors                                  │    │
│  │                                                         │    │
│  │  Multer File Upload → /uploads/ (Static Served)         │    │
│  └────────────────────────────────────────────────────────┘    │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                         │
│  Users | Requests | Vendors | Contracts | Integrations          │
│  Applications (Analytics) | Recommendations                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI Library |
| **React Router DOM** | 7.x | Client-side routing |
| **Vite** | 7.x | Build tool & dev server |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Axios** | 1.x | HTTP client |
| **Lucide React** | 0.548.x | Icon system |
| **React Icons** | 5.x | Extended icons |
| **country-state-city** | 3.x | Geographic address selectors |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | Runtime |
| **Express.js** | 5.x | Web framework |
| **Mongoose** | 8.x | MongoDB ODM |
| **bcrypt** | 6.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT auth tokens |
| **Multer** | 2.x | File upload middleware |
| **CORS** | 2.x | Cross-origin resource sharing |
| **dotenv** | 16.x | Environment variable management |
| **nodemon** | 3.x | Dev auto-reload |

### Database & Infrastructure
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Render** | Backend API hosting |
| **Vercel** | Frontend static hosting |

---

## 📁 Project Structure

```
Task/                               ← Monorepo Root
├── client/                         ← React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── LoginScreen.jsx         ← Public: Authentication
│   │   │   ├── SignupScreen.jsx        ← Public: Registration
│   │   │   ├── MainLayout.jsx          ← Protected: Shell (Sidebar + Header + Outlet)
│   │   │   ├── Dashboard.jsx           ← Super-Admin: KPI overview
│   │   │   ├── ApprovalsPage.jsx       ← Admin/Approver: Pending approvals queue
│   │   │   ├── RequestsPage.jsx        ← All roles: Request list with filters
│   │   │   ├── RequestDetailPage.jsx   ← All roles: Single request view
│   │   │   ├── RequestForm.jsx         ← Requester: Multi-step request form
│   │   │   ├── VendorsPage.jsx         ← Admin: Vendor directory
│   │   │   ├── VendorDetailsPage.jsx   ← Admin: Single vendor + linked contracts
│   │   │   ├── AddVendorForm.jsx       ← Admin: New vendor onboarding form
│   │   │   ├── ContractsPage.jsx       ← Admin: Contract list
│   │   │   ├── ContractDetailsPage.jsx ← Admin: Single contract view
│   │   │   ├── UploadContractForm.jsx  ← Admin: Upload new contract
│   │   │   ├── RenewContractForm.jsx   ← Admin: Renew existing contract
│   │   │   ├── UpcomingRenewalsPage.jsx← Admin: Contracts expiring soon
│   │   │   ├── IntegrationsPage.jsx    ← Admin: Integration hub
│   │   │   ├── ConfigureIntegrationForm.jsx  ← Admin: Configure integration
│   │   │   ├── ConnectIntegrationForm.jsx    ← Admin: Connect integration
│   │   │   ├── AnalyticsPage.jsx       ← Admin: SaaS usage analytics
│   │   │   ├── AccessRiskAnalysis.jsx  ← Analytics sub-component
│   │   │   ├── EngagementChart.jsx     ← Analytics sub-component
│   │   │   ├── Recommendations.jsx     ← Analytics sub-component
│   │   │   ├── ShadowITList.jsx        ← Analytics sub-component
│   │   │   ├── ManageRequestors.jsx    ← Admin: User management
│   │   │   ├── ProfileSettings.jsx     ← All roles: User profile & avatar
│   │   │   └── UserProfileModal.jsx    ← Profile modal (future use)
│   │   ├── App.jsx                     ← Route definitions
│   │   ├── main.jsx                    ← React DOM entry point
│   │   └── index.css                  ← Global styles (Tailwind directives)
│   ├── .env                           ← Local env (gitignored)
│   ├── .env.development               ← Dev env: VITE_API_URL=http://localhost:5000
│   ├── .env.production                ← Prod env: VITE_API_URL=https://task-1mu1.onrender.com
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                         ← Express.js Backend
│   ├── middleware/
│   │   ├── auth.js                 ← JWT token verification
│   │   ├── role.js                 ← RBAC role-guard factory function
│   │   └── upload.js              ← Multer disk storage config (15 MB limit)
│   ├── models/
│   │   ├── User.js                 ← User schema (roles, profile, address)
│   │   ├── Request.js              ← Purchase request schema
│   │   ├── Vendor.js               ← Vendor schema (addresses, contacts)
│   │   ├── Contract.js             ← Contract schema (linked to Vendor)
│   │   ├── Integration.js          ← Integration schema (ERP, HRMS, etc.)
│   │   ├── ApplicationModel.js     ← SaaS app usage analytics schema
│   │   └── RecommendationModel.js  ← AI recommendations schema
│   ├── routes/
│   │   ├── auth.js                 ← /api/auth (register, login, profile)
│   │   ├── request.js              ← /api/requests (CRUD + approval flow)
│   │   ├── vendor.js               ← /api/vendors (CRUD)
│   │   ├── contract.js             ← /api/contracts (CRUD)
│   │   ├── integration.js          ← /api/integrations (CRUD + seed)
│   │   ├── analyticsRoutes.js      ← /api/analytics (usage, metrics, shadow-it)
│   │   ├── dashboard.js            ← /api/dashboard (KPI metrics)
│   │   └── requestor.js            ← /api/requestors (user management)
│   ├── seedData.js                 ← Database seeder (Applications + Recommendations)
│   ├── server.js                   ← Express app entry point
│   ├── .env                        ← Server env vars (gitignored)
│   └── package.json
│
├── uploads/                        ← File storage (contracts, profile images, attachments)
├── .gitignore
└── README.md
```

---

## 🗄 Database Schema

### `User`
| Field | Type | Notes |
|---|---|---|
| `firstName` | String | Default: `''` |
| `lastName` | String | Default: `''` |
| `email` | String | Required, Unique |
| `password` | String | bcrypt hashed |
| `role` | Enum | `employee`, `approver`, `admin`, `requester`, `super-admin` |
| `phone` | String | Profile field |
| `jobTitle` | String | Profile field |
| `department` | String | Profile field |
| `officeLocation` | String | Profile field |
| `profileImagePath` | String | Relative path: `uploads/filename` |
| `companyName`, `companyAddress`, `city`, `country`, `zipCode` | String | Company info fields |
| `date` | Date | Account creation date |

### `Request`
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Business justification |
| `cost` | Number | Total cost |
| `department` | Enum | `IT`, `HR`, `Finance`, `Marketing`, `Operations`, `R&D`, `Engineering`, `Sales` |
| `vendor` | ObjectId → Vendor | Optional (null if proposing new vendor) |
| `isNewVendor` | Boolean | True when proposing new vendor |
| `proposedVendor` | Object | `{ vendorName, website, contactEmail }` |
| `costPerLicense` | Number | Per-seat cost |
| `numLicenses` | Number | Number of licenses requested |
| `attachments` | [String] | Array of file paths |
| `status` | Enum | `Pending`, `Clarification Needed`, `In Review`, `Approved`, `Rejected`, `Withdrawn` |
| `reviewerNotes` | String | Admin/approver feedback |
| `requesterReply` | String | Requester's clarification response |
| `requester` | ObjectId → User | Required |
| `approvalDate` | Date | Timestamp when approved |

### `Vendor`
| Field | Type | Notes |
|---|---|---|
| `vendorName` | String | Required, Unique |
| `productTool` | String | Product/service name |
| `category` | Enum | `Productivity`, `Communication`, `Project Management`, `Cloud Services`, `Hardware`, `CRM`, `Development`, `Design Software`, `Other` |
| `contactEmail` | String | Required, validated |
| `companyEmail` | String | Required |
| `phoneNumber`, `companyPhone` | String | — |
| `primaryContact` | Sub-doc | `{ name, email, phone }` |
| `billingAddress` | Sub-doc | `{ country, state, city, address, zip }` |
| `companyAddress` | Sub-doc | `{ country, state, city, address, zip }` |
| `annualSpend` | Number | Default: `0` |
| `rating` | Number | 1–5, Default: `4.0` |
| `complianceStatus` | Enum | `Compliant`, `Pending`, `Non-Compliant` |
| `registeredId` | String | Company registration number |
| `website`, `notes` | String | Optional |
| `documentPath` | String | Uploaded doc path |
| `addedBy` | ObjectId → User | Who added this vendor |

### `Contract`
| Field | Type | Notes |
|---|---|---|
| `vendor` | ObjectId → Vendor | Required |
| `contractTitle` | String | Required |
| `start_date`, `end_date` | Date | Required |
| `contractValue` | Number | Required |
| `renewalStatus` | Enum | `Auto-Renew`, `Manual Review`, `Pending`, `Cancelled` |
| `paymentFrequency` | String | `Monthly`, `Annual`, etc. |
| `contactPerson` | String | Contract-specific override contact |
| `documentPath` | String | Uploaded contract PDF |
| `termsLink` | String | External URL to terms |
| `addedBy` | ObjectId → User | Who created the contract |

### `Integration`
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required (e.g., `BambooHR`) |
| `category` | String | `ERP Systems`, `HRMS`, `Accounting`, `Finance`, `CRM`, `SSO` |
| `description` | String | — |
| `status` | Enum | `Connected`, `Available`, `Coming Soon` |
| `syncDate` | Date | Last sync timestamp |
| `syncFrequency` | String | `Real-time`, `Daily`, `Every 6 hours` |
| `icon` | String | Emoji or icon identifier |
| `isHR` | Boolean | Whether this is an HR system |
| `clientId`, `clientSecret`, `apiKey` | String | OAuth/API credentials |

### `Application` (Analytics)
| Field | Type | Notes |
|---|---|---|
| `name` | String | Unique app name (e.g., `Slack`) |
| `icon` | String | Single-char icon (e.g., `S`) |
| `category` | Enum | `Marketing`, `Design`, `Project Management`, `Development`, `Productivity`, `Communication`, `Security`, `Finance` |
| `licenses` | Number | Total licenses purchased |
| `activeUsers` | Number | Currently active users |
| `activePercentage` | Number | Calculated utilization % |
| `noUsage` | Number | % users with no activity (>30 days) |
| `lowUsage` | Number | % users with low activity (16–30 days) |
| `mediumUsage` | Number | % users with medium activity (4–15 days) |
| `highUsage` | Number | % users with high activity (0–3 days) |

---

## 📡 API Reference

All protected routes require the **`x-auth-token`** header with a valid JWT.

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login — returns JWT + full user object |
| `GET` | `/profile` | Private | Fetch current user's profile |
| `PUT` | `/profile` | Private | Update profile (supports avatar upload via `multipart/form-data`) |

### Requests — `/api/requests`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Private | Get all requests (filtered by role, department, status, cost) |
| `POST` | `/` | Private | Create new purchase request (supports file attachments) |
| `GET` | `/:id` | Private | Get single request by ID |
| `PUT` | `/:id` | Private | Update/edit a request |
| `PUT` | `/:id/status` | Admin/Approver | Change request status + add reviewer notes |
| `DELETE` | `/:id` | Private | Delete a request |

### Vendors — `/api/vendors`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Private | Get all vendors (sorted by date added) |
| `POST` | `/` | Private | Add new vendor (supports document upload) |
| `GET` | `/:id` | Private | Get single vendor + all linked contracts |

### Contracts — `/api/contracts`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Private | Get all contracts (sorted soonest expiring first) |
| `POST` | `/` | Private | Create new contract (supports document upload) |
| `GET` | `/:id` | Private | Get single contract with populated vendor details |
| `PUT` | `/:id` | Private | Update/renew a contract |

### Analytics — `/api/analytics`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/usage` | Public | All application usage data |
| `GET` | `/metrics` | Public | Aggregated KPI metrics (total apps, licenses, utilization) |
| `GET` | `/recommendations` | Public | AI-driven cost optimization recommendations |
| `GET` | `/shadow-it` | Public | List of unapproved / Shadow IT applications |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/metrics` | Private | KPI cards: pending requests, total spend, upcoming renewals, vendors in review |

### Integrations — `/api/integrations`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Private | Get all integrations |
| `PUT` | `/:id/connect` | Private | Connect or update an integration |
| `GET` | `/seed` | Public | ⚠️ Seed integration data (dev/setup use only) |

### Requestors — `/api/requestors`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Private | List all employees and requesters |
| `POST` | `/` | Private | Create a new requestor user (default password provisioned) |
| `DELETE` | `/:id` | Private | Remove a requestor account |

---

## 🔐 Role-Based Access Control (RBAC)

| Role | Dashboard | Requests | Approvals | Vendors | Contracts | Integrations | Analytics |
|---|---|---|---|---|---|---|---|
| `employee` | ❌ | ✅ Own only | ❌ | ❌ | ❌ | ❌ | ❌ |
| `requester` | ❌ | ✅ Own only | ❌ | ❌ | ❌ | ❌ | ❌ |
| `approver` | ❌ | ✅ All | ✅ | ✅ | ✅ | ✅ | ✅ |
| `admin` | ❌ | ✅ All | ✅ | ✅ | ✅ | ✅ | ✅ |
| `super-admin` | ✅ | ✅ All | ✅ | ✅ | ✅ | ✅ | ✅ |

**Post-login redirect logic:**
- `admin` / `approver` → `/approvals`
- All other roles → `/requests`

**Backend enforcement** is handled by the `role.js` middleware factory:
```js
router.put('/:id/status', [auth, role(['approver', 'admin', 'super-admin'])], ...)
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier available)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ManojBarmase/Task.git
cd Task

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Environment Variables

#### Server — create `server/.env`

```env
# MongoDB Atlas connection string
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>"

# Server port
PORT=5000

# Frontend URL (used in CORS whitelist)
FRONTEND_URL="http://localhost:5173"

# JWT Secret — use a long, random, complex string in production
JWT_SECRET="your_very_long_and_secure_random_jwt_secret_key_here"
```

> ⚠️ **Security Warning:** Never commit `.env` files with real credentials. The `.gitignore` is configured to exclude all `.env` files.

#### Client — create `client/.env.development`

```env
# Points to local backend
VITE_API_URL="http://localhost:5000"
```

#### Client — create `client/.env.production`

```env
# Points to deployed backend
VITE_API_URL="https://your-backend.onrender.com"
```

### Running Locally

Open **two terminal windows** simultaneously:

**Terminal 1 — Backend:**
```bash
cd server
npm start
# Uses nodemon for auto-reload on file changes
# Expected output:
#   🔧 Middleware Target: .../uploads
#   ✅ MongoDB Connected Successfully!
#   🚀 Server listening on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Vite dev server starts at: http://localhost:5173
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

### Seeding the Database

**Integration data** (one-time setup):
```
GET http://localhost:5000/api/integrations/seed
```

**Application analytics data:**
Uncomment `seedDatabase()` in `server/server.js`, restart the server once, then comment it out again.

---

## ☁️ Deployment

### Backend → Render

1. Connect your GitHub repo to [Render](https://render.com)
2. Create a **Web Service**
3. Set **Root Directory**: `server`
4. Set **Start Command**: `node server.js`
5. Add all environment variables from `server/.env` in the Render dashboard environment tab

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set **Root Directory**: `client`
3. Vercel auto-detects Vite — default build settings work
4. Add the `VITE_API_URL` environment variable pointing to your Render backend URL

---

## 📎 File Upload System

Files are handled using **Multer** with local disk storage:

| Setting | Value |
|---|---|
| **Storage** | Disk (local filesystem) |
| **Upload directory** | `<project-root>/uploads/` (auto-created) |
| **Filename convention** | `doc-{timestamp}-{random9digits}-{originalname}` |
| **Max file size** | 15 MB |
| **Allowed MIME types** | `image/jpeg`, `image/png`, `image/jpg`, `application/pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.csv`, `.txt` |
| **Static serving** | `GET /uploads/:filename` via Express static middleware |

Frontend constructs full URLs as:
```js
const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
```

---

## 🐛 Known Issues & Roadmap

### ⚠️ Known Issues

| Issue | Severity | Description |
|---|---|---|
| Plaintext integration secrets | 🔴 High | `clientSecret` in Integration model stored unencrypted |
| Public seed endpoint | 🟡 Medium | `/api/integrations/seed` has no auth guard — can reset production data |
| Render cold starts | 🟡 Medium | Free tier backend sleeps after inactivity (~30–60s wake-up delay) |
| Incomplete Requestors UI | 🟢 Low | "Requestors" button in profile dropdown is not wired to a route |
| Dashboard restricted | 🟢 Low | Dashboard route only visible to `super-admin`; other roles see empty nav |

### 🗺 Roadmap

- [ ] Email notifications on request status changes (Nodemailer / SendGrid)
- [ ] Google OAuth 2.0 / SSO integration
- [ ] Real-time notifications (WebSockets with Socket.io)
- [ ] Advanced analytics with date-range and department filters
- [ ] PDF contract generation and e-signature support (DocuSign / PDF-lib)
- [ ] Audit log / activity trail per request and vendor
- [ ] Multi-tenancy support (organization-level data isolation)
- [ ] Unit & integration test suite (Jest + Supertest)
- [ ] Encrypt sensitive integration credentials (AES-256 via `crypto`)
- [ ] JWT refresh token support for extended sessions
- [ ] Docker + docker-compose for local development parity

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add email notifications on approval
   fix: correct CORS whitelist regex
   docs: update API reference table
   ```
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request with a clear description of changes

---

## 📜 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **Manoj Barmase**

[Live Demo](https://task-pink-seven.vercel.app) &nbsp;·&nbsp; [Report a Bug](https://github.com/ManojBarmase/Task/issues) &nbsp;·&nbsp; [Request a Feature](https://github.com/ManojBarmase/Task/issues)

</div>
