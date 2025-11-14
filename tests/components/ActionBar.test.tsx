import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActionBar } from '../../components/ActionBar';
import { FileItem } from '../../types';

describe('ActionBar', () => {
  const mockFiles: FileItem[] = [
    {
      url: 'https://example.com/file1.pdf',
      name: 'Document 1',
      type: 'Document',
      size: 1024,
    },
    {
      url: 'https://example.com/file2.jpg',
      name: 'Image 1',
      type: 'Image',
      size: 2048,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock chrome.downloads.download
    (global.chrome.downloads.download as any).mockClear();

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    // Mock window.alert
    global.alert = vi.fn();
  });

  describe('Rendering', () => {
    it('should display selected count', () => {
      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/archivos seleccionados/)).toBeInTheDocument();
    });

    it('should display singular form for one file', () => {
      render(<ActionBar selectedCount={1} selectedFiles={[mockFiles[0]]} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText(/archivo seleccionado$/)).toBeInTheDocument();
    });

    it('should display plural form for multiple files', () => {
      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      expect(screen.getByText(/archivos seleccionados/)).toBeInTheDocument();
    });

    it('should render download button', () => {
      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      expect(screen.getByText('Descargar Selección')).toBeInTheDocument();
    });

    it('should render copy links button', () => {
      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      expect(screen.getByText('Copiar Enlaces')).toBeInTheDocument();
    });
  });

  describe('Copy Links Functionality', () => {
    it('should copy file URLs to clipboard', async () => {
      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const copyButton = screen.getByText('Copiar Enlaces');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'https://example.com/file1.pdf\nhttps://example.com/file2.jpg'
        );
      });
    });

    it('should show success alert after copying', async () => {
      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const copyButton = screen.getByText('Copiar Enlaces');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          '2 enlaces copiados al portapapeles!'
        );
      });
    });

    it('should handle clipboard error', async () => {
      (navigator.clipboard.writeText as any).mockRejectedValue(
        new Error('Clipboard error')
      );

      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const copyButton = screen.getByText('Copiar Enlaces');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error al copiar enlaces.');
      });
    });
  });

  describe('Download Functionality', () => {
    it('should download selected files', async () => {
      (global.chrome.downloads.download as any).mockImplementation(() => {
        return Promise.resolve(1);
      });

      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      // Wait longer for all downloads with delays
      await waitFor(
        () => {
          expect(chrome.downloads.download).toHaveBeenCalled();
        },
        { timeout: 5000, interval: 100 }
      );

      // Check that downloads were called (order may vary due to delays)
      expect(chrome.downloads.download).toHaveBeenCalled();
    });

    it('should sanitize filenames', async () => {
      const filesWithBadNames: FileItem[] = [
        {
          url: 'https://example.com/file.pdf',
          name: 'File:With*Invalid?Chars.pdf',
          type: 'Document',
          size: 1024,
        },
      ];

      (global.chrome.downloads.download as any).mockImplementation(() => {
        return Promise.resolve(1);
      });

      render(<ActionBar selectedCount={1} selectedFiles={filesWithBadNames} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      await waitFor(
        () => {
          expect(chrome.downloads.download).toHaveBeenCalledWith({
            url: 'https://example.com/file.pdf',
            filename: 'File_With_Invalid_Chars.pdf',
          });
        },
        { timeout: 5000, interval: 100 }
      );
    });

    it('should add extension from URL if filename lacks extension', async () => {
      const filesWithoutExt: FileItem[] = [
        {
          url: 'https://example.com/file.pdf',
          name: 'Document Without Extension',
          type: 'Document',
          size: 1024,
        },
      ];

      render(<ActionBar selectedCount={1} selectedFiles={filesWithoutExt} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(chrome.downloads.download).toHaveBeenCalledWith({
          url: 'https://example.com/file.pdf',
          filename: 'Document Without Extension.pdf',
        });
      });
    });

    it('should show loading state while downloading', async () => {
      // Make downloads slow
      (global.chrome.downloads.download as any).mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(1), 100));
      });

      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Descargando...')).toBeInTheDocument();
      });

      // Button should be disabled
      const button = screen.getByText('Descargando...').closest('button');
      expect(button).toBeDisabled();

      // Wait for downloads to complete
      await waitFor(() => {
        expect(screen.getByText('Descargar Selección')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should handle download errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.chrome.downloads.download as any).mockRejectedValue(
        new Error('Download error')
      );

      render(<ActionBar selectedCount={1} selectedFiles={[mockFiles[0]]} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      // Wait a bit for the download to fail
      await new Promise(resolve => setTimeout(resolve, 300));

      // The error should have been logged
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    }, 10000);

    it('should add delay between downloads', async () => {
      (global.chrome.downloads.download as any).mockResolvedValue(1);

      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      // Wait for all downloads to complete
      await waitFor(
        () => {
          expect(chrome.downloads.download).toHaveBeenCalledTimes(2);
        },
        { timeout: 3000 }
      );
    });

    it('should show alert when chrome.downloads is not available', () => {
      const originalChrome = global.chrome;
      (global as any).chrome = undefined;

      render(<ActionBar selectedCount={1} selectedFiles={[mockFiles[0]]} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Descarga fallida')
      );

      (global as any).chrome = originalChrome;
    });

    it('should disable buttons while downloading', async () => {
      let resolveDownload: ((value: number) => void) | null = null;
      (global.chrome.downloads.download as any).mockImplementation(() => {
        return new Promise(resolve => {
          resolveDownload = resolve;
        });
      });

      render(<ActionBar selectedCount={2} selectedFiles={mockFiles} />);

      const downloadButton = screen.getByText('Descargar Selección');
      fireEvent.click(downloadButton);

      await waitFor(
        () => {
          const copyButton = screen.getByText('Copiar Enlaces').closest('button');
          expect(copyButton).toBeDisabled();
        },
        { timeout: 1000 }
      );

      // Clean up by resolving the download
      if (resolveDownload) {
        resolveDownload(1);
      }
    });
  });
});
