import React, { useState } from 'react';
import { FileItem } from '../types';
import {
  ImageIcon,
  VideoIcon,
  MusicIcon,
  DocumentIcon,
  ArchiveIcon,
  FontIcon,
  StyleIcon,
  ScriptIcon,
  CodeIcon,
  Model3DIcon,
  DataIcon,
  ExecutableIcon,
  OtherIcon
} from './icons';

interface FilePreviewProps {
  file: FileItem;
}

const getFileTypeIcon = (type: FileItem['type']): React.ReactElement => {
  const props = { className: "h-5 w-5" };
  switch (type) {
    case 'Image': return <ImageIcon {...props} />;
    case 'Video': return <VideoIcon {...props} />;
    case 'Audio': return <MusicIcon {...props} />;
    case 'Document': return <DocumentIcon {...props} />;
    case 'Archive': return <ArchiveIcon {...props} />;
    case 'Font': return <FontIcon {...props} />;
    case 'Style': return <StyleIcon {...props} />;
    case 'Script': return <ScriptIcon {...props} />;
    case 'Code': return <CodeIcon {...props} />;
    case 'Model3D': return <Model3DIcon {...props} />;
    case 'Data': return <DataIcon {...props} />;
    case 'Executable': return <ExecutableIcon {...props} />;
    default: return <OtherIcon {...props} />;
  }
};

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Only show image preview for Image type files
  const shouldShowImagePreview = file.type === 'Image' && !imageError;

  return (
    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded overflow-hidden bg-gray-700/50">
      {shouldShowImagePreview ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-500 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={file.url}
            alt={file.name}
            className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
            loading="lazy"
          />
        </>
      ) : (
        <div className="text-gray-400">
          {getFileTypeIcon(file.type)}
        </div>
      )}
    </div>
  );
};
