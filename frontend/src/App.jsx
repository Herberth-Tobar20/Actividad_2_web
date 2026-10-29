import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardTitle, CardText, 
  Button, Badge, Alert, ListGroup, ListGroupItem, ButtonGroup 
} from 'reactstrap';
import { 
  getInventario, getCarga, agregarCargaAPI, 
  actualizarUnidadesAPI, eliminarCargaAPI 
} from './api/reactorApi';

function App() {
  // --- ESTADOS GENERALES (useState) ---
  const [inventario, setInventario] = useState([]);
  const [cargaData, setCargaData] = useState({ creditos: 500, itemsCargados: [], total: 0 });
  const [errorMsg, setErrorMsg] = useState(null);

  // --- CARGA INICIAL (useEffect) ---
  const cargarDatosMision = async () => {
    try {
      const invRes = await getInventario();
      const cargaRes = await getCarga();
      setInventario(invRes);
      setCargaData(cargaRes);
    } catch (error) {
      setErrorMsg(error.message || "Error al conectar con la base de datos de la misión.");
    }
  };

  useEffect(() => {
    cargarDatosMision();
  }, []);

  // --- MANEJADORES DE ACCIÓN ---
  const manejarAgregar = async (id) => {
    try {
      setErrorMsg(null);
      await agregarCargaAPI(id, 1);
      await cargarDatosMision(); // Refrescar stock y carga
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const manejarCambioUnidades = async (id, nuevaCantidad) => {
    try {
      setErrorMsg(null);
      await actualizarUnidadesAPI(id, nuevaCantidad);
      await cargarDatosMision();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const manejarEliminar = async (id) => {
    try {
      setErrorMsg(null);
      await eliminarCargaAPI(id);
      await cargarDatosMision();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">AstroLogistics Ltd. - Manifiesto de Carga</h1>

      {/* Alerta de Error por Restricciones (Stock / Créditos) */}
      {errorMsg && (
        <Alert color="warning" toggle={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

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

      <Row>
        {/* CATÁLOGO DE LA BASE (Cuadrícula de Cards) */}
        <Col md="8" xs="12">
          <h3 className="mb-3">Catálogo de Suministros</h3>
          <Row>
            {inventario.map((item) => (
              <Col md="4" xs="12" key={item.id} className="mb-3">
                <Card className="h-100 shadow-sm">
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
                      <Button color="primary" size="sm" onClick={() => manejarAgregar(item.id)}>
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
          <ListGroup>
            {cargaData.itemsCargados.length === 0 ? (
              <ListGroupItem className="text-muted text-center">La nave está vacía</ListGroupItem>
            ) : (
              cargaData.itemsCargados.map((itemCargado) => {
                const suministroInfo = inventario.find(i => i.id === itemCargado.id) || {};
                return (
                  <ListGroupItem key={itemCargado.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{suministroInfo.nombre || `Item #${itemCargado.id}`}</h6>
                      <small className="text-muted">Cant: {itemCargado.cantidad}</small>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1">
                      <ButtonGroup size="sm">
                        <Button 
                          outline 
                          color="secondary" 
                          onClick={() => manejarCambioUnidades(itemCargado.id, itemCargado.cantidad - 1)}
                        >
                          -
                        </Button>
                        <Button 
                          outline 
                          color="secondary" 
                          onClick={() => manejarCambioUnidades(itemCargado.id, itemCargado.cantidad + 1)}
                        >
                          +
                        </Button>
                      </ButtonGroup>
                      <Button 
                        color="danger" 
                        outline 
                        size="sm" 
                        onClick={() => manejarEliminar(itemCargado.id)}
                      >
                        Desembarcar
                      </Button>
                    </div>
                  </ListGroupItem>
                );
              })
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default App;