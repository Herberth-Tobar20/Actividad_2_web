const API_URL = 'http://localhost:3000';

export async function pedirJSON(ruta, opciones = {}) {
    const respuesta = await fetch(`${API_URL}${ruta}`, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Error en la petición');
}

    return datos;
}