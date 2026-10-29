import { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
  Button, Badge, Alert, Spinner
} from 'reactstrap';
import {
  getInventario, getCarga, agregarCargaAPI,
  actualizarUnidadesAPI, eliminarCargaAPI
} from './api/reactorApi';
import AlertaError from './components/AlertaError';
import BodegaLateral from './components/BodegaLateral';
import CuentaRegresiva from './components/CuentaRegresiva';
import Reactor from './components/Reactor';

function App() {
  // --- ESTADOS GENERALES (useState) ---
  const [inventario, setInventario] = useState([]);
  const [cargaData, setCargaData] = useState({ creditos: 500, itemsCargados: [], total: 0 });
  const [error, setError] = useState({ mensaje: '', id: 0 });
  const [cargando, setCargando] = useState(true);

  // id incremental: el key hace que UncontrolledAlert se remonte en cada error
  const mostrarError = (texto) =>
    setError((anterior) => ({ mensaje: texto, id: anterior.id + 1 }));

  // --- CARGA DE DATOS (useEffect) ---
  const cargarDatosMision = async () => {
    const [inventarioRes, cargaRes] = await Promise.all([getInventario(), getCarga()]);
    setInventario(inventarioRes);
    setCargaData(cargaRes);
  };

  useEffect(() => {
    const iniciar = async () => {
      try {
        await cargarDatosMision();
      } catch (err) {
        mostrarError(err.message || 'Error al conectar con la base de datos de la misión.');
      } finally {
        setCargando(false);
      }
    };

    iniciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- MANEJADORES DE ACCIÓN ---
  // envuelve cada petición: muestra "Calculando peso...", refresca y captura el error
  const ejecutarAccion = async (accion) => {
    setCargando(true);
    try {
      await accion();
      await cargarDatosMision();
    } catch (err) {
      mostrarError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarAgregar = (id) => ejecutarAccion(() => agregarCargaAPI(id, 1));

  const manejarCambioUnidades = (id, nuevaCantidad) =>
    ejecutarAccion(() => actualizarUnidadesAPI(id, nuevaCantidad));

  const manejarEliminar = (id) => ejecutarAccion(() => eliminarCargaAPI(id));

  // el backend solo guarda { id, cantidad }: el nombre se toma del inventario
const itemsBodega = cargaData.itemsCargados.map((item) => ({
    ...item,
    nombre: inventario.find((s) => s.id === item.id)?.nombre ?? `Suministro #${item.id}`,
  }));

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">AstroLogistics Ltd. - Manifiesto de Carga</h1>

      {/* Alerta de error: UncontrolledAlert se remonta con cada key nueva */}
      <AlertaError key={error.id} mensaje={error.mensaje} />

      {/* Cuenta regresiva de la ventana de lanzamiento */}
      <CuentaRegresiva onSesionReiniciada={cargarDatosMision} onError={mostrarError} />

      {/* PANEL SUPERIOR (Información de la Misión) */}
      <Alert color="info" className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Créditos disponibles:</strong> {cargaData.creditos} Cr
        </div>
        <div>
          <strong>Costo total de Carga:</strong>{' '}
          <Badge color="dark" pill>{cargaData.total} Cr</Badge>
        </div>
      </Alert>

      {cargando && (
        <div className="text-muted">
          <Spinner size="sm" className="me-2" />
          Calculando peso...
        </div>
      )}

      <Row>
        {/* CATÁLOGO DE LA BASE (Cuadrícula de Cards) */}
        <Col md="8" xs="12">
          <h3 className="mb-3">Catálogo de Suministros</h3>
          <Row>
            {inventario.map((item) => (
              <Col md="4" xs="12" key={item.id}>
                <Card className="mb-3 h-100 shadow-sm">
                  <CardBody className="d-flex flex-column justify-content-between">
                    <div>
                      <CardTitle tag="h5">{item.nombre}</CardTitle>
                      <span className="text-muted small">{item.categoria}</span>
                      <p className="mt-2 mb-1">
                        Precio: <Badge color="success">{item.precio} Cr</Badge>
                      </p>
                      <p className="small">Stock en Base: <strong>{item.stock}</strong></p>
                    </div>

                    {item.stock === 0 ? (
                      <Button color="secondary" disabled size="sm">
                        Agotado en Base
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        size="sm"
                        disabled={cargando}
                        onClick={() => manejarAgregar(item.id)}
                      >
                        Añadir a la Nave
                      </Button>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* BODEGA DE CARGA LATERAL (Panel Lateral) */}
        <Col md="4" xs="12">
          <h3 className="mb-3">Tu Bodega</h3>
          <BodegaLateral
            items={itemsBodega}
            onAumentar={(item) => manejarCambioUnidades(item.id, item.cantidad + 1)}
            onDisminuir={(item) => manejarCambioUnidades(item.id, item.cantidad - 1)}
            onQuitar={manejarEliminar}
          />
        </Col>
      </Row>

      {/* ESTABILIZA EL REACTOR */}
      <Row className="mt-4">
        <Col md="8" xs="12">
          <Card className="mb-3">
            <CardBody>
              <Reactor />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;