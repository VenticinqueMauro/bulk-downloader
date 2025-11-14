import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileItemRow } from '../../components/FileItemRow';
import { FileItem } from '../../types';

describe('FileItemRow', () => {
  const mockFile: FileItem = {
    url: 'https://example.com/test-file.pdf',
    name: 'Test Document.pdf',
    type: 'Document',
    size: 1024000, // 1 MB
  };

  let onToggleSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onToggleSelect = vi.fn();
    (global.chrome.downloads.download as any).mockClear();
    global.alert = vi.fn();
  });

  describe('Rendering', () => {
    it('should render file name', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      expect(screen.getByText('Test Document.pdf')).toBeInTheDocument();
    });

    it('should render file size in human-readable format', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      expect(screen.getByText('1000 KB')).toBeInTheDocument();
    });

    it('should render N/A for zero file size', () => {
      const fileWithNoSize: FileItem = { ...mockFile, size: 0 };

      render(
        <FileItemRow
          file={fileWithNoSize}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should render file type badge', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      expect(screen.getByText('Document')).toBeInTheDocument();
    });

    it('should render checkbox', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should render file link with correct href', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const link = screen.getByRole('link', { name: 'Test Document.pdf' });
      expect(link).toHaveAttribute('href', 'https://example.com/test-file.pdf');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('Selection State', () => {
    it('should show checked checkbox when selected', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={true}
          onToggleSelect={onToggleSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('should show unchecked checkbox when not selected', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('should apply selected background color when selected', () => {
      const { container } = render(
        <FileItemRow
          file={mockFile}
          isSelected={true}
          onToggleSelect={onToggleSelect}
        />
      );

      const row = container.firstChild as HTMLElement;
      expect(row).toHaveClass('bg-sky-900/30');
    });
  });

  describe('Interactions', () => {
    it('should call onToggleSelect when clicking the row', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const row = screen.getByText('Test Document.pdf').closest('div')?.parentElement;
      if (row) {
        fireEvent.click(row);
        expect(onToggleSelect).toHaveBeenCalledTimes(1);
      }
    });

    it('should call onToggleSelect when clicking the checkbox', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      // Click instead of change event, as the checkbox onChange handler calls onToggleSelect
      fireEvent.click(checkbox);
      expect(onToggleSelect).toHaveBeenCalled();
    });

    it('should not toggle selection when clicking the file link', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      // Should not call toggle (event.stopPropagation prevents it)
      expect(onToggleSelect).not.toHaveBeenCalled();
    });
  });

  describe('Download Functionality', () => {
    it('should download file when clicking download button', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const downloadButton = screen.getByTitle('Download file');
      fireEvent.click(downloadButton);

      expect(chrome.downloads.download).toHaveBeenCalledWith({
        url: 'https://example.com/test-file.pdf',
        filename: 'Test Document.pdf',
      });
    });

    it('should sanitize filename when downloading', () => {
      const fileWithBadName: FileItem = {
        ...mockFile,
        name: 'File:With*Invalid?Characters.pdf',
      };

      render(
        <FileItemRow
          file={fileWithBadName}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const downloadButton = screen.getByTitle('Download file');
      fireEvent.click(downloadButton);

      expect(chrome.downloads.download).toHaveBeenCalledWith({
        url: 'https://example.com/test-file.pdf',
        filename: 'File_With_Invalid_Characters.pdf',
      });
    });

    it('should add extension from URL if filename lacks extension', () => {
      const fileWithoutExt: FileItem = {
        ...mockFile,
        name: 'Document Without Extension',
      };

      render(
        <FileItemRow
          file={fileWithoutExt}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const downloadButton = screen.getByTitle('Download file');
      fireEvent.click(downloadButton);

      expect(chrome.downloads.download).toHaveBeenCalledWith({
        url: 'https://example.com/test-file.pdf',
        filename: 'Document Without Extension.pdf',
      });
    });

    it('should not trigger selection when clicking download button', () => {
      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const downloadButton = screen.getByTitle('Download file');
      fireEvent.click(downloadButton);

      expect(onToggleSelect).not.toHaveBeenCalled();
    });

    it('should show alert when chrome.downloads is not available', () => {
      const originalChrome = global.chrome;
      (global as any).chrome = undefined;

      render(
        <FileItemRow
          file={mockFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      const downloadButton = screen.getByTitle('Download file');
      fireEvent.click(downloadButton);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Download failed')
      );

      (global as any).chrome = originalChrome;
    });
  });

  describe('File Type Icons and Colors', () => {
    const fileTypes: Array<{ type: FileItem['type']; label: string }> = [
      { type: 'Image', label: 'Image' },
      { type: 'Video', label: 'Video' },
      { type: 'Audio', label: 'Audio' },
      { type: 'Document', label: 'Document' },
      { type: 'Archive', label: 'Archive' },
      { type: 'Font', label: 'Font' },
      { type: 'Style', label: 'Style' },
      { type: 'Script', label: 'Script' },
      { type: 'Code', label: 'Code' },
      { type: 'Model3D', label: 'Model3D' },
      { type: 'Data', label: 'Data' },
      { type: 'Executable', label: 'Executable' },
      { type: 'Other', label: 'Other' },
    ];

    it.each(fileTypes)('should render $type file type correctly', ({ type, label }) => {
      const typedFile: FileItem = { ...mockFile, type };

      render(
        <FileItemRow
          file={typedFile}
          isSelected={false}
          onToggleSelect={onToggleSelect}
        />
      );

      expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('should render appropriate icon for each file type', () => {
      fileTypes.forEach(({ type }) => {
        const { container } = render(
          <FileItemRow
            file={{ ...mockFile, type }}
            isSelected={false}
            onToggleSelect={onToggleSelect}
          />
        );

        // Should have an SVG icon
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('File Size Formatting', () => {
    it('should format bytes correctly', () => {
      const sizes = [
        { bytes: 0, expected: 'N/A' },
        { bytes: 500, expected: '500 Bytes' },
        { bytes: 1024, expected: '1 KB' },
        { bytes: 1048576, expected: '1 MB' },
        { bytes: 1073741824, expected: '1 GB' },
        { bytes: 1536, expected: '1.5 KB' },
      ];

      sizes.forEach(({ bytes, expected }) => {
        const fileWithSize: FileItem = { ...mockFile, size: bytes };

        const { container } = render(
          <FileItemRow
            file={fileWithSize}
            isSelected={false}
            onToggleSelect={onToggleSelect}
          />
        );

        expect(container.textContent).toContain(expected);
      });
    });
  });
});
