import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { AgendaView } from './components/agenda/AgendaView';
import WaitlistView from './components/agenda/WaitlistView';
import { BookingView } from './components/booking/BookingView';
import { ClientView } from './components/clientes/ClientView';
import { ServiceView } from './components/servicos/ServiceView';
import { ProfessionalView } from './components/profissionais/ProfessionalView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import LandingView from './components/landing/LandingView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrialBanner } from './components/layout/TrialBanner';
import { HardLockPaywall } from './components/shared/HardLockPaywall';

// --- Protected Dashboard Shell ---
function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // Kept for Sidebar highlights

  if (!isAuthenticated) return <Navigate to="/login" />;

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Estratégico';
      case 'agenda': return 'Agenda Inteligente';
      case 'waitlist': return 'Fila de Espera (Encaixes)';
      case 'clientes': return 'Clientes & Espera';
      case 'servicos': return 'Catálogo de Serviços';
      case 'profissionais': return 'Profissionais';
      case 'configuracoes': return 'Configurações do Salão';
      default: return 'Sistema de Agendamento';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <HardLockPaywall />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
        <TrialBanner />
        <Header title={getTitle()} />
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Main App Root ---
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          {/* Public SaaS Client Booking Route */}
          <Route path="/agendar/:slug" element={<BookingView />} />

          {/* Public Landing Site */}
          <Route path="/" element={<LandingView />} />

          {/* Private Admin Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="agenda" element={<AgendaView />} />
            <Route path="waitlist" element={<WaitlistView />} />
            <Route path="clientes" element={<ClientView />} />
            <Route path="servicos" element={<ServiceView />} />
            <Route path="profissionais" element={<ProfessionalView />} />
            <Route path="configuracoes" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
