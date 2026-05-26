# SACCO Management System - Frontend

## Overview
Modern React 18 + TypeScript frontend for SACCO digital management system. Provides admin dashboard for managing members, loans, contributions, and financial reporting.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with Redux Toolkit for complex scenarios)
- **Data Fetching**: Axios + TanStack Query (React Query)
- **Charting**: Recharts
- **Forms**: React Hook Form
- **UI Components**: Material-UI (MUI) + Custom components
- **Routing**: React Router v6

## Project Structure
```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Sidebar, Header)
├── pages/              # Page components (one per route)
│   ├── Auth/          # Login page
│   ├── Dashboard/     # Main dashboard
│   ├── Members/       # Member management
│   ├── Loans/         # Loan management
│   ├── Contributions/ # Contribution tracking
│   └── Reports/       # Financial reports
├── services/          # API service layer
│   ├── api.ts        # Axios instance + interceptors
│   ├── authService.ts
│   ├── memberService.ts
│   ├── loanService.ts
│   └── contributionService.ts
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main app router
```

## Features Implemented
- ✅ Authentication (login with token storage)
- ✅ Dashboard with stats cards and charts
- ✅ Member list and detail views
- ✅ Responsive layout with sidebar navigation
- ✅ API integration with error handling
- ✅ Role-based access control setup
- ✅ TypeScript strict mode

## Setup & Running

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Opens at http://localhost:5173

### Building
```bash
npm run build
npm run preview
```

### Type Checking
```bash
npm run type-check
```

## API Integration
The frontend connects to the Spring Boot backend at `http://localhost:8080/api`

Configure via `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Key Implementation Details

### Authentication Flow
1. User logs in at `/login`
2. Token stored in localStorage
3. Token automatically included in all API requests via axios interceptor
4. Redirect to login on 401 Unauthorized

### Data Fetching
Uses TanStack Query for:
- Automatic caching
- Background refetching
- Request deduplication
- Error handling

Example:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['members', page],
  queryFn: () => memberService.getMembers(page, 10),
})
```

### Component Patterns
- Functional components with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design (mobile-first)

## Next Priority Features
- [ ] Loan application workflow (submit, approve, reject)
- [ ] Contribution recording and tracking
- [ ] Loan repayment management
- [ ] Report generation and export
- [ ] User settings/profile page
- [ ] Notification system
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] SMS notifications

## Development Conventions
- Use TypeScript strict mode
- Components in PascalCase
- Services handle all API logic
- Custom hooks for reusable logic
- Zustand for global state (if needed)
- Tailwind CSS for all styling

## Performance Optimizations
- Code splitting via Vite
- Image optimization
- Lazy loading of routes
- Query caching with React Query
- Memoization where appropriate

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Troubleshooting

### API connection fails
- Ensure backend is running on http://localhost:8080
- Check VITE_API_BASE_URL in .env

### TypeScript errors
- Run `npm run type-check` to see all issues
- Most common: missing types in component props

### Build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear vite cache: `rm -rf .vite`

## Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [React Query](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org)
