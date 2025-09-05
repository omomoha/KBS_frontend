# KBS LMS - Login Credentials

## Test User Accounts

### Admin User
- **Email**: admin@kbs.edu.ng
- **Password**: admin123
- **Role**: Admin
- **Department**: Administration
- **Access**: Full system access, user management, analytics, export features

### Instructor User
- **Email**: instructor@kbs.edu.ng
- **Password**: instructor123
- **Role**: Instructor
- **Department**: Business Administration
- **Access**: Course management, assignment creation, student progress tracking

### Learner User
- **Email**: learner@kbs.edu.ng
- **Password**: learner123
- **Role**: Learner
- **Department**: Business Administration
- **Access**: Course enrollment, assignment submission, progress tracking

### Additional Test Users

#### Admin Users
- **Email**: admin2@kbs.edu.ng
- **Password**: admin123
- **Role**: Admin
- **Department**: IT Administration

#### Instructor Users
- **Email**: instructor2@kbs.edu.ng
- **Password**: instructor123
- **Role**: Instructor
- **Department**: Computer Science

- **Email**: instructor3@kbs.edu.ng
- **Password**: instructor123
- **Role**: Instructor
- **Department**: Engineering

#### Learner Users
- **Email**: learner2@kbs.edu.ng
- **Password**: learner123
- **Role**: Learner
- **Department**: Computer Science

- **Email**: learner3@kbs.edu.ng
- **Password**: learner123
- **Role**: Learner
- **Department**: Engineering

- **Email**: learner4@kbs.edu.ng
- **Password**: learner123
- **Role**: Learner
- **Department**: Marketing

## Features by Role

### Admin Features
- ✅ User Management (Create, Edit, Delete Users)
- ✅ Export Data (Bulk and Individual User Exports)
- ✅ Analytics Dashboard
- ✅ System Settings
- ✅ All Course Management
- ✅ All Assignment Management
- ✅ Notification Management

### Instructor Features
- ✅ Course Creation and Management
- ✅ Assignment Creation and Grading
- ✅ Student Progress Tracking
- ✅ Announcement Creation
- ✅ Discussion Moderation
- ✅ Upload Learning Resources
- ✅ Analytics (Limited to their courses)

### Learner Features
- ✅ Course Enrollment
- ✅ Assignment Submission
- ✅ Progress Tracking
- ✅ Certificate Viewing
- ✅ Transcript Access
- ✅ Discussion Participation
- ✅ Notification Settings

## Quick Login Instructions

1. Navigate to `http://localhost:3000/auth/login`
2. Use any of the credentials above
3. Click "Sign in to your account"
4. You'll be redirected to the appropriate dashboard based on your role

## Development Notes

- All passwords are set to simple 123 suffixes for easy testing
- Users are created with mock data for development
- The system uses role-based access control
- Rate limiting has been disabled for development
- CSRF protection is temporarily disabled for login/registration

## Security Note

⚠️ **These are development credentials only!** 
- Do not use these credentials in production
- Change all passwords before deploying to production
- Implement proper password policies
- Re-enable rate limiting and CSRF protection for production
