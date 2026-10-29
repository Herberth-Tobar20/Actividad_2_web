import { pedirJSON } from './apiClient';

export async function getCarga() {
    return pedirJSON('/api/carga', {
    method: 'GET',
    });
}

export async function agregarCargaAPI(equipoId, cantidad = 1) {
    return pedirJSON('/api/carga/agregar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipoId, cantidad }),
    });
}

export async function actualizarUnidadesAPI(id, cantidad) {
    return pedirJSON(`/api/carga/actualizar-unidades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad }),
    });
}

export async function eliminarCargaAPI(id) {
    return pedirJSON(`/api/carga/eliminar/${id}`, {
    method: 'DELETE',
    });
}