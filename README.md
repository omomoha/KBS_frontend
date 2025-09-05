# Kaduna Business School (KBS) LMS Frontend

A modern, responsive Learning Management System (LMS) frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication** - Support for learners, instructors, and administrators
- **Course Management** - Browse, enroll, and track course progress
- **Assignment System** - Submit assignments and track grades
- **Certificate Generation** - Download course and program certificates
- **Academic Transcript** - View and download academic records
- **Discussion Forums** - Course-based discussions and Q&A
- **Announcements** - School-wide and course-specific announcements
- **Progress Tracking** - Real-time progress monitoring and analytics

### Technical Features
- **Modern UI Components** - Built with Radix UI primitives
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **Accessibility** - WCAG 2.1 AA compliant
- **Performance** - Optimized with Vite and code splitting
- **Testing** - Comprehensive test suite with Vitest

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **UI Components**: Radix UI primitives + Custom components
- **State Management**: React Query + React Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KBS_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🔐 Test Credentials

### Learner Account
- **Email**: `learner@kbs.edu.ng`
- **Password**: `password123`
- **Access**: Dashboard, courses, assignments, certificates, discussions

### Instructor Account
- **Email**: `instructor@kbs.edu.ng`
- **Password**: `password123`
- **Access**: All learner features + grading tools, analytics

### Admin Account
- **Email**: `admin@kbs.edu.ng`
- **Password**: `password123`
- **Access**: Full system administration, user management

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── layouts/        # Layout components
│   └── ...             # Feature-specific components
├── contexts/           # React Context providers
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── ...             # Feature pages
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test files
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **CSS Variables** - Semantic color tokens and spacing
- **Component Variants** - Consistent button, card, and input styles
- **Responsive Breakpoints** - Mobile-first responsive design
- **Accessibility** - Focus management, ARIA labels, keyboard navigation

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🚀 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   The `dist/` folder contains the production-ready files.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## ♿ Accessibility Features

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Proper ARIA labels and semantic HTML
- **Focus Management** - Visible focus indicators and focus trapping
- **Color Contrast** - WCAG 2.1 AA compliant color ratios
- **Skip Links** - Quick navigation for keyboard users

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_OIDC_CLIENT_ID=your-client-id
VITE_STORAGE_PUBLIC_URL=https://your-storage-url.com
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing scale
- Custom animations
- Design system tokens

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables in Netlify dashboard

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔄 Version History

- **v1.0.0** - Initial release with core LMS functionality
- **v1.1.0** - Added modern UI components and design system
- **v1.2.0** - Enhanced accessibility and performance optimizations

---

Built with ❤️ for Kaduna Business School