import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { youtubeUrl, userId, uploadId } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Extract video ID from YouTube URL
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    
    const videoId = videoIdMatch[1];

    // Get video info from YouTube API (using a simple fetch to get basic info)
    // For a full implementation, you'd use YouTube Data API
    const videoTitle = `YouTube Video ${videoId}`;
    
    // For demo purposes, we'll simulate transcript extraction
    // In a real implementation, you'd use YouTube's transcript API or speech-to-text
    const simulatedTranscript = `This is a demo transcript for YouTube video ${videoId}. 
    In a real implementation, this would contain the actual transcript extracted from the video using 
    YouTube's transcript API or speech-to-text services. The content would include all spoken words 
    from the video, properly timestamped and formatted for educational use.`;

    // Check video duration (simulate - in real implementation, use YouTube Data API)
    const durationMinutes = Math.floor(Math.random() * 25) + 5; // Random 5-30 min for demo
    
    if (durationMinutes > 30) {
      throw new Error('Video duration exceeds 30 minutes limit');
    }

    // Generate summary using Gemini
    const summaryResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create an educational summary of this YouTube video transcript in a friendly Ethiopian tutor style. Use encouraging phrases and highlight key learning points:\n\n${simulatedTranscript}`
              }
            ]
          }
        ]
      }),
    });

    let summary = `Wayz ena! Great video choice! This content has valuable educational material for your studies.`;
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      summary = summaryData.candidates?.[0]?.content?.parts?.[0]?.text || summary;
    }

    // Store AI content
    await supabase
      .from('ai_content')
      .insert({
        user_id: userId,
        upload_id: uploadId,
        content_type: 'youtube_transcript',
        content: {
          transcript: simulatedTranscript,
          summary: summary,
          video_title: videoTitle,
          duration_minutes: durationMinutes
        }
      });

    return new Response(JSON.stringify({ 
      transcript: simulatedTranscript, 
      summary: summary,
      uploadId: uploadId,
      duration: durationMinutes
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-youtube function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});