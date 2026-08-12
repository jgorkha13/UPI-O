import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { OfflineProvider } from './context/OfflineContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import AddMoney from './pages/AddMoney';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import ScanPay from './pages/ScanPay';
import Services from './pages/Services';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
        <Route path="/send" element={<ProtectedRoute><AppShell><SendMoney /></AppShell></ProtectedRoute>} />
        <Route path="/add-money" element={<ProtectedRoute><AppShell><AddMoney /></AppShell></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AppShell><TransactionHistory /></AppShell></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><AppShell><ScanPay /></AppShell></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><AppShell><Services /></AppShell></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function ThemedToast() {
  const { isDark } = useTheme();
  return (
    <ToastContainer
      position="top-center"
      autoClose={4000}
      hideProgressBar={false}
      theme={isDark ? 'dark' : 'light'}
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <OfflineProvider>
        <BrowserRouter>
          <ThemedToast />
          <AnimatedRoutes />
        </BrowserRouter>
      </OfflineProvider>
    </ThemeProvider>
  );
}

export default App;
