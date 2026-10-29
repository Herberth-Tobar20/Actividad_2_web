import { ListGroup, ListGroupItem, ButtonGroup, Button, Badge } from 'reactstrap';

function BodegaLateral({ items, onAumentar, onDisminuir, onQuitar }) {
  if (items.length === 0) {
    return <p className="text-muted">Tu bodega está vacía.</p>;
  }

  return (
    <ListGroup>
      {items.map((item) => (
        <ListGroupItem
          key={item.id}
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{item.nombre}</strong>
            <Badge color="dark" pill className="ms-2">
              {item.cantidad}
            </Badge>
          </div>

          <div>
            <ButtonGroup size="sm" className="me-2">
              <Button onClick={() => onDisminuir(item)}>-</Button>
              <Button onClick={() => onAumentar(item)}>+</Button>
            </ButtonGroup>
            <Button color="danger" outline size="sm" onClick={() => onQuitar(item.id)}>
              Desembarcar
            </Button>
          </div>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}

export default BodegaLateral;