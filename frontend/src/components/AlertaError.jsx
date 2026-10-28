import { UncontrolledAlert } from 'reactstrap';

function AlertaError({ mensaje }) {
  if (!mensaje) return null;

  return <UncontrolledAlert color="warning">{mensaje}</UncontrolledAlert>;
}

export default AlertaError;