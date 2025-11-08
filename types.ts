export interface FileItem {
  url: string;
  name: string;
  type: 'Image' | 'Video' | 'Audio' | 'Document' | 'Archive' | 'Other';
  size: number; // in bytes
}

export type FilterType = 'all' | 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface UserData {
  userId: string;
  isProUser: boolean;
  scanCredits: number;
}
