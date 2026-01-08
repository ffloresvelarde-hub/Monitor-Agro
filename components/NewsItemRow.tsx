import React from 'react';
import { NewsItem, Sentiment } from '../types';

interface NewsItemRowProps {
  item: NewsItem;
}

const NewsItemRow: React.FC<NewsItemRowProps> = ({ item }) => {
  const getSemaphoreColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.OPPORTUNITY:
        return 'bg-green-100 text-green-700 border-green-200';
      case Sentiment.RISK:
        return 'bg-red-100 text-red-700 border-red-200';
      case Sentiment.NEUTRAL:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    if (impact === 'Alta') return `${base} bg-slate-900 text-white`;
    if (impact === 'Media') return `${base} bg-slate-200 text-slate-800`;
    return `${base} bg-slate-100 text-slate-600`;
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-4 whitespace-nowrap text-center align-top">
        <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full border ${getSemaphoreColor(item.sentiment)} text-lg`}>
          {item.sentiment}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 align-top">
        {item.category}
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex flex-col gap-1">
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold hover:underline hover:text-blue-900 text-base"
          >
            {item.title}
          </a>
          <p className="text-sm text-slate-600 leading-relaxed italic">
            Resumen: {item.summary}
          </p>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center align-top">
        <span className={getImpactBadge(item.impactLevel)}>
          {item.impactLevel}
        </span>
      </td>
    </tr>
  );
};

export default NewsItemRow;