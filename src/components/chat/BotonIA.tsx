import { useState } from "react";
//import { useNavigate } from "react-router-dom"; Se utilizara cuando la navegacion se implemente
import { generarVisualizacion } from "../../services/ia";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { ModalIA } from "./ModalIA";

interface Props {
  fotoId: number;
  propiedadId: number;
  propiedadTipo: string;
}

export const BotonIA = ({ fotoId, propiedadId, propiedadTipo }: Props) => {
  //const navigate = useNavigate(); Se utilizara cuando la navegacion se implemente
  const { usuario, autenticado } = useAutenticacion();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [urlResultado, setUrlResultado] = useState<string>();
  const [error, setError] = useState<string>();

  const textoBoton = propiedadTipo === "terreno" ? "Ver construcción" : "Ver amueblado";

  const manejarClick = async () => {
    if (!usuario || !autenticado) {
      // Redirigir hacia login o registro 
      return;
    }

    setCargando(true);
    setError(undefined);
    setModalAbierto(true);

    try {
        const resultado = await generarVisualizacion(fotoId, propiedadId);
        setUrlResultado(resultado.url_resultado);
    } catch (err) {
        console.error("Error al generar visualización:", err);
        setError("Error al generar la visualización. Inténtalo de nuevo.");
    } finally {
        setCargando(false);
    }
  };

  const reintentar = () => {
    setError(undefined);
    setUrlResultado(undefined);
    manejarClick();
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCargando(false);
    setUrlResultado(undefined);
    setError(undefined);
  };

  return (
    <>
      <button
        onClick={manejarClick}
        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
        {autenticado ? textoBoton : "Ver con IA"}
      </button>

      <ModalIA
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        urlResultado={urlResultado}
        cargando={cargando}
        error={error}
        onReintentar={reintentar}
      />
    </>
  );
};