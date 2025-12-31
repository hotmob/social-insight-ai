export interface SocialProfileAnalysis {
  url: string;
  accountName: string;
  followerCount: string;
  contentKeywords: string;
  avgViewsRecent: string;
  genderRatio: string;
  genderReasoning: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  errorMessage?: string;
}

export enum SocialPlatform {
  YOUTUBE = 'YouTube',
  TIKTOK = 'TikTok',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  UNKNOWN = 'Unknown'
}

// Global declaration for XLSX loaded via script tag
declare global {
  interface Window {
    XLSX: any;
  }
}