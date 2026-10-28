import { useState, useEffect } from 'react';
import { Alert, Badge, Button } from 'reactstrap';

function CuentaRegresiva({ segundosIniciales, onReiniciar }) {
  const [segundos, setSegundos] = useState(segundosIniciales);

  useEffect(() => {
    if (segundos <= 0) return;

    const id = setTimeout(() => setSegundos(segundos - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  const manejarReinicio = async () => {
    const nuevosSegundos = await onReiniciar();
    setSegundos(nuevosSegundos ?? segundosIniciales);
  };

  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, '0');

  if (segundos <= 0) {
    return (
      <Alert color="danger" className="d-flex justify-content-between align-items-center">
        Tu sesión expiró. Inicia de nuevo.
        <Button color="light" size="sm" onClick={manejarReinicio}>
          Reiniciar sesión
        </Button>
      </Alert>
    );
  }

  return (
    <Alert color="info">
      Tiempo restante: <Badge color="dark" pill>{minutos}:{resto}</Badge>
    </Alert>
  );
}

export default CuentaRegresiva;