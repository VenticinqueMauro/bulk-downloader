import React, { useState, useEffect } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps: OnboardingStep[] = [
    {
      title: '¡Bienvenido a FileHarvest!',
      description: 'Descarga archivos en masa de cualquier página web con un solo clic. Déjame mostrarte cómo funciona.',
      icon: '👋',
    },
    {
      title: 'Escaneo Estándar',
      description: 'El botón "Standard Scan" encuentra todos los archivos descargables en la página actual. Es rápido, gratuito e ilimitado.',
      icon: '🔍',
    },
    {
      title: 'Escaneo con IA (Opcional)',
      description: 'El "AI Deep Scan" usa Gemini para encontrar archivos ocultos que otros escáneres no detectan. Requiere una API key gratuita de Google.',
      icon: '🤖',
      action: {
        label: 'Configurar API Key',
        onClick: () => chrome.runtime.openOptionsPage(),
      },
    },
    {
      title: 'Filtra y Descarga',
      description: 'Filtra archivos por tipo (imágenes, videos, documentos), selecciona los que necesites y descárgalos con un clic.',
      icon: '⬇️',
    },
    {
      title: '¡Todo listo!',
      description: 'Ya estás preparado para empezar. Recuerda: FileHarvest es 100% gratis, sin ads y respeta tu privacidad.',
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Save that user has seen onboarding
    chrome.storage.sync.set({ hasSeenOnboarding: true });
    onComplete();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-700 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{step.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{step.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Paso {currentStep + 1} de {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Saltar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 text-base leading-relaxed">
            {step.description}
          </p>

          {step.action && (
            <button
              onClick={step.action.onClick}
              className="mt-4 w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              {step.action.label}
            </button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="px-6 pb-4">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'bg-sky-500'
                    : idx < currentStep
                    ? 'bg-sky-600/50'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
          >
            {isLastStep ? '¡Empezar!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
