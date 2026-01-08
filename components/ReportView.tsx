import React from 'react';
import { AnalysisReport } from '../types';
import NewsItemRow from './NewsItemRow';
import NewsItemCard from './NewsItemCard';
import { Copy, RefreshCw, Calendar, FileText, TrendingUp } from 'lucide-react';

interface ReportViewProps {
  report: AnalysisReport;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onRefresh, isRefreshing }) => {
  
  const handleCopyMarkdown = () => {
    const markdown = `
# 📊 Monitor Agroexportador Perú - ${report.date}

*${report.marketStatusSummary}*

## Tabla de Impacto

| Semáforo | Categoría | Titular y Análisis Breve | Impacto |
| :---: | :---: | :--- | :---: |
${report.items.map(item => `| ${item.sentiment} | *${item.category}* | **[${item.title}](${item.url})**<br>_Resumen:_ ${item.summary} | ${item.impactLevel} |`).join('\n')}

## Conclusión Visual

* **💡 Top Insight:** ${report.topInsight}
* **🚀 Acción sugerida:** ${report.suggestedAction}
    `;
    
    navigator.clipboard.writeText(markdown.trim());
    alert('Reporte copiado al portapapeles.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* HEADER + SUMMARY CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar size={14} />
                <span className="text-xs font-medium uppercase tracking-wide">{report.date}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Resumen Ejecutivo
              </h2>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <button
                onClick={handleCopyMarkdown}
                className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
              >
                <Copy size={16} />
                <span className="sm:inline">Copiar</span>
              </button>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? 'Actualizando' : 'Actualizar'}
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-slate-800 text-base leading-relaxed font-medium">
              {report.marketStatusSummary}
            </p>
          </div>
        </div>
      </div>

      {/* TOP INSIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
            <FileText size={64} />
          </div>
          <div className="relative z-10">
            <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 mb-2">
              Insight Clave
            </span>
            <p className="text-amber-900 font-semibold text-lg leading-snug">
              {report.topInsight}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <TrendingUp size={64} />
          </div>
          <div className="relative z-10">
            <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 mb-2">
              Recomendación
            </span>
            <p className="text-emerald-900 font-semibold text-lg leading-snug">
              {report.suggestedAction}
            </p>
          </div>
        </div>
      </div>

      {/* MONITOR SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-800">Monitor de Noticias</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {report.items.length} items
          </span>
        </div>

        {/* DESKTOP VIEW: TABLE */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-32">
                    Categoría
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Análisis
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                    Impacto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {report.items.length > 0 ? (
                  report.items.map((item, index) => (
                    <NewsItemRow key={index} item={item} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Sin novedades relevantes hoy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE VIEW: CARDS */}
        <div className="md:hidden">
          {report.items.length > 0 ? (
            report.items.map((item, index) => (
              <NewsItemCard key={index} item={item} />
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
              Sin novedades relevantes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportView;