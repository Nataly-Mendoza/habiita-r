interface Props {
  abierto: boolean;
  onCerrar: () => void;
  urlResultado?: string;
  cargando: boolean;
  error?: string;
  onReintentar?: () => void;
}

export const ModalIA = ({
  abierto,
  onCerrar,
  urlResultado,
  cargando,
  error,
  onReintentar,
}: Props) => {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onCerrar}>
      <div className="relative max-w-2xl w-full mx-4 bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Visualización con IA
          </h3>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {cargando && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                <span className="text-gray-600">Generando visualización...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              {onReintentar && (
                <button
                  onClick={onReintentar}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {urlResultado && (
            <div className="flex justify-center">
              <img
                src={urlResultado}
                alt="Visualización generada por IA"
                className="max-h-96 w-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};