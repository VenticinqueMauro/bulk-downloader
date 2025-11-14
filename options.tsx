import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const OptionsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const result = await chrome.storage.sync.get(['geminiApiKey']);
      if (result.geminiApiKey) {
        setSavedKey(result.geminiApiKey);
        // Show masked version
        setApiKey('*'.repeat(20));
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      setMessage({ type: 'error', text: 'Error al cargar la API key guardada.' });
    }
  };

  const handleSave = async () => {
    if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('*')) {
      setMessage({ type: 'error', text: 'Por favor ingresa una API key válida.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await chrome.storage.sync.set({ geminiApiKey: apiKey.trim() });
      setSavedKey(apiKey.trim());
      setMessage({ type: 'success', text: '¡API Key guardada exitosamente!' });

      // Mask the key after saving
      setTimeout(() => {
        setApiKey('*'.repeat(20));
      }, 1000);
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage({ type: 'error', text: 'Error al guardar la API key. Por favor intenta de nuevo.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('¿Estás seguro de eliminar tu API key? Esto deshabilitará las funciones de escaneo con IA.')) {
      return;
    }

    try {
      await chrome.storage.sync.remove(['geminiApiKey']);
      setApiKey('');
      setSavedKey('');
      setMessage({ type: 'info', text: 'API Key eliminada.' });
    } catch (error) {
      console.error('Error removing API key:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la API key.' });
    }
  };

  const handleInputFocus = () => {
    if (apiKey.startsWith('*')) {
      setApiKey('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            FileHarvest
          </h1>
          <p className="text-gray-400">Configuración de la Extensión</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🔑</span>
            Clave API de IA
          </h2>

          <div className="mb-4">
            <p className="text-gray-300 mb-2">
              Para usar la función AI Deep Scan, necesitas una clave API de IA.
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Tu clave API se almacena localmente en tu navegador y nunca se comparte con nadie.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-gray-300">
                Clave API
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Ingresa tu clave API de IA"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success' ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' :
                message.type === 'error' ? 'bg-rose-900/30 border-rose-700 text-rose-300' :
                'bg-blue-900/30 border-blue-700 text-blue-300'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Guardando...' : 'Guardar Clave API'}
              </button>

              {savedKey && (
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-700 border border-gray-600 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  Eliminar Clave API
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            Cómo Obtener una Clave API
          </h2>

          <ol className="space-y-4 text-gray-300">
            <li className="flex gap-3 items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-500/20 text-purple-400 font-bold rounded-full flex-shrink-0">1</span>
              <div className="flex-1">
                <p className="font-medium mb-1">Visita Google AI Studio</p>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  <span>Abrir Google AI Studio</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-500/20 text-purple-400 font-bold rounded-full flex-shrink-0">2</span>
              <div className="flex-1">
                <p className="font-medium">Inicia sesión con tu cuenta de Google</p>
                <p className="text-sm text-gray-400 mt-1">Cualquier cuenta de Google funciona</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-500/20 text-purple-400 font-bold rounded-full flex-shrink-0">3</span>
              <div className="flex-1">
                <p className="font-medium">Haz clic en "Create API Key"</p>
                <p className="text-sm text-gray-400 mt-1">Si ya tienes un proyecto, selecciónalo. Si no, crea uno nuevo.</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-500/20 text-purple-400 font-bold rounded-full flex-shrink-0">4</span>
              <div className="flex-1">
                <p className="font-medium">Copia y pega la API key arriba</p>
                <p className="text-sm text-gray-400 mt-1">Tu clave se guardará de forma segura solo en tu navegador</p>
              </div>
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <strong>Nota:</strong> La API de Google AI tiene un plan gratuito con límites generosos. Consulta la{' '}
              <a
                href="https://ai.google.dev/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-200"
              >
                página de precios
              </a>
              {' '}para más detalles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<OptionsPage />);
}
