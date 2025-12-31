import React, { useState, useCallback } from 'react';
import { SocialProfileAnalysis } from './types';
import { analyzeSocialLink } from './services/geminiService';
import { LinkInput } from './components/LinkInput';
import { AnalysisTable } from './components/AnalysisTable';

const App: React.FC = () => {
  const [results, setResults] = useState<SocialProfileAnalysis[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const handleAnalyze = useCallback(async (urls: string[]) => {
    setIsProcessing(true);
    setTotalCount(urls.length);
    setCompletedCount(0);

    // Initialize placeholders
    const newItems: SocialProfileAnalysis[] = urls.map(url => ({
      url,
      accountName: '',
      followerCount: '',
      contentKeywords: '',
      avgViewsRecent: '',
      genderRatio: '',
      genderReasoning: '',
      status: 'pending'
    }));

    // Prepend new items to results
    setResults(prev => [...newItems, ...prev]);

    // Process sequentially to manage rate limits and updates
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      // Update status to loading
      setResults(prev => prev.map(item => 
        item.url === url && item.status === 'pending' 
          ? { ...item, status: 'loading' } 
          : item
      ));

      try {
        const analysis = await analyzeSocialLink(url);
        
        // Update with success data
        setResults(prev => prev.map(item => 
          item.url === url 
            ? { ...item, ...analysis, status: 'completed' } 
            : item
        ));
      } catch (error) {
        // Update with error
        setResults(prev => prev.map(item => 
          item.url === url 
            ? { ...item, status: 'error', errorMessage: 'Failed to analyze' } 
            : item
        ));
      } finally {
        setCompletedCount(prev => prev + 1);
      }
    }

    setIsProcessing(false);
  }, []);

  const handleRemove = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    if (typeof window.XLSX === 'undefined') {
      alert("Export library is loading, please try again in a moment.");
      return;
    }

    // Filter only completed items for export
    const exportData = results
      .filter(r => r.status === 'completed')
      .map(r => ({
        "Platform URL": r.url,
        "Account Name": r.accountName,
        "Followers": r.followerCount,
        "Content Keywords/Style": r.contentKeywords,
        "Avg Views (Last 5)": r.avgViewsRecent,
        "Gender Ratio": r.genderRatio,
        "Gender Analysis Reasoning": r.genderReasoning
      }));

    if (exportData.length === 0) {
      alert("No completed analysis data to export.");
      return;
    }

    const ws = window.XLSX.utils.json_to_sheet(exportData);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Social_Analysis");
    
    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    window.XLSX.writeFile(wb, `social_analysis_report_${date}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Social Insight AI</h1>
          </div>
          
          {results.some(r => r.status === 'completed') && (
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="-ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              Export Excel
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Audience & Content Analysis</h2>
            <p className="text-slate-600 text-lg">
              Paste profile links from YouTube, TikTok, Facebook, or Instagram. 
              Our AI searches live data to extract stats, content keywords, and estimate demographics.
            </p>
          </div>
          
          <LinkInput onAnalyze={handleAnalyze} isLoading={isProcessing} />
        </div>

        {/* Progress Bar for Bulk Processing */}
        {isProcessing && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Processing links...</span>
              <span>{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <AnalysisTable data={results} onRemove={handleRemove} />
      </main>
    </div>
  );
};

export default App;