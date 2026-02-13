# Testing Guide

## Quick Start Testing

### 1. Start the Development Server
```bash
cd /home/satyam/Projects/TeamVault/client/frontend
npm run dev
```

The app should be running at `http://localhost:3000`

## Authentication Tests

### Test Login Flow
1. Navigate to `http://localhost:3000` → should redirect to `/login`
2. Enter valid credentials:
   - Email: `admin@example.com` (or your admin account)
   - Password: your password
3. Click "Login"
4. **Expected**: Redirect to `/dashboard` with success toast

### Test Register Flow
1. Click "Don't have an account? Register"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: SecurePass123!
3. Click "Register"
4. **Expected**: Account created, redirect to `/dashboard`

### Test Logout
1. Click user menu in navbar (top right)
2. Click "Logout"
3. **Expected**: Redirect to `/login`, tokens cleared

## User Features (Regular USER role)

### Dashboard
- **URL**: `/dashboard`
- **Check**: 
  - Task statistics cards visible
  - Recent tasks list shows (if any tasks exist)
  - "Create Task" and "View All Tasks" buttons work

### Tasks Page
- **URL**: `/dashboard/tasks`
- **Test Create**:
  1. Click "Create Task"
  2. Fill title and description
  3. Select status (TODO/IN_PROGRESS/DONE)
  4. Submit
  5. **Expected**: Toast notification, task appears in list

- **Test Edit**:
  1. Click "Edit" on any task
  2. Modify title/description/status
  3. Submit
  4. **Expected**: Toast notification, changes reflected

- **Test Delete**:
  1. Click "Delete" on any task
  2. Confirm in modal
  3. **Expected**: Toast notification, task removed from list

### Profile Page
- **URL**: `/dashboard/profile`
- **Check**: 
  - Name, email, role displayed correctly
  - User ID shown
  - Created and updated dates visible

### Settings Page
- **URL**: `/dashboard/settings`
- **Check**: 
  - Account info displayed
  - Placeholder sections for preferences/security

## Admin Features (ADMIN role only)

### Admin Dashboard
- **URL**: `/admin`
- **Check**:
  - User statistics (Total Users, Admins, Regular Users)
  - Task statistics (Total, To Do, In Progress, Done)
  - All cards load properly

### User Management
- **URL**: `/admin/users`
- **Test View Users**:
  - All users listed with name, email, role
  - Created date shown
  - User count displayed at top

- **Test Copy User ID**:
  1. Click "Copy ID" button
  2. **Expected**: Toast "User ID copied", ID in clipboard

- **Test Delete User**:
  1. Click "Delete" on a user
  2. Confirm in modal (shows user name/email)
  3. **Expected**: Toast notification, user removed from list

### Role-Based Access Control
- **Test with USER role**:
  1. Login as regular USER
  2. Try to access `/admin`
  3. **Expected**: Redirect to `/dashboard`

- **Test with ADMIN role**:
  1. Login as ADMIN
  2. Access `/admin` and `/admin/users`
  3. **Expected**: Both pages load successfully

## Navigation Tests

### Sidebar (USER role)
- **Check items**:
  - Dashboard
  - Tasks
  - Profile
  - Settings
- **Check behavior**:
  - Active route highlighted
  - Click navigates correctly

### Sidebar (ADMIN role)
- **Check items**:
  - Admin Dashboard
  - User Management
  - Tasks
  - Profile
  - Settings
- **Check behavior**:
  - Admin items visible
  - All navigation works

### Navbar
- **Check**:
  - Logo/app name visible
  - User name displayed
  - Logout button works
  - Responsive on mobile

## Route Protection Tests

### Middleware
1. **Logged out → try to access `/dashboard`**
   - **Expected**: Redirect to `/login`

2. **Logged in → try to access `/login`**
   - **Expected**: Redirect to `/dashboard`

3. **Logged out → try to access `/admin`**
   - **Expected**: Redirect to `/login`

### Client-side Protection
1. **USER role → navigate to `/admin`**
   - **Expected**: Redirect to `/dashboard`

2. **ADMIN role → navigate to `/admin`**
   - **Expected**: Page loads successfully
