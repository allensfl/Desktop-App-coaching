import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jlvmkfpjnqvtnqepmpsf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsdm1rZnBqbnF2dG5xZXBtcHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MzE3MjMsImV4cCI6MjA3MzUwNzcyM30.xdltEUoQC5zK6Im6NIJBBmHy2XzR36A9NoarPTwatbQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LandingPage = () => {
  const [availableSpots, setAvailableSpots] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    experience: '',
    coacheeCount: ''
  });

  // Load available spots
  const loadAvailableSpots = async () => {
    try {
      const { count, error } = await supabase
        .from('beta_users')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setAvailableSpots(Math.max(0, 10 - (count || 0)));
    } catch (err) {
      console.error('Error loading spots:', err);
      setAvailableSpots(8); // Fallback
    }
  };

  useEffect(() => {
    loadAvailableSpots();
  }, []);

  // Handle beta signup
  const handleBetaSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('beta_users')
        .select('email')
        .eq('email', formData.email);

      if (checkError) throw checkError;

      if (existingUsers && existingUsers.length > 0) {
        setError('Diese E-Mail-Adresse ist bereits registriert.');
        setLoading(false);
        return;
      }

      // Get current count for spot number
      const { count } = await supabase
        .from('beta_users')
        .select('*', { count: 'exact', head: true });

      const spotNumber = (count || 0) + 1;

      // Insert new beta user
      const { error: insertError } = await supabase
        .from('beta_users')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company,
          experience: formData.experience,
          coachee_count: formData.coacheeCount,
          beta_spot_number: spotNumber,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      loadAvailableSpots();

    } catch (err) {
      console.error('Signup error:', err);
      setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="max-w-lg mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Beta-Anmeldung erfolgreich!
          </h2>
          
          <p className="text-slate-300 mb-8">
            Willkommen bei CoachingSpace Beta! Du kannst jetzt die App erkunden.
          </p>
          
          <div className="space-y-4">
            <a 
              href="/app" 
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Zur CoachingSpace App
            </a>
            <div>
              <a 
                href="/" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Zurück zur Startseite
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">CoachingSpace</h1>
          <div className="text-slate-400 text-sm">
            Beta-Anmeldung erforderlich
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            CoachingSpace <span className="text-blue-400">Beta</span>
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Die All-in-One Plattform für professionelles Coaching
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Noch {availableSpots} Beta-Plätze verfügbar
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            Entdecke die CoachingSpace Platform
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <img 
                src="./screenshots/dashboard.png" 
                alt="Dashboard Übersicht" 
                className="w-full h-40 object-contain bg-slate-800 rounded-lg border border-slate-600 mb-3"
              />
              <h4 className="text-white font-medium">Dashboard Übersicht</h4>
              <p className="text-slate-400 text-sm">Coachee-Management & Task-Tracking</p>
            </div>
            
            <div className="text-center">
              <img 
                src="./screenshots/coaching-room.png" 
                alt="Coaching Room" 
                className="w-full h-40 object-contain bg-slate-800 rounded-lg border border-slate-600 mb-3"
              />
              <h4 className="text-white font-medium">🟢 Coaching Room</h4>
              <p className="text-slate-400 text-sm">Komplettes Remote-Cockpit</p>
            </div>
            
            <div className="text-center">
              <img 
                src="./screenshots/session-prep.png" 
                alt="Session Vorbereitung" 
                className="w-full h-40 object-contain bg-slate-800 rounded-lg border border-slate-600 mb-3"
              />
              <h4 className="text-white font-medium">Session-Planung</h4>
              <p className="text-slate-400 text-sm">Strukturierte Coaching-Ansätze</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">🎯 Hauptfeatures</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• Coachee-Verwaltung & Profile</li>
                <li>• Session-Dokumentation & Journal</li>
                <li>• Task-Management & Deadlines</li>
                <li>• 🟢 Coaching Room (Remote-Cockpit)</li>
                <li>• 🟣 Coachee-Portal (separater Zugang)</li>
                <li>• 🟡 KI-Assistent (geplant)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">💎 Beta-Vorteile</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Lebenslange Vollversion-Lizenz</strong></li>
                <li>• Wert: 99€/Monat (regulärer Preis)</li>
                <li>• Direkter Einfluss auf Entwicklung</li>
                <li>• Exklusiver Beta-Tester Status</li>
                <li>• Persönlicher Support</li>
                <li>• Alle zukünftigen Updates inklusive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Beta Signup Form */}
        <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Jetzt Beta-Tester werden
          </h2>

          <form onSubmit={handleBetaSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Vorname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nachname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-Mail-Adresse *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="max@beispiel.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unternehmen
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Coaching Praxis GmbH"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Coaching-Erfahrung
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="" disabled>Erfahrung wählen</option>
                  <option value="Neueinsteiger">Neueinsteiger</option>
                  <option value="1-2 Jahre">1-2 Jahre</option>
                  <option value="3-5 Jahre">3-5 Jahre</option>
                  <option value="5+ Jahre">5+ Jahre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Anzahl Coachees (optional)
                </label>
                <select
                  value={formData.coacheeCount}
                  onChange={(e) => setFormData({...formData, coacheeCount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="" disabled>Anzahl wählen</option>
                  <option value="1-5">1-5</option>
                  <option value="6-15">6-15</option>
                  <option value="16-30">16-30</option>
                  <option value="30+">30+</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || availableSpots === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Wird gesendet...' : `Beta-Platz reservieren (${availableSpots}/10)`}
            </button>
          </form>

          {/* Beta Bedingungen */}
          <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
              ⚠️ Wichtig: Bedingungen für kostenlose Vollversion
            </h4>
            <div className="text-slate-300 space-y-2">
              <p><strong>1. Intensive Testphase:</strong> Alle 7 Hauptbereiche gründlich testen (mindestens 2 Stunden)</p>
              <p><strong>2. Detailliertes Feedback:</strong> Strukturiertes Formular per E-Mail ausfüllen</p>
              <p><strong>3. Spezifische Anforderungen:</strong> Mindestens 3 Probleme + 3 Verbesserungsvorschläge</p>
            </div>
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                <strong>Warnung:</strong> Oberflächliches Feedback wie "App ist cool" berechtigt NICHT zur kostenlosen Vollversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;