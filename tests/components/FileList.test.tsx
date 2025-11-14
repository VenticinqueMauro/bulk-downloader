import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileList } from '../../components/FileList';
import { FileItem } from '../../types';

const mockFiles: FileItem[] = [
  {
    url: 'https://example.com/file1.pdf',
    name: 'Document 1',
    type: 'Document',
    size: 1024,
  },
  {
    url: 'https://example.com/image1.jpg',
    name: 'Image 1',
    type: 'Image',
    size: 2048,
  },
  {
    url: 'https://example.com/video1.mp4',
    name: 'Video 1',
    type: 'Video',
    size: 5000,
  },
];

// Generate many files for pagination testing
const generateMockFiles = (count: number): FileItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    url: `https://example.com/file${i + 1}.pdf`,
    name: `File ${i + 1}`,
    type: 'Document' as const,
    size: 1024 * (i + 1),
  }));
};

describe('FileList', () => {
  let selectedFileUrls: Set<string>;
  let onSelectionChange: ReturnType<typeof vi.fn>;
  let onToggleSelectAll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    selectedFileUrls = new Set();
    onSelectionChange = vi.fn((callback: any) => {
      if (typeof callback === 'function') {
        selectedFileUrls = callback(selectedFileUrls);
      } else {
        selectedFileUrls = callback;
      }
    });
    onToggleSelectAll = vi.fn();
  });

  describe('Rendering', () => {
    it('should render file list with files', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.getByText('Video 1')).toBeInTheDocument();
    });

    it('should render empty state when no files', () => {
      render(
        <FileList
          files={[]}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      expect(
        screen.getByText('No hay archivos que coincidan con el filtro actual.')
      ).toBeInTheDocument();
    });

    it('should render search bar', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter files by name', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'Document' } });

      expect(screen.getByText('Document 1')).toBeInTheDocument();
      expect(screen.queryByText('Image 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Video 1')).not.toBeInTheDocument();
    });

    it('should filter files by URL', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'image1.jpg' } });

      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.queryByText('Document 1')).not.toBeInTheDocument();
    });

    it('should filter files by type', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'Video' } });

      expect(screen.getByText('Video 1')).toBeInTheDocument();
      expect(screen.queryByText('Document 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Image 1')).not.toBeInTheDocument();
    });

    it('should show count of filtered results', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'Document' } });

      expect(screen.getByText('Encontrados 1 de 3 archivos')).toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'Document' } });

      // Find the clear button by its parent container
      const clearButtons = screen.getAllByRole('button');
      const clearButton = clearButtons.find(btn =>
        btn.className.includes('absolute') && btn.className.includes('right-2.5')
      );

      expect(clearButton).toBeDefined();
      if (clearButton) {
        fireEvent.click(clearButton);
        expect(searchInput.value).toBe('');
      }
    });

    it('should show empty state when search has no results', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(
        screen.getByText('No hay archivos que coincidan con tu búsqueda.')
      ).toBeInTheDocument();
    });

    it('should be case insensitive', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'DOCUMENT' } });

      expect(screen.getByText('Document 1')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should show pagination controls for more than 20 files', () => {
      const manyFiles = generateMockFiles(30);

      render(
        <FileList
          files={manyFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      expect(screen.getByText(/Página 1 de 2/)).toBeInTheDocument();
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('should not show pagination for 20 or fewer files', () => {
      const fewFiles = generateMockFiles(15);

      render(
        <FileList
          files={fewFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('should navigate to next page', () => {
      const manyFiles = generateMockFiles(30);

      render(
        <FileList
          files={manyFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const nextButton = screen.getByText('Siguiente');
      fireEvent.click(nextButton);

      expect(screen.getByText(/Página 2 de 2/)).toBeInTheDocument();
    });

    it('should navigate to previous page', () => {
      const manyFiles = generateMockFiles(30);

      render(
        <FileList
          files={manyFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const nextButton = screen.getByText('Siguiente');
      fireEvent.click(nextButton);

      const prevButton = screen.getByText('Anterior');
      fireEvent.click(prevButton);

      expect(screen.getByText(/Página 1 de 2/)).toBeInTheDocument();
    });

    it('should disable previous button on first page', () => {
      const manyFiles = generateMockFiles(30);

      render(
        <FileList
          files={manyFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const prevButton = screen.getByText('Anterior');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      const manyFiles = generateMockFiles(30);

      render(
        <FileList
          files={manyFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const nextButton = screen.getByText('Siguiente');
      fireEvent.click(nextButton);

      expect(nextButton).toBeDisabled();
    });

    it('should reset to page 1 when search changes', () => {
      const manyFiles = generateMockFiles(30);

      render(
        <FileList
          files={manyFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const nextButton = screen.getByText('Siguiente');
      fireEvent.click(nextButton);

      const searchInput = screen.getByPlaceholderText(
        'Buscar archivos por nombre, URL o tipo...'
      );
      fireEvent.change(searchInput, { target: { value: 'File' } });

      expect(screen.getByText(/Página 1 de/)).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should toggle individual file selection', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      // Find checkbox for first file (Document 1)
      const checkboxes = screen.getAllByRole('checkbox');
      const fileCheckbox = checkboxes[1]; // First is "select all", second is first file

      fireEvent.click(fileCheckbox);

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should toggle select all files on current page', () => {
      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={selectedFileUrls}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(selectAllCheckbox);

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should show correct state when all files are selected', () => {
      const allSelected = new Set(mockFiles.map(f => f.url));

      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={allSelected}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
      expect(selectAllCheckbox.checked).toBe(true);
    });

    it('should deselect all when clicking select all checkbox when all selected', () => {
      const allSelected = new Set(mockFiles.map(f => f.url));

      render(
        <FileList
          files={mockFiles}
          selectedFileUrls={allSelected}
          onSelectionChange={onSelectionChange}
          onToggleSelectAll={onToggleSelectAll}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(selectAllCheckbox);

      expect(onSelectionChange).toHaveBeenCalled();
    });
  });
});
