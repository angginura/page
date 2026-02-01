import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import LoginForm from './components/LoginForm';
import ChangePasswordModal from './components/ChangePasswordModal';
import { generateExamContent } from './services/geminiService';
import { ExamParams } from './types';
import { GraduationCap, AlertCircle, Settings, LogOut } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  // Password State Management with LocalStorage persistence
  const [currentPassword, setCurrentPassword] = useState(() => {
    return localStorage.getItem('app_password') || "P4ssWord";
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (password: string) => {
    if (password === currentPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setGeneratedContent(null);
  };

  const handlePasswordChange = (newPassword: string) => {
    setCurrentPassword(newPassword);
    localStorage.setItem('app_password', newPassword);
  };

  const handleFormSubmit = async (data: ExamParams) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    
    try {
      const result = await generateExamContent(data);
      setGeneratedContent(result);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak terduga.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loginError={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">EduGen AI</h1>
              <p className="text-xs text-gray-500 font-medium">Asisten Pendidikan Nasional</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-sm text-gray-500 hidden sm:block mr-2">
              Evaluasi Kurikulum Merdeka
            </div>
            
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Ubah Kata Sandi"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className={`lg:col-span-4 ${generatedContent ? 'hidden lg:block' : 'lg:col-start-4 lg:col-span-6'} transition-all duration-300 no-print`}>
            <InputForm onSubmit={handleFormSubmit} isGenerating={isLoading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Result */}
          {generatedContent && (
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResultDisplay content={generatedContent} />
            </div>
          )}
          
          {/* Welcome Placeholder State */}
          {!generatedContent && !isLoading && !error && (
            <div className="hidden lg:block lg:col-start-3 lg:col-span-8 text-center mt-12 text-gray-400">
               <p className="text-sm">Isi formulir di atas untuk mulai menyusun perangkat evaluasi.</p>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} EduGen AI. Dikembangkan oleh <strong>Irwan, S.Pd</strong>.</p>
        </div>
      </footer>

      {/* Password Change Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentPassword={currentPassword}
        onSave={handlePasswordChange}
      />
    </div>
  );
}

export default App;