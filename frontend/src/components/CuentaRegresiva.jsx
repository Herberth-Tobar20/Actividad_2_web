import { useEffect, useState } from 'react';
import { Alert, Badge, Button } from 'reactstrap';
import { getSesion, reiniciarSesion } from '../api/sesionApi';

// Componente autocontenido: consulta el reloj del backend, hace la cuenta
// regresiva y reinicia la sesión por su cuenta. Se puede montar solo con
// <CuentaRegresiva />. Las props son opcionales:
//   onSesionReiniciada: se llama después de reiniciar (para recargar datos)
//   onError: recibe el mensaje de error del backend
function CuentaRegresiva({ onSesionReiniciada, onError }) {
  const [segundos, setSegundos] = useState(null);
  const [reiniciando, setReiniciando] = useState(false);

  const avisarError = (texto) => {
    if (onError) onError(texto);
  };

  // sincroniza con el tiempo real del servidor al montar
  useEffect(() => {
    let activo = true;

    getSesion()
      .then(({ segundos }) => {
        if (activo) setSegundos(segundos);
      })
      .catch((err) => {
        if (activo) avisarError(err.message);
      });

    return () => {
      activo = false;
    };
    
  }, []);

  useEffect(() => {
    if (segundos === null || segundos <= 0) return;

    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  const manejarReinicio = async () => {
    setReiniciando(true);
    try {
      const { segundos: nuevosSegundos } = await reiniciarSesion();
      setSegundos(nuevosSegundos ?? 0);
      if (onSesionReiniciada) await onSesionReiniciada();
    } catch (err) {
      avisarError(err.message);
    } finally {
      setReiniciando(false);
    }
  };

  // mientras no llegó la primera respuesta del backend no mostramos nada
  if (segundos === null) return null;

  if (segundos <= 0) {
    return (
      <Alert color="danger" className="d-flex justify-content-between align-items-center">
        <span>Tu sesión expiró. Inicia una nueva para continuar con la carga.</span>
        <Button color="light" size="sm" disabled={reiniciando} onClick={manejarReinicio}>
          {reiniciando ? 'Reiniciando...' : 'Reiniciar sesión'}
        </Button>
      </Alert>
    );
  }

  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, '0');

  return (
    <Alert color="info" className="d-flex justify-content-between align-items-center">
      <span>Tiempo restante para completar la carga:</span>
      <Badge color="dark" pill>
        {minutos}:{resto}
      </Badge>
    </Alert>
  );
}

export default CuentaRegresiva;