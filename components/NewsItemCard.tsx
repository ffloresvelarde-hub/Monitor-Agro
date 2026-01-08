import React from 'react';
import { NewsItem, Sentiment } from '../types';
import { ExternalLink, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface NewsItemCardProps {
  item: NewsItem;
}

const NewsItemCard: React.FC<NewsItemCardProps> = ({ item }) => {
  const getBorderColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.OPPORTUNITY: return 'border-l-green-500';
      case Sentiment.RISK: return 'border-l-red-500';
      case Sentiment.NEUTRAL: return 'border-l-yellow-400';
      default: return 'border-l-slate-300';
    }
  };

  const getImpactStyle = (impact: string) => {
    if (impact === 'Alta') return 'bg-slate-900 text-white';
    if (impact === 'Media') return 'bg-slate-200 text-slate-800';
    return 'bg-slate-100 text-slate-600';
  };

  const getIcon = (sentiment: Sentiment) => {
     switch (sentiment) {
      case Sentiment.OPPORTUNITY: return <TrendingUp size={16} className="text-green-600" />;
      case Sentiment.RISK: return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Info size={16} className="text-yellow-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 border-l-4 p-4 mb-3 ${getBorderColor(item.sentiment)}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getIcon(item.sentiment)}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {item.category}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getImpactStyle(item.impactLevel)}`}>
          {item.impactLevel}
        </span>
      </div>
      
      <a 
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <h4 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 leading-snug mb-2 flex items-start justify-between gap-2">
          {item.title}
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </h4>
      </a>

      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2 mt-2">
        {item.summary}
      </p>
    </div>
  );
};

export default NewsItemCard;