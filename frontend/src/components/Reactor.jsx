import { useState } from 'react';
import { Form, FormGroup, Input, Button, ListGroup, ListGroupItem, Alert, Badge } from 'reactstrap';
import { enviarAjuste, reiniciarReactor } from '../api/reactorApi';
import AlertaError from './AlertaError';

const TEXTOS = {
  'más alta': 'La temperatura ideal es más alta.',
  'más baja': 'La temperatura ideal es más baja.',
  estabilizado: '¡Reactor estabilizado!',
};

function Reactor() {
  const [numero, setNumero] = useState('');
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [estabilizado, setEstabilizado] = useState(false);
  const [error, setError] = useState({ mensaje: '', id: 0 });

  const mostrarError = (texto) => setError({ mensaje: texto, id: error.id + 1 });

  const intentosFallidos = historial.filter((h) => h.resultado !== 'estabilizado').length;

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    const valor = Number(numero);
    if (!Number.isInteger(valor) || valor < 1 || valor > 100) {
      mostrarError('Ingresa un número entre 1 y 100');
      return;
    }

    try {
      const { resultado } = await enviarAjuste(valor);
      setHistorial([...historial, { numero: valor, resultado }]);
      setMensaje(TEXTOS[resultado]);
      setEstabilizado(resultado === 'estabilizado');
      setNumero('');
    } catch (err) {
      mostrarError(err.message);
    }
  };

  const manejarReinicio = async () => {
    try {
      await reiniciarReactor();
      setHistorial([]);
      setMensaje('');
      setEstabilizado(false);
      setNumero('');
    } catch (err) {
      mostrarError(err.message);
    }
  };

  return (
    <div>
      <h5>Reactor</h5>
      <AlertaError key={error.id} mensaje={error.mensaje} />

      <Form onSubmit={manejarEnvio} className="d-flex gap-2 mb-3">
        <FormGroup className="mb-0 flex-grow-1">
          <Input
            type="number"
            min="1"
            max="100"
            placeholder="Ajusta el reactor (1-100)"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            disabled={estabilizado}
          />
        </FormGroup>
        <Button color="primary" type="submit" disabled={estabilizado}>
          Ajustar
        </Button>
        <Button color="secondary" outline type="button" onClick={manejarReinicio}>
          Reiniciar
        </Button>
      </Form>

      {mensaje && <Alert color={estabilizado ? 'success' : 'info'}>{mensaje}</Alert>}

      <p>
        Intentos fallidos: <Badge color="dark" pill>{intentosFallidos}</Badge>
      </p>

      <ListGroup>
        {historial.map((intento, indice) => (
          <ListGroupItem key={indice}>
            #{indice + 1} → {intento.numero} ({intento.resultado})
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

export default Reactor;