import { GoogleGenAI, Type } from "@google/genai";
import { SocialProfileAnalysis } from "../types";

// Helper to determine platform from URL
const getPlatformFromUrl = (url: string): string => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
  if (url.includes('instagram.com')) return 'Instagram';
  return 'Social Media';
};

export const analyzeSocialLink = async (url: string): Promise<Partial<SocialProfileAnalysis>> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const platform = getPlatformFromUrl(url);

    const prompt = `
      You are an expert social media analyst. Your task is to analyze the following ${platform} profile link using Google Search to find the most current public data.
      
      Target URL: ${url}
      
      Please find or estimate the following information:
      1. Account Name (The display name of the channel/profile).
      2. Follower/Subscriber Count (e.g., "1.2M", "500K").
      3. Content Keywords:
         - If gaming: Name the specific game(s) (e.g., "Minecraft", "Genshin Impact"). If varied, summarize the style (e.g., "Variety Gaming", "FPS Highlights").
         - If non-gaming: Summarize the niche (e.g., "Beauty & Makeup", "Automotive Reviews", "Lifestyle Vlog").
      4. Average Views of Last 5 Videos: Estimate the average view count for recent videos based on available search data or recent activity tracking sites.
      5. Audience Gender Ratio: Analyze the content style, comment sections (if summaries are available in search), and typical demographics for this niche. Provide an estimated ratio (e.g., "Male 60% / Female 40%").
      6. Gender Reasoning: Briefly explain why you estimated this ratio (e.g., "Makeup tutorials typically attract a female-majority audience", "Comments discuss men's fashion").

      Use the Google Search tool to ensure data is up-to-date.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using Pro for better reasoning on gender/content analysis
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accountName: { type: Type.STRING },
            followerCount: { type: Type.STRING },
            contentKeywords: { type: Type.STRING },
            avgViewsRecent: { type: Type.STRING },
            genderRatio: { type: Type.STRING },
            genderReasoning: { type: Type.STRING },
          },
          required: ["accountName", "followerCount", "contentKeywords", "avgViewsRecent", "genderRatio", "genderReasoning"],
        },
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(textResponse);

    return {
      url,
      accountName: data.accountName || "Unknown",
      followerCount: data.followerCount || "N/A",
      contentKeywords: data.contentKeywords || "Uncategorized",
      avgViewsRecent: data.avgViewsRecent || "N/A",
      genderRatio: data.genderRatio || "Unknown",
      genderReasoning: data.genderReasoning || "",
    };

  } catch (error) {
    console.error("Error analyzing link:", error);
    throw error;
  }
};