// [persona 2] ejercicio 1: estabiliza el reactor

const generar_temperatura = () => Math.floor(Math.random() * 100) + 1;

// temperatura de estabilización: se genera al iniciar el servidor
let temperatura_objetivo = generar_temperatura();

export function ajustar(req, res) {
  const temperatura = req.body?.temperatura;

  if (!Number.isInteger(temperatura) || temperatura < 1 || temperatura > 100) {
    return res.status(400).json({ mensaje: 'La temperatura debe ser un número entero entre 1 y 100' });
  }

  if (temperatura === temperatura_objetivo) {
    return res.json({ resultado: 'estabilizado', mensaje: '¡Reactor estabilizado!' });
  }

  // si la ideal es mayor que la ingresada, hay que subirla
  const resultado = temperatura_objetivo > temperatura ? 'más alta' : 'más baja';
  res.json({ resultado, mensaje: `La temperatura ideal es ${resultado}` });
}

export function reiniciar(req, res) {
  temperatura_objetivo = generar_temperatura();
  res.json({ mensaje: 'Reactor reiniciado' });
}
