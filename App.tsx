import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportView from './components/ReportView';
import { AnalysisReport } from './types';
import { fetchAgroReport } from './services/geminiService';
import { Loader2, Search } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAgroReport();
      setReport(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load effect optional, but let's wait for user interaction or load immediately?
  // User instructions imply "When user enters or clicks update". Let's load on mount.
  useEffect(() => {
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
             <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">!</div>
             <p>{error}</p>
             <button onClick={handleUpdate} className="ml-auto text-sm font-semibold hover:underline">Reintentar</button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
                 <span className="text-xl">🚜</span>
              </div>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-800">Rastreando información de mercado...</h2>
            <p className="mt-2 text-slate-500 text-center max-w-md">
              Analizando FreshPlaza, Infobae, Agraria.pe y Freshfruit en busca de oportunidades y riesgos para Perú.
            </p>
          </div>
        ) : !report && !hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Search size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Monitor de Inteligencia Comercial</h2>
            <p className="text-slate-500 mb-8 max-w-lg">
              Haga clic en "Actualizar Noticias" para iniciar el escaneo de portales agroexportadores y generar su infografía ejecutiva.
            </p>
            <button
              onClick={handleUpdate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Iniciar Rastreo
            </button>
          </div>
        ) : report ? (
          <ReportView 
            report={report} 
            onRefresh={handleUpdate} 
            isRefreshing={isLoading} 
          />
        ) : null}

      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Monitor Agroexportador Perú. Desarrollado con Inteligencia Artificial.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;