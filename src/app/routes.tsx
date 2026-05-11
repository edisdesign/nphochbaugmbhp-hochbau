import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';

// Lazy load all route components for better code splitting & HMR resilience
const MainSite = lazy(() => import('./components/MainSite').then(m => ({ default: m.MainSite })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Loading fallback
function RouteLoader() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#F4B400]/30 border-t-[#F4B400] rounded-full animate-spin" />
        <span className="text-white/30 text-xs uppercase tracking-widest font-['Inter']">Loading...</span>
      </div>
    </div>
  );
}

// Wrap lazy component in Suspense
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SuspenseWrapper><MainSite /></SuspenseWrapper>,
  },
  {
    path: '/admin',
    element: <SuspenseWrapper><AdminLogin /></SuspenseWrapper>,
  },
  {
    path: '/admin/dashboard',
    element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>,
  },
]);
