import React, { useState, useEffect } from 'react';

interface LoadingStateProps {
  scanType: 'standard' | 'ai';
  url: string;
  startTime?: number; // Unix timestamp when scan started
  onCancel?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ scanType, url, startTime, onCancel }) => {
  const [dots, setDots] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Track elapsed time - use startTime if provided (for persistence)
  useEffect(() => {
    const calculateElapsed = () => {
      if (startTime) {
        // Calculate from provided start time (persists across popup open/close)
        return Math.floor((Date.now() - startTime) / 1000);
      }
      return elapsedTime;
    };

    // Initial calculation
    setElapsedTime(calculateElapsed());

    // Update every second
    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      } else {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getEstimatedTime = (): string => {
    if (scanType === 'standard') {
      return '5-15 segundos';
    }
    return '10-30 segundos';
  };

  const getMessage = (): string => {
    if (scanType === 'standard') {
      if (elapsedTime < 5) return 'Descargando contenido de la página';
      if (elapsedTime < 10) return 'Analizando HTML y extrayendo archivos';
      return 'Obteniendo tamaños de archivos';
    } else {
      if (elapsedTime < 5) return 'Descargando contenido de la página';
      if (elapsedTime < 15) return 'Enviando datos a Gemini AI';
      if (elapsedTime < 25) return 'IA analizando contenido y buscando archivos';
      return 'Procesando resultados de la IA';
    }
  };

  const getTip = (): string => {
    if (scanType === 'ai') {
      const tips = [
        'AI Scan es más preciso pero tarda más tiempo',
        'La IA puede encontrar archivos que el escaneo estándar no detecta',
        'Páginas con mucho contenido pueden tardar más en procesarse',
        'Puedes cerrar el popup, el escaneo continuará en segundo plano'
      ];
      return tips[Math.floor(elapsedTime / 8) % tips.length];
    } else {
      const tips = [
        'El escaneo estándar es rápido pero puede no detectar todos los archivos',
        'Usa AI Scan para resultados más completos',
        'Puedes cerrar el popup, el escaneo continuará en segundo plano'
      ];
      return tips[Math.floor(elapsedTime / 8) % tips.length];
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center px-4 py-6">
      <div className="p-8 w-full max-w-md bg-gray-800 rounded-xl border border-gray-700">
        {/* Icon and Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Spinning outer ring */}
            <div className={`w-20 h-20 rounded-full border-4 border-gray-700 animate-spin ${
              scanType === 'ai' ? 'border-t-yellow-500' : 'border-t-sky-500'
            }`}></div>
            {/* Icon in center */}
            <div className="flex absolute inset-0 justify-center items-center">
              {scanType === 'ai' ? (
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-center">
          {scanType === 'ai' ? (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              Escaneando con IA{dots}
            </span>
          ) : (
            <span className="text-sky-400">Escaneando{dots}</span>
          )}
        </h3>

        {/* URL */}
        <p className="mb-6 text-xs text-center text-gray-500 break-all">
          {new URL(url).hostname}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="overflow-hidden w-full h-2 bg-gray-700 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                scanType === 'ai'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                  : 'bg-sky-500'
              }`}
              style={{
                width: scanType === 'ai'
                  ? `${Math.min((elapsedTime / 30) * 100, 90)}%`
                  : `${Math.min((elapsedTime / 15) * 100, 90)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Current Status */}
        <div className="p-4 mb-4 rounded-lg bg-gray-900/50">
          <p className="mb-2 text-sm text-center text-gray-300">
            {getMessage()}
          </p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tiempo transcurrido: {formatTime(elapsedTime)}</span>
            <span>~{getEstimatedTime()}</span>
          </div>
        </div>

        {/* Tip */}
        <div className="flex gap-2 items-start p-3 rounded-lg border bg-blue-900/20 border-blue-700/30">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-300">{getTip()}</p>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <div className="mt-4 text-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 border border-gray-600 hover:border-gray-500"
            >
              Cancelar Escaneo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
