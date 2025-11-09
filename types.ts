export type FileCategory =
  | 'Image'
  | 'Video'
  | 'Audio'
  | 'Document'
  | 'Archive'
  | 'Font'
  | 'Style'
  | 'Script'
  | 'Code'
  | 'Model3D'
  | 'Data'
  | 'Executable'
  | 'Other';

export interface FileItem {
  url: string;
  name: string;
  type: FileCategory;
  size: number; // in bytes
}

export type FilterType =
  | 'all'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'font'
  | 'style'
  | 'script'
  | 'code'
  | 'model3d'
  | 'data'
  | 'executable'
  | 'other';

export interface ScanPreferences {
  // Selected file categories
  categories: FileCategory[];

  // File size filters (in bytes, 0 = no limit)
  minSize: number;
  maxSize: number;

  // Whether to remember these preferences
  rememberPreferences: boolean;
}

export interface ScanPreset {
  name: string;
  description: string;
  categories: FileCategory[];
}

export interface UserData {
  userId: string;
  isProUser: boolean;
  scanCredits: number;
}
