# RentNest 

**Find & List Rental Properties with Ease**

A backend REST API for a rental property marketplace where Landlords can list properties, Tenants can browse and request rentals, and Admins moderate the entire platform.

Built for **Level 2, Batch 7 — Assignment 4** (Programming Hero).

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| Live API | https://l2b7-assginment-4-rentnest.vercel.app |
| GitHub Repository | https://github.com/irfanrumman/l2b7_assginment_4 |
| API Documentation (Postman) | https://documenter.getpostman.com/view/54708532/2sBY4LRMbY |
| 

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | JWT (access token via httpOnly cookies) |
| Validation | Zod |
| Password Hashing | bcryptjs |
| Payment Gateway | Stripe (Checkout Sessions) |
| Build Tool | tsup (esbuild-based) |
| Deployment | Vercel |

---

## 👥 Roles & Permissions

| Role | Key Permissions |
|---|---|
| **Tenant** | Browse listings, submit rental requests, make payments, leave reviews, manage profile |
| **Landlord** | Create/manage property listings, approve/reject rental requests, view tenant history |
| **Admin** | Manage all users (ban/unban), oversee all listings & rental requests, view platform-wide analytics |

> Users select their role (Tenant/Landlord) during registration. Admin accounts are not self-registerable.

---

## 📦 Core Features

### Public
- Browse all available properties with filters (location, price range, category, search)
- View detailed property listings with landlord contact info and reviews
- Paginated results on all list endpoints

### Tenant
- Register/login
- Submit rental requests for available properties
- Pay via Stripe Checkout after a request is approved
- View payment history and rental request history (with status tracking)
- Leave a review after a completed rental
- Update own profile

### Landlord
- Create, update, and delete property listings
- Approve or reject incoming rental requests (with enforced status transition rules)
- View all requests for their own properties

### Admin
- View and filter all users by role/status
- Ban/unban user accounts (with safeguards against self-lockout)
- View all properties and rental requests platform-wide
- View rental request analytics grouped by property

---

## 🗄️ Database Schema (Prisma)

Core models: `User`, `Property`, `Category`, `RentalRequest`, `Payment`, `Review`

Key design decisions:
- **Role-based single `User` table** — avoids duplicating auth logic across Tenant/Landlord/Admin.
- **`RentalRequest` as the central entity** — tracks the full lifecycle: `PENDING → APPROVED/REJECTED → ACTIVE → COMPLETED`.
- **One-to-many `Payment`** — supports retrying a failed payment without losing history.
- **`Review` linked to `RentalRequest`** — enforces (at the schema level) that a review can only exist for a completed rental.

---

## 🔐 Authentication & Authorization

- JWT access tokens issued on login, stored in **httpOnly cookies** (`secure`/`sameSite` configured dynamically based on `NODE_ENV`).
- Centralized `auth()` middleware verifies the token, re-fetches the user from the database (to catch bans immediately), and enforces role-based access per route.
- Passwords hashed with bcrypt before storage; never returned in any API response.

---

## ✅ Input Validation

All request `body`, `params`, and `query` are validated using **Zod schemas** via a generic `validate()` middleware, applied per-route. Invalid input returns a structured `400` response before it ever reaches business logic.

---

## ⚠️ Error Handling

All errors flow through a centralized `globalErrorHandler`, returning a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorDetails": "..."
}
```

Custom `AppError` class carries the correct HTTP status code (`400`, `401`, `403`, `404`, `409`, etc.) for every failure case — including duplicate resources, unauthorized access, invalid state transitions, and payment conflicts.

---

## 💳 Payment Flow (Stripe)

1. Tenant requests a payment session for an **approved** rental request (`POST /api/payments/create`).
2. Backend creates a Stripe Checkout Session and a `PENDING` payment record.
3. Tenant completes payment on Stripe's hosted checkout page (test mode: card `4242 4242 4242 4242`).
4. Stripe confirms the payment via webhook, which updates the payment status and rental request status accordingly.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Properties
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/properties` | Public (filters: location, price, category, search) |
| GET | `/api/properties/:id` | Public |

### Categories
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/categories` | Public |

### Landlord
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/landlord/properties` | Landlord |
| PUT | `/api/landlord/properties/:id` | Landlord (owner only) |
| DELETE | `/api/landlord/properties/:id` | Landlord (owner only) |
| GET | `/api/landlord/requests` | Landlord |
| PATCH | `/api/landlord/requests/:id` | Landlord (owner only) |

### Rental Requests
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/rentals` | Tenant |
| GET | `/api/rentals` | Tenant (own requests) |
| GET | `/api/rentals/:id` | Tenant (own request only) |

### Payments
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/payments/create` | Tenant |
| POST | `/api/payments/confirm` | Stripe webhook |
| GET | `/api/payments` | Authenticated (own history) |
| GET | `/api/payments/:id` | Tenant / Landlord / Admin (ownership-based) |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews` | Tenant (after completed rental) |


### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id` | Admin (ban/unban) |
| GET | `/api/admin/properties` | Admin |
| GET | `/api/admin/rentals` | Admin |

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js (LTS)
- PostgreSQL (local or cloud)
- A Stripe account (test mode)

### Installation

```bash
git clone  https://github.com/irfanrumman/l2b7_assginment_4 
cd l2b7_assginment_4
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
PORT=5000
NODE_ENV=development

DATABASE_URL="..."

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

BCRYPT_SALT_ROUNDS=...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

```

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Run Locally

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Testing the API

This is a backend-only project — test all endpoints using **Postman** or **Thunder Client**.

- `GET` requests can be tested directly in a browser.
- `POST` / `PUT` / `PATCH` / `DELETE` require a tool like Postman (browsers cannot send a request body via the address bar).

A Postman collection is provided (see link above) covering all endpoints, including validation edge cases and role-based access scenarios.

---

## 📁 Project Structure

```
src/
├── config/            # Environment config, Stripe client setup
├── lib/                # Prisma client instance
├── middlewares/        # auth, validate, error handling, catchAsync
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── category/
│   ├── landlord/
│   ├── payment/
│   ├── property/
│   ├── trntal/
│   ├── review/
├── utils/              # AppError, sendResponse, etc.
├── app.ts
└── server.ts
```

Each module follows a consistent pattern: `*.route.ts`, `*.controller.ts`, `*.service.ts`.

---

## 👤 Author

**Irfan Uddin**
Programming Hero — Level 2, Batch 7
