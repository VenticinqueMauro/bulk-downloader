import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../../components/FilterBar';
import { FilterType } from '../../types';

describe('FilterBar', () => {
  let onFilterChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilterChange = vi.fn();
  });

  describe('Rendering', () => {
    it('should render all filter buttons with counts', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
        video: 2,
        audio: 1,
        document: 4,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      expect(screen.getByText('Todos')).toBeInTheDocument();
      expect(screen.getByText('Imágenes')).toBeInTheDocument();
      expect(screen.getByText('Videos')).toBeInTheDocument();
      expect(screen.getByText('Audio')).toBeInTheDocument();
      expect(screen.getByText('Documentos')).toBeInTheDocument();
    });

    it('should not render buttons with zero count (except "all")', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 5,
        image: 3,
        video: 0,
        document: 2,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      expect(screen.getByText('Todos')).toBeInTheDocument();
      expect(screen.getByText('Imágenes')).toBeInTheDocument();
      expect(screen.queryByText('Videos')).not.toBeInTheDocument();
      expect(screen.getByText('Documentos')).toBeInTheDocument();
    });

    it('should always show "all" filter even with zero count', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 0,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      expect(screen.getByText('Todos')).toBeInTheDocument();
    });

    it('should show correct count for each filter', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 15,
        image: 5,
        document: 10,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      // Find count badges
      const allButton = screen.getByText('Todos').closest('button');
      expect(allButton).toHaveTextContent('15');

      const imageButton = screen.getByText('Imágenes').closest('button');
      expect(imageButton).toHaveTextContent('5');

      const docButton = screen.getByText('Documentos').closest('button');
      expect(docButton).toHaveTextContent('10');
    });
  });

  describe('Active State', () => {
    it('should highlight active filter', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
        document: 7,
      };

      render(
        <FilterBar
          currentFilter="image"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      const imageButton = screen.getByText('Imágenes').closest('button');
      expect(imageButton).toHaveClass('bg-sky-600');
    });

    it('should not highlight inactive filters', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
        document: 7,
      };

      render(
        <FilterBar
          currentFilter="image"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      const allButton = screen.getByText('Todos').closest('button');
      expect(allButton).toHaveClass('bg-gray-700');
    });
  });

  describe('Filter Change', () => {
    it('should call onFilterChange when clicking a filter', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      const imageButton = screen.getByText('Imágenes');
      fireEvent.click(imageButton);

      expect(onFilterChange).toHaveBeenCalledWith('image');
    });

    it('should allow clicking the same filter again', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
      };

      render(
        <FilterBar
          currentFilter="image"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      const imageButton = screen.getByText('Imágenes');
      fireEvent.click(imageButton);

      expect(onFilterChange).toHaveBeenCalledWith('image');
    });

    it('should handle all filter types', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 100,
        image: 10,
        video: 5,
        audio: 3,
        document: 20,
        archive: 8,
        font: 2,
        style: 15,
        script: 12,
        code: 18,
        model3d: 4,
        data: 6,
        executable: 1,
        other: 5,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      // Test clicking different filter types
      const filters: Array<{ text: string; value: FilterType }> = [
        { text: 'Todos', value: 'all' },
        { text: 'Imágenes', value: 'image' },
        { text: 'Videos', value: 'video' },
        { text: 'Audio', value: 'audio' },
        { text: 'Documentos', value: 'document' },
        { text: 'Archivos', value: 'archive' },
        { text: 'Fuentes', value: 'font' },
        { text: 'Estilos', value: 'style' },
        { text: 'Scripts', value: 'script' },
        { text: 'Código', value: 'code' },
        { text: 'Modelos 3D', value: 'model3d' },
        { text: 'Datos', value: 'data' },
        { text: 'Ejecutables', value: 'executable' },
        { text: 'Otros', value: 'other' },
      ];

      filters.forEach(({ text, value }) => {
        const button = screen.getByText(text);
        fireEvent.click(button);
        expect(onFilterChange).toHaveBeenCalledWith(value);
      });
    });
  });

  describe('Visual Appearance', () => {
    it('should render icons for each filter', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      // Icons are SVG elements inside the buttons
      const allButton = screen.getByText('Todos').closest('button');
      const svg = allButton?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply different styles for active and inactive filters', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 10,
        image: 3,
        document: 5,
      };

      render(
        <FilterBar
          currentFilter="image"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      const activeButton = screen.getByText('Imágenes').closest('button');
      const inactiveButton = screen.getByText('Todos').closest('button');

      expect(activeButton).toHaveClass('bg-sky-600', 'text-white');
      expect(inactiveButton).toHaveClass('bg-gray-700', 'text-gray-300');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty fileCounts object', () => {
      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={{}}
        />
      );

      // Should at least show "Todos" with count 0
      expect(screen.getByText('Todos')).toBeInTheDocument();
    });

    it('should handle undefined counts', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 5,
        // image count is undefined
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      // Should not crash and should hide image filter
      expect(screen.queryByText('Imágenes')).not.toBeInTheDocument();
    });

    it('should handle very large counts', () => {
      const fileCounts: Partial<Record<FilterType, number>> = {
        all: 999999,
        image: 123456,
      };

      render(
        <FilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          fileCounts={fileCounts}
        />
      );

      const allButton = screen.getByText('Todos').closest('button');
      expect(allButton).toHaveTextContent('999999');
    });
  });
});
