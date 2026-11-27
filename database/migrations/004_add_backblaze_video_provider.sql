ALTER TABLE lessons
  MODIFY COLUMN video_provider ENUM('youtube', 'vimeo', 'direct', 'backblaze') NULL;
