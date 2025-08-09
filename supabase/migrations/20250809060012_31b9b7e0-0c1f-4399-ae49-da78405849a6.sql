-- Enable RLS on storage.objects (safe if already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow users to INSERT files into their own folder within the 'user-uploads' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Users can insert to user-uploads in own folder'
  ) THEN
    CREATE POLICY "Users can insert to user-uploads in own folder"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'user-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Allow users to SELECT (read/list) their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Users can read from user-uploads own folder'
  ) THEN
    CREATE POLICY "Users can read from user-uploads own folder"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'user-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Allow users to UPDATE metadata on their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Users can update user-uploads own files'
  ) THEN
    CREATE POLICY "Users can update user-uploads own files"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'user-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
      bucket_id = 'user-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Allow users to DELETE their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Users can delete user-uploads own files'
  ) THEN
    CREATE POLICY "Users can delete user-uploads own files"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'user-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;