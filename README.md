# SACCO Management System - Frontend

A modern, responsive web dashboard for managing SACCO (Savings and Credit Cooperative Organization) operations. Built with React 18, TypeScript, and Tailwind CSS.

## 🎯 Features

- **Dashboard**: Real-time stats, charts, and key metrics
- **Member Management**: Add, view, update, and manage member profiles
- **Loan Management**: Track loan applications, approvals, and repayments
- **Contribution Tracking**: Record and monitor member contributions
- **Financial Reports**: Generate and view financial statements
- **Authentication**: Secure login with JWT token support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Uses React Query for efficient data management

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn)
- Backend API running on `http://localhost:8080`

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=SACCO Management System
VITE_APP_VERSION=1.0.0
```

### 3. Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Optimized build output will be in the `dist/` folder.

## 📁 Project Structure

```
sacco-project/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout/         # Page layout (sidebar, header)
│   ├── pages/              # Page components
│   │   ├── Auth/          # Login/authentication pages
│   │   ├── Dashboard/     # Dashboard pages
│   │   ├── Members/       # Member management pages
│   │   ├── Loans/         # Loan management pages
│   │   ├── Contributions/ # Contribution pages
│   │   └── Reports/       # Report pages
│   ├── services/          # API service layer
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Fast build tool |
| **Tailwind CSS** | Styling |
| **React Router** | Navigation |
| **Axios** | HTTP client |
| **React Query** | Data fetching & caching |
| **Recharts** | Data visualization |
| **React Hook Form** | Form management |

## 🔐 Authentication

The system uses JWT token-based authentication:

1. User logs in with credentials at `/login`
2. Backend returns a JWT token
3. Token is stored in localStorage
4. Token is automatically included in all API requests
5. Expired tokens trigger automatic redirect to login

### Demo Credentials
```
Username: admin
Password: password123
```

## 📱 Pages & Features

### Dashboard (`/dashboard`)
- Summary statistics (members, loans, contributions)
- Charts showing trends
- Pending approvals count
- Financial overview

### Members (`/members`)
- View all members
- Search and filter
- Add new members
- View member details
- Edit member information

### Loans (`/loans`)
- Loan applications list
- Approval workflow
- Repayment tracking
- Default rate monitoring

### Contributions (`/contributions`)
- Record contributions
- View contribution history
- Payment status tracking
- Reports by member

### Reports (`/reports`)
- Generate financial reports
- Monthly/annual summaries
- Export to PDF/Excel
- Charts and analytics

## 🔌 API Integration

All API calls go through a centralized service layer in `src/services/`:

```typescript
// Example: Fetch members
import { memberService } from '@/services/memberService'

const { data, isLoading } = useQuery({
  queryKey: ['members'],
  queryFn: () => memberService.getMembers(1, 10),
})
```

## 🎯 Component Development

### Creating a New Page

1. Create a file in `src/pages/`
2. Create the component with TypeScript
3. Import in `App.tsx` and add route
4. Use API services for data fetching

Example:
```typescript
import { useQuery } from '@tanstack/react-query'
import { memberService } from '@/services/memberService'

export default function MyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: () => memberService.getMembers(),
  })

  return <div>Content</div>
}
```

## 📦 Dependency Management

### Add a Package
```bash
npm install package-name
```

### Update Packages
```bash
npm update
```

### Remove a Package
```bash
npm uninstall package-name
```

## 🐛 Troubleshooting

### Issue: API connection fails
**Solution**: Ensure backend is running on `http://localhost:8080` and check `VITE_API_BASE_URL` in `.env`

### Issue: TypeScript errors
**Solution**: Run `npm run type-check` to see all type issues

### Issue: Build fails
**Solution**: 
- Clear cache: `rm -rf node_modules dist .vite`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### Issue: Port 5173 already in use
**Solution**: 
- Edit `vite.config.ts` to change the port
- Or kill the process using the port

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Vite Guide](https://vitejs.dev/guide/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📝 Code Style

- Use TypeScript strict mode
- Follow React best practices
- Use meaningful component and variable names
- Keep components small and focused
- Write comments for complex logic
- Use Tailwind CSS utility classes

## 🚢 Deployment

### Build
```bash
npm run build
```

### Deploy
The `dist/` folder contains production-ready files. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

Example Vercel deployment:
```bash
npm install -g vercel
vercel
```

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the CLAUDE.md file for detailed documentation
3. Check the backend API logs
4. Create an issue in the repository

## 🎉 Getting Started

Ready to start development?

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173 in your browser
```

Happy coding! 🚀

---

## ☁️ Deploying to Vercel

This project is configured for one-click Vercel deployment. The
`vercel.json` already sets up SPA rewrites (so React Router works) and
long-cache headers for the built assets.

### From GitHub → Vercel (recommended)

1. **Push to GitHub** — see `DEPLOY.md` for the exact commands.
2. Go to <https://vercel.com/new>, click **Import Git Repository**, and
   pick your `sacco-project` repo.
3. Vercel auto-detects Vite. Leave the build settings alone.
4. **Add environment variables** (Settings → Environment Variables):
   ```
   VITE_SUPABASE_URL       = https://<your-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY  = sb_publishable_...
   ```
5. Click **Deploy**. Your dashboard will be live at
   `https://<project>.vercel.app` in ~60 seconds.

Every subsequent `git push` to `main` triggers an automatic redeploy.

### Or via the Vercel CLI

```bash
npm i -g vercel
vercel              # first deploy — pick the project, accept defaults
vercel --prod       # promote to production
```

Don't forget to add the env vars with:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```
