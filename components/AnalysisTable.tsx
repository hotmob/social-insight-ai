import React from 'react';
import { SocialProfileAnalysis } from '../types';

interface AnalysisTableProps {
  data: SocialProfileAnalysis[];
  onRemove: (index: number) => void;
}

export const AnalysisTable: React.FC<AnalysisTableProps> = ({ data, onRemove }) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">Analysis Results ({data.length})</h3>
        <span className="text-xs text-slate-500">Gender ratio estimated via content/comments analysis</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Account</th>
              <th className="px-6 py-4">Platform / URL</th>
              <th className="px-6 py-4">Followers</th>
              <th className="px-6 py-4">Content / Niche</th>
              <th className="px-6 py-4">Avg Views (Last 5)</th>
              <th className="px-6 py-4">Est. Gender Ratio</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr key={`${item.url}-${index}`} className="hover:bg-slate-50 transition-colors group">
                {/* Account Name */}
                <td className="px-6 py-4 font-medium text-slate-900">
                   {item.status === 'loading' ? (
                     <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                   ) : item.status === 'error' ? (
                     <span className="text-red-500">Failed to load</span>
                   ) : (
                     item.accountName
                   )}
                </td>

                {/* URL */}
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    <span className="truncate">{item.url}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </td>

                {/* Followers */}
                <td className="px-6 py-4 text-slate-700">
                   {item.status === 'loading' ? (
                     <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                   ) : (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                       {item.followerCount}
                     </span>
                   )}
                </td>

                {/* Content */}
                <td className="px-6 py-4 text-slate-700 max-w-xs">
                  {item.status === 'loading' ? (
                     <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                   ) : (
                     item.contentKeywords
                   )}
                </td>

                {/* Avg Views */}
                <td className="px-6 py-4 text-slate-700">
                   {item.status === 'loading' ? (
                     <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                   ) : (
                     item.avgViewsRecent
                   )}
                </td>

                {/* Gender Ratio */}
                <td className="px-6 py-4 text-slate-700">
                   {item.status === 'loading' ? (
                     <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                   ) : (
                     <div className="flex flex-col">
                        <span>{item.genderRatio}</span>
                        {item.genderReasoning && (
                          <span className="text-[10px] text-slate-400 mt-1 line-clamp-2" title={item.genderReasoning}>
                            {item.genderReasoning}
                          </span>
                        )}
                     </div>
                   )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onRemove(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                    title="Remove row"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};