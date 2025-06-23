
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/CommonUI';
import HomePage from './pages/HomePage';
import PanelComparisonPage from './pages/PanelComparisonPage';
import CalculatorsPage from './pages/CalculatorsPage';
import ServicesAndLeadsPage from './pages/ServicesAndLeadsPage';
import EcommercePage from './pages/EcommercePage';
import LoanAssistancePage from './pages/LoanAssistancePage'; 
import AuthPage from './pages/AuthPage';
import AiAssistantPage from './pages/AiAssistantPage';
import { useAuth } from './contexts/AuthContext';

// Admin Panel Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Optional: return a global loading spinner or a minimal layout
    // For now, returning null to prevent rendering routes before auth state is known
    // This can be improved with a dedicated loading screen
    return null; 
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare-panels" element={<PanelComparisonPage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/services" element={<ServicesAndLeadsPage />} />
            <Route path="/store/*" element={<EcommercePage />} />
            <Route path="/loans" element={<LoanAssistancePage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage />} />
            <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={user && user.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/auth" replace state={{ from: '/admin'}} />} 
            />
            <Route 
              path="/admin/users" 
              element={user && user.role === 'admin' ? <AdminUserManagementPage /> : <Navigate to="/auth" replace state={{ from: '/admin/users'}} />} 
            />
            {/* Add more admin routes here, e.g., /admin/products, /admin/orders */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
