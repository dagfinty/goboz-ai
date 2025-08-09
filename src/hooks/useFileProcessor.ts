import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProcessedFile {
  name: string;
  type: string;
  content: string;
  summary?: string;
  uploadId?: string;
}

export const useFileProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const processFile = async (file: File): Promise<ProcessedFile | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type and size
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are supported (max 20MB)",
        variant: "destructive",
      });
      return null;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      toast({
        title: "File too large",
        description: "PDF files must be 20MB or smaller",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);
    
    try {
      // Upload to Supabase Storage first
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Create user_uploads record
      const { data: uploadRecord, error: recordError } = await supabase
        .from('user_uploads')
        .insert({
          user_id: user.id,
          title: file.name,
          content_type: 'pdf',
          file_url: uploadData.path,
          file_size: file.size,
          upload_status: 'processing'
        })
        .select()
        .single();

      if (recordError) {
        throw new Error(`Database error: ${recordError.message}`);
      }

      // Get storage URL for processing
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(uploadData.path);

      // Process PDF with Gemini
      const { data, error } = await supabase.functions.invoke('process-pdf', {
        body: {
          fileUrl: publicUrl,
          fileName: file.name,
          userId: user.id,
          uploadId: uploadRecord.id
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to process PDF');
      }

      // Update upload status
      await supabase
        .from('user_uploads')
        .update({ upload_status: 'completed' })
        .eq('id', uploadRecord.id);

      toast({
        title: "PDF processed successfully! 📄",
        description: `${file.name} has been analyzed by Gobez AI`,
      });

      return {
        name: file.name,
        type: file.type,
        content: data.content,
        summary: data.summary,
        uploadId: uploadRecord.id
      };
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process the file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const processYouTubeUrl = async (url: string): Promise<ProcessedFile | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to process YouTube videos",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);
    
    try {
      // Create user_uploads record first
      const { data: uploadRecord, error: recordError } = await supabase
        .from('user_uploads')
        .insert({
          user_id: user.id,
          title: `YouTube Video`,
          content_type: 'youtube',
          file_url: url,
          upload_status: 'processing'
        })
        .select()
        .single();

      if (recordError) {
        throw new Error(`Database error: ${recordError.message}`);
      }

      const { data, error } = await supabase.functions.invoke('process-youtube', {
        body: {
          youtubeUrl: url,
          userId: user.id,
          uploadId: uploadRecord.id
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to process YouTube video');
      }

      // Update upload record with title and duration
      await supabase
        .from('user_uploads')
        .update({ 
          title: `YouTube Video (${data.duration} min)`,
          duration_minutes: data.duration,
          upload_status: 'completed'
        })
        .eq('id', uploadRecord.id);

      toast({
        title: "YouTube video processed! 🎥",
        description: `Video transcript extracted by Gobez AI`,
      });

      return {
        name: `YouTube Video (${data.duration} min)`,
        type: 'video/youtube',
        content: data.transcript,
        summary: data.summary,
        uploadId: uploadRecord.id
      };
    } catch (error) {
      console.error('YouTube processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process YouTube video. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processFile, processYouTubeUrl, isProcessing };
};