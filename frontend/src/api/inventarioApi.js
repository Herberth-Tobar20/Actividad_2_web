import { pedirJSON } from './apiClient';

export async function getInventario() {
    return pedirJSON('/api/inventario', {
    method: 'GET',
    });
}