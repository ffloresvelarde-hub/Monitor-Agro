export enum Sentiment {
  OPPORTUNITY = '🟢', // Green
  NEUTRAL = '🟡',     // Yellow
  RISK = '🔴'         // Red
}

export enum Category {
  LOGISTICA = 'Logística',
  MERCADO = 'Mercado',
  CULTIVO = 'Cultivo'
}

export enum ImpactLevel {
  ALTA = 'Alta',
  MEDIA = 'Media',
  BAJA = 'Baja'
}

export interface NewsItem {
  sentiment: Sentiment;
  category: Category;
  title: string;
  url: string;
  summary: string;
  impactLevel: ImpactLevel;
}

export interface AnalysisReport {
  date: string;
  marketStatusSummary: string;
  items: NewsItem[];
  topInsight: string;
  suggestedAction: string;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  report: AnalysisReport | null;
}