import { RouterProvider } from 'react-router';
import { router } from './routes';

// NP Hochbau GmbH - Main App Entry Point
// Updated: force clean module graph rebuild
export default function App() {
  return <RouterProvider router={router} />;
}
