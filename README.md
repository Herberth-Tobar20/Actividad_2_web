# AstroLogistics Ltd. — Manifiesto de Carga

Aplicación full stack para preparar la carga de una nave espacial antes del despegue. El capitán administra un presupuesto de **500 créditos** y una ventana de lanzamiento de **10 minutos** para elegir suministros, ajustar unidades y despegar.

**Evaluación 2 — Programación Web — UCA**
Ciclo 02-2026 · Sección 02 · Equipos de 4 personas

---

## Funcionalidades

- **Catálogo de suministros**: cuadrícula de cards con nombre, categoría, precio y stock disponible.
- **Tu Bodega de Carga**: panel lateral con las unidades seleccionadas, botones `-` / `+` y "Desembarcar".
- **Validaciones del backend**: no se puede superar el stock de la base ni los créditos de la misión. El error se muestra con un `UncontrolledAlert` amarillo.
- **Cuenta regresiva de sesión**: sincronizada con el servidor; al llegar a cero invita a reiniciar la sesión.
- **Estabiliza el Reactor**: formulario de temperatura (1–100) con historial de intentos, mensajes del servidor y estado "estabilizado".

---

## Stack

| Capa | Tecnologías |
|---|---|
| Backend | Node.js, Express, CORS |
| Frontend | React, Vite, Reactstrap (Bootstrap 5) |
| Estado | En memoria (sin base de datos) |
| API | REST, JSON |

---

## Requisitos

- **Node.js 18 o superior** (incluye `npm`)
- Dos terminales abiertas

---

## Instalación y ejecución

El proyecto tiene **dos carpetas independientes**. Cada una necesita su propio `npm install`, y se levantan en **dos terminales distintas**.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

Queda escuchando en **http://localhost:3000**.

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir **http://localhost:5173** en el navegador.

> El backend solo acepta peticiones desde `http://localhost:5173` (CORS). Si Vite toma otro puerto porque el 5173 está ocupado, hay que liberarlo o ajustar el origen en `backend/server.js`.

### Scripts disponibles

| Carpeta | Comando | Qué hace |
|---|---|---|
| `backend` | `npm run dev` | Inicia el servidor con recarga automática (`node --watch`) |
| `backend` | `npm start` | Inicia el servidor sin recarga |
| `frontend` | `npm run dev` | Servidor de desarrollo de Vite |
| `frontend` | `npm run build` | Compila para producción en `dist/` |
| `frontend` | `npm run preview` | Sirve la compilación de producción |
| `frontend` | `npm run lint` | Analiza el código con Oxlint |

---

## Endpoints

### Inventario

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/inventario` | Lista los suministros de la base |

### Carga de la nave

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| `GET` | `/api/carga` | — | Créditos disponibles, ítems cargados y costo total |
| `POST` | `/api/carga/agregar` | `{ "equipoId": 201, "cantidad": 1 }` | Añade unidades a la nave |
| `PUT` | `/api/carga/actualizar-unidades/:id` | `{ "cantidad": 3 }` | Fija las unidades de un ítem (`0` lo desembarca) |
| `DELETE` | `/api/carga/eliminar/:id` | — | Desembarca el suministro y devuelve el stock |

### Sesión

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/sesion` | Segundos restantes y si la sesión expiró |
| `POST` | `/api/sesion/reiniciar` | Restaura stock y carga, y reinicia el contador |

### Reactor

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| `POST` | `/adjust` | `{ "temperatura": 50 }` | Devuelve `más alta`, `más baja` o `estabilizado` |
| `POST` | `/reboot` | — | Genera una nueva temperatura objetivo |

### Formato de respuesta de la carga

```json
{
  "creditos": 500,
  "itemsCargados": [{ "id": 201, "cantidad": 2 }],
  "total": 100
}
```

---

## Reglas de negocio

- **Presupuesto inicial:** 500 créditos.
- **Inventario:** 6 suministros (ids `201` a `206`). El `206` arranca con stock `0` y el botón queda deshabilitado como "Agotado en Base".
- **Stock:** al añadir unidades baja el stock de la base; al desembarcar, vuelve.
- **Errores del backend:** `"Stock en base insuficiente"` y `"Créditos insuficientes para esta cantidad"`.
- **Sesión:** dura **600 segundos** desde que arranca el servidor. Con la sesión vencida, toda petición que no sea `GET` a `/api/carga` responde `403` con `"La sesión expiró. Reinicia la sesión para continuar"`.

> La sesión es **global**: el contador arranca cuando se inicia `node server.js`, no cuando se abre el navegador. Para una demostración, conviene reiniciar el backend justo antes.

---

## Estructura del proyecto

```
Actividad_2_web/
├── backend/
│   ├── server.js                 # App Express, middlewares y montaje de rutas
│   └── src/
│       ├── controllers/          # Lógica de inventario, carga, reactor y sesión
│       ├── routes/               # Routers de Express
│       └── data/estado.js        # Estado en memoria (inventario, carga, créditos)
│
└── frontend/
    ├── index.html
    └── src/
        ├── App.jsx               # Composición de la pantalla
        ├── api/                  # Cliente HTTP y llamadas por dominio
        └── components/           # BodegaLateral, AlertaError, CuentaRegresiva, Reactor
```

---

## Notas

- `node_modules/` y `dist/` **no** están versionados: después de clonar hay que ejecutar `npm install` en `backend` y en `frontend`.
- El estado vive en memoria: al reiniciar el backend, el inventario y la carga vuelven a su estado inicial.
- No se requiere ningún archivo `.env` ni base de datos.
