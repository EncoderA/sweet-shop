# 🍭 Sweet Shop

## My AI Usage

### Which AI tools I used
- Claude (via VsCode Copilot AI, powered by Claude)

### How I used them
- Code comprehension and scanning: asked the AI to map frontend `/shop` and `/shop/inventory` routes and backend APIs, identify protected endpoints, and trace add-item and orders flows.
- Bug diagnosis and fixes: used AI to pinpoint production crashes (image handling, env/config mismatches), update Next.js image config, and guard UI for non-admin users.
- Feature implementation: guided creation of Cloudinary-based uploads (server-side), static serving for local dev, and frontend wiring to use returned URLs.
- Refactors and hardening: migrated ad-hoc API calls to a consolidated client (`sweetApi`), added grouped orders rendering, validated and typed Cloudinary config, and improved error handling and limits for serverless.
- Documentation and developer experience: generated this “My AI Usage” section and suggested environment variable setups for both client and server.

#### Additional context (design and process)
- Design/landing page: I used Google Stitch for the initial UI/UX ideas and landing layout, then adapted the components in code.
- Database and backend: I designed and implemented the database schema and backend first, then iterated on endpoints.
- Claude AI: I used Claude to improve the structure and clarity of certain parts (e.g., endpoint shapes, validation), while keeping the final code decisions in my hands.
- Styling and APIs: I leveraged AI for styling suggestions and API request patterns, but I maintained control of the data flow between files and modules.
- Development order: Backend first, then frontend integration and UI enhancements.

### Reflection on impact
- Productivity: AI significantly accelerated debugging and cross-file navigation, reducing time to locate mismatched shapes and misconfigurations.
- Code quality: suggestions improved resilience (type-safe config, better error messages, handling `data:` URLs, admin-only actions) and production readiness (Cloudinary over ephemeral disk).
- Risks and mitigations: AI can suggest changes that assume certain envs or deploy targets; I verified lints, added runtime checks, and limited edits to safe, incremental changes. Final behavior was validated locally with smaller uploads and environment variables clearly documented for production.
- Human oversight: I reviewed all edits, ensured they matched project patterns, and verified that UI/UX changes (e.g., admin-only controls, grouped orders) aligned with existing components and constraints.

A modern full-stack e-commerce application for a sweet shop built with Next.js 15, Express.js, PostgreSQL, and Drizzle ORM.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔐 User authentication (login/register)
- 🛒 Shopping cart functionality
- 🍬 Product catalog with categories
- 🖼️ Image upload for products
- 👤 User roles (admin/user)
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔄 Real-time cart updates
- 💳 Product management (CRUD operations)

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 with Turbopack
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI, Shadcn/ui
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/EncoderA/sweet-shop.git
cd sweet-shop
```

### 2. Setup Environment Variables

#### Client Environment (`.env.local`)
Create a `.env.local` file in the `client` directory:

```bash
cd client
cp .env.local.example .env.local
```

Add the following variables:
```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

#### Server Environment (`.env`)
Create a `.env` file in the `server` directory:

```bash
cd ../server
cp .env.example .env
```

Add the following variables:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/sweet_shop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=5MB
UPLOAD_PATH=uploads/images
```

### 3. Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

### 4. Database Setup

#### Generate and Run Migrations
```bash
cd server
npm run db:generate
npm run db:migrate
```

#### (Optional) Open Drizzle Studio
```bash
npm run db:studio
```

### 5. Start Development Servers

#### Start the Backend Server
```bash
cd server
npm run dev
```

#### Start the Frontend Client (in a new terminal)
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Drizzle Studio**: http://localhost:4983

## 📁 Project Structure

```
sweet-shop/
├── README.md
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── api/           # API routes
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration page
│   │   │   └── shop/          # Shop pages
│   │   ├── components/        # React components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── shop/          # Shop-specific components
│   │   │   └── landingPage/   # Landing page components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   └── lib/               # Utilities and configurations
│   ├── public/                # Static assets
│   └── package.json
└── server/                    # Express.js Backend
    ├── src/
    │   ├── controllers/       # Route controllers
    │   ├── middleware/        # Custom middleware
    │   ├── routes/           # API routes
    │   ├── db/               # Database configuration
    │   ├── types/            # TypeScript types
    │   └── utils/            # Utility functions
    ├── drizzle/              # Database migrations
    ├── uploads/              # File uploads
    └── package.json
```

## 🗄️ Database Schema

### Users Table
```sql
users (
  id: UUID PRIMARY KEY,
  name: VARCHAR(100) NOT NULL,
  email: VARCHAR(150) UNIQUE NOT NULL,
  password_hash: TEXT NOT NULL,
  role: ENUM('user', 'admin') DEFAULT 'user',
  created_at: TIMESTAMP DEFAULT NOW()
)
```

### Sweets Table
```sql
sweets (
  id: UUID PRIMARY KEY,
  name: VARCHAR(100) UNIQUE NOT NULL,
  category: VARCHAR(50) NOT NULL,
  price: NUMERIC(10,2) NOT NULL,
  quantity: INTEGER NOT NULL,
  description: TEXT,
  image_url: TEXT,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweet Routes
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create new sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)

### Upload Routes
- `POST /api/upload/image` - Upload product image

## 🔧 Environment Variables

### Client (.env.local)
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `BACKEND_URL` | Backend server URL | Yes |
| `NEXT_PUBLIC_BACKEND_URL` | Public backend URL | Yes |

### Server (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 7d) |

## 👨‍💻 Development

### Available Scripts

#### Client Scripts
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Server Scripts
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
```

### Code Style
- ESLint for code linting
- TypeScript for type safety
- Consistent file naming conventions

## 🚀 Build & Deployment

### Building for Production

#### Build Client
```bash
cd client
npm run build
```

#### Build Server
```bash
cd server
npm run build
```

### Deployment Considerations
- Set `NODE_ENV=production`
- Configure production database
- Set secure JWT secrets
- Configure file upload permissions
- Set up reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


**Made with ❤️ by [EncoderA](https://github.com/EncoderA)**
