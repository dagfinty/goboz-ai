import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserUpload {
  id: string;
  title: string;
  content_type: string;
  file_url: string | null;
  upload_status: string;
  created_at: string;
  duration_minutes?: number;
}

export const useUserUploads = () => {
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchUploads = async () => {
    if (!user) {
      setUploads([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('user_id', user.id)
        .eq('upload_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching uploads:', error);
        setUploads([]);
      } else {
        setUploads(data || []);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setUploads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [user]);

  const hasUploads = uploads.length > 0;

  return { uploads, isLoading, hasUploads, refetch: fetchUploads };
};