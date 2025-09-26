import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppStateProvider, useAppStateContext } from '@/context/AppStateContext';
import { ThemeProvider } from '@/hooks/use-theme';
import { Loader2 } from 'lucide-react';
import { AppRoutes } from '@/routes';
import { GlobalCommand } from '@/components/GlobalCommand';
import LandingPage from './pages/LandingPage';
import BetaFeedbackForm from './components/BetaFeedbackForm';

// App-Logik ohne AuthProvider
const AppContent = () => {
  const { state, actions } = useAppStateContext();
  const { isLoading, isCommandOpen, coachees, sessions, invoices, generalDocuments, sessionNotes, recurringInvoices, activePackages, journalEntries, settings } = state;
  const { setCommandOpen, getAllCoacheeDocuments } = actions;

  if (isLoading) {
    const logoUrl = settings?.company?.logoUrl;
    const companyName = settings?.company?.name || 'Coachingspace';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        {logoUrl ? (
          <img src={logoUrl} alt={`${companyName} Logo`} className="h-16 w-auto mb-4" />
        ) : (
          <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl mb-4">C</div>
        )}
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="text-lg text-gray-300">Coachingspace wird geladen...</p>
        <p className="text-sm text-gray-400 mt-2">Bitte warte kurz, während deine Daten bereitgestellt werden.</p>
      </div>
    );
  }

  const allDocs = [
    ...(getAllCoacheeDocuments() || []),
    ...(generalDocuments || []),
    ...(sessionNotes || [])
  ];

  const allInvoices = [
    ...(invoices || []),
    ...(recurringInvoices || []),
    ...(activePackages || [])
  ];

  return (
    <>
      <GlobalCommand
        open={isCommandOpen}
        setOpen={setCommandOpen}
        coachees={coachees || []}
        sessions={sessions || []}
        invoices={allInvoices}
        documents={allDocs}
        journalEntries={journalEntries || []}
      />
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Beta Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Beta Feedback */}
          <Route path="/beta-feedback" element={<BetaFeedbackForm />} />
          
          {/* App Routes */}
          <Route path="/app/*" element={<AppRoutes />} />
        </Routes>
        <Toaster />
        
        {/* Beta Feedback Button - nur in der App */}
        {window.location.pathname.startsWith('/app') && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => window.open('/beta-feedback', '_blank')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Beta-Feedback
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Haupt-App ohne AuthProvider
const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="coaching-theme">
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  </ThemeProvider>
);

export default App;