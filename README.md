# TeamVault Frontend

A production-grade Next.js frontend for TeamVault task management platform. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and modern best practices.

## 🏗️ Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── tasks/                # Task management
│   │   ├── profile/              # User profile
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard home
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Home (redirects)
│   └── globals.css               # Global styles
├── components/
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx            # Top navigation
│   │   └── sidebar.tsx           # Side navigation
│   ├── tasks/                    # Task-specific components
│   │   ├── create-task-modal.tsx
│   │   ├── edit-task-modal.tsx
│   │   └── delete-task-modal.tsx
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── form-field.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       ├── empty-state.tsx
│       ├── modal.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── contexts/
│   └── auth-context.tsx          # Auth state management
├── services/
│   ├── api-client.ts             # HTTP client with auto token refresh
│   ├── auth.service.ts           # Auth API calls
│   └── task.service.ts           # Task API calls
├── lib/
│   ├── config.ts                 # App configuration
│   ├── storage.ts                # LocalStorage wrapper
│   ├── utils.ts                  # Utility functions
│   └── validations.ts            # Zod schemas
├── types/
│   └── api.ts                    # TypeScript types from API contract
└── middleware.ts                 # Route protection
```

## ✨ Features

### Authentication
- JWT-based authentication with access + refresh tokens
- Automatic token refresh on expiry
- Protected routes with middleware
- Secure token storage
- Login/Register flows

### Task Management
- Create, read, update, delete tasks
- Task status management (TODO, IN_PROGRESS, DONE)
- Real-time task statistics
- Clean task list interface
- Modal-based task editing

### UI/UX
- Professional, minimal design inspired by Stripe/Linear/Vercel
- Neutral color palette (zinc/slate/gray)
- Responsive layout
- Loading states with skeletons
- Empty states
- Error handling with toast notifications
- Form validation with Zod
- Smooth transitions

### Architecture
- Type-safe API integration
- Centralized API client
- Automatic error handling
- Token refresh logic
- Clean separation of concerns

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Backend API running on http://localhost:4000 
if you have backend api running on some other port, configure in environment variables.

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Update environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

4. Start development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Native Fetch API
- **Notifications**: Sonner
- **Date Formatting**: date-fns
- **Font**: Inter

## 🎨 Design Philosophy

### Minimalism Over Flashiness
- No gradients or glassmorphism
- Subtle borders and shadows
- Ample whitespace
- Clean typography hierarchy

### Enterprise-Grade
- Professional color palette
- Consistent spacing scale
- Accessible components
- Production-ready code

### Inspired By
- Stripe Dashboard
- Linear App
- Vercel Dashboard
- Notion

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend returns access token (15min) + refresh token (7d)
3. Tokens stored in localStorage
4. Access token sent in Authorization header
5. On 401, automatically refresh using refresh token
6. If refresh fails, redirect to login

## 🛠️ Development

### Project Structure
- **app/**: Next.js pages and layouts
- **components/**: Reusable UI components
- **services/**: API integration layer
- **contexts/**: React context providers
- **lib/**: Utilities and helpers
- **types/**: TypeScript type definitions

### Key Files
- `middleware.ts`: Route protection
- `api-client.ts`: HTTP client with auto refresh
- `auth-context.tsx`: Auth state management
- `validations.ts`: Form validation schemas

### API Integration
All API calls go through centralized services:
- `authService`: Login, register, logout, get user
- `taskService`: CRUD operations for tasks

### Components
All UI components follow consistent patterns:
- Variants for different styles
- Size options
- Error states
- Loading states
- Accessible markup

## 🧪 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL   # Backend API URL (required)
```

## 🎯 Key Features Implementation

### Automatic Token Refresh
The API client automatically refreshes expired access tokens:
- Detects 401 responses
- Calls refresh endpoint
- Retries original request
- Queues concurrent requests during refresh

### Protected Routes
Middleware checks authentication:
- Redirects unauthenticated users to login
- Redirects authenticated users from login/register to dashboard
- Preserves intended destination

### Form Validation
Zod schemas validate all forms:
- Client-side validation
- Type-safe forms
- Consistent error messages
- Matches backend validation rules

### Error Handling
Comprehensive error handling:
- API errors displayed as toasts
- Field-level validation errors
- Network error handling
- Fallback UI for errors

## 🎨 Design Tokens

### Colors
- Primary: `zinc-900`
- Background: `zinc-50`
- Border: `zinc-200`
- Text: `zinc-900`, `zinc-600`, `zinc-500`

### Spacing
- Follows Tailwind's default spacing scale
- Consistent padding/margins

### Typography
- Font: Inter
- Weights: 400 (normal), 500 (medium), 600 (semibold)
- Clear hierarchy with size/weight

### Components
- Rounded corners: `rounded-md` (6px)
- Shadows: Subtle `shadow-sm`
- Transitions: 150ms ease

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contributing

This is a production-grade codebase. Follow existing patterns:
- Use TypeScript strictly
- Follow component structure
- Add proper error handling
- Write clean, readable code
- No console.logs in production

## 📄 License

MIT
