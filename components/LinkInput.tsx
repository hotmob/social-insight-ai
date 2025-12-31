import React, { useState } from 'react';
import { SocialPlatform } from '../types';

interface LinkInputProps {
  onAnalyze: (urls: string[]) => void;
  isLoading: boolean;
}

export const LinkInput: React.FC<LinkInputProps> = ({ onAnalyze, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    // Split by newlines or commas and clean up
    const urls = inputText
      .split(/[\n,]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0 && (url.startsWith('http') || url.startsWith('www')));

    if (urls.length > 0) {
      onAnalyze(urls);
    }
  };

  const handleSample = () => {
    const samples = [
      "https://www.youtube.com/@MrBeast",
      "https://www.instagram.com/nasa/",
      "https://www.tiktok.com/@khaby.lame"
    ];
    setInputText(samples.join('\n'));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        Add Profile Links
      </h2>
      
      <div className="mb-4">
        <textarea
          className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm resize-y"
          placeholder="Paste social media links here (one per line)...&#10;Example:&#10;https://www.youtube.com/@channelname&#10;https://www.tiktok.com/@username"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <button
          onClick={handleSample}
          className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
          disabled={isLoading}
        >
          Use sample links
        </button>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setInputText('')}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium w-full sm:w-auto"
            disabled={isLoading}
          >
            Clear
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputText.trim()}
            className={`px-6 py-2 rounded-lg text-white font-medium shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto
              ${isLoading || !inputText.trim() 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Start Analysis
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};