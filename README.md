# Actividad 2 – Programación Web (Ciclo 02, 2026)

Aplicación web con integración Frontend – Backend que resuelve dos problemas:

1. **Ejercicio 1: "Estabiliza el Reactor"**: adivinar la temperatura de estabilización (1–100) con pistas "más alta" / "más baja".
2. **Caso de negocio: AstroLogistics Ltd.**: el capitán arma el manifiesto de la nave con un presupuesto de misión (créditos) y un inventario con stock limitado.

El estado vive **en memoria** (sin base de datos): al reiniciar el servidor todo vuelve a los valores iniciales.

## Tecnologías

| Capa | Herramientas |
|---|---|
| Backend | Node.js, Express 4, CORS (ES Modules) |
| Frontend | React 19, Vite, Reactstrap / Bootstrap 5 |

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior, versión LTS recomendada (incluye `npm`). Comprueba con `node -v`.
- [Git](https://git-scm.com/).

## Estructura del proyecto

```
Actividad_2_web/
├── README.md
├── backend/
│   ├── server.js                          # servidor Express, CORS y montaje de rutas
│   ├── package.json
│   └── src/
│       ├── data/estado.js                 # inventario, carga y helpers (estado compartido)
│       ├── controllers/
│       │   ├── inventario.controller.js   # GET /api/inventario
│       │   ├── carga.controller.js        # GET /api/carga, POST /api/carga/agregar
│       │   ├── carga_edicion.controller.js# PUT actualizar-unidades, DELETE eliminar
│       │   └── reactor.controller.js      # POST /adjust, POST /reboot
│       └── routes/
│           ├── inventario.routes.js
│           ├── carga.routes.js
│           ├── carga_edicion.routes.js
│           └── reactor.routes.js
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/                           # llamadas fetch al backend
        └── components/                    # BodegaLateral, Reactor, AlertaError, CuentaRegresiva
```

## Instalación y ejecución

El backend y el frontend se ejecutan por separado, cada uno en **su propia terminal**.

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd Actividad_2_web
```

### 2. Backend (puerto 3000)

```bash
cd backend
npm install
npm run dev
```

Debe imprimir:

```
Servidor Express escuchando en http://localhost:3000
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor y lo reinicia al guardar cambios (`node --watch`) |
| `npm start` | Inicia el servidor una sola vez |

Para usar otro puerto: `PORT=3001 npm run dev` (en PowerShell: `$env:PORT=3001; npm run dev`). Si lo cambias, actualiza también la URL base en `frontend/src/api/`.

### 3. Frontend (puerto 5173)

En otra terminal, desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

Abre en el navegador la dirección que muestra Vite, normalmente **http://localhost:5173**.

Otros comandos: `npm run build` (compilar para producción), `npm run lint` (revisar el código).

> **Importante:** el backend solo acepta peticiones del origen `http://localhost:5173` (CORS). Si Vite arranca en otro puerto porque el 5173 está ocupado, agrega ese origen en `backend/server.js`.

## API del backend

URL base: `http://localhost:3000`. Todas las respuestas son JSON y los errores usan la forma `{ "mensaje": "..." }`.

### AstroLogistics

| Método | Ruta | Descripción | Cuerpo |
|---|---|---|---|
| GET | `/api/inventario` | Lista de suministros con precio y stock | – |
| GET | `/api/carga` | Carga activa, créditos disponibles y total | – |
| POST | `/api/carga/agregar` | Añade un suministro a la nave y descuenta stock | `{ "equipoId": 201, "cantidad": 1 }` |
| PUT | `/api/carga/actualizar-unidades/:id` | Fija la cantidad de un suministro en la carga (`0` lo desembarca) | `{ "cantidad": 3 }` |
| DELETE | `/api/carga/eliminar/:id` | Quita el suministro y devuelve las unidades al stock | – |

Respuesta de `GET /api/carga` (y de las operaciones que modifican la carga):

```json
{ "creditos": 400, "itemsCargados": [{ "id": 201, "cantidad": 2 }], "total": 100 }
```

Errores de negocio:

| Código | Mensaje | Cuándo |
|---|---|---|
| 400 | `Stock en base insuficiente` | Se pide más de lo que hay en el inventario |
| 400 | `Créditos insuficientes para esta cantidad` | El costo supera los créditos disponibles |
| 400 | `equipoId y cantidad deben ser enteros positivos` | Datos de entrada inválidos en `agregar` |
| 404 | `El suministro no existe en el inventario` | `equipoId` desconocido |
| 404 | `El suministro no está en la carga` | `PUT` o `DELETE` sobre algo que no se cargó |

### Reactor

| Método | Ruta | Descripción | Cuerpo |
|---|---|---|---|
| POST | `/adjust` | Compara la temperatura enviada con la de estabilización | `{ "temperatura": 50 }` |
| POST | `/reboot` | Reinicia el sistema y genera una nueva temperatura | – |

`/adjust` responde `{ "resultado": "más alta" | "más baja" | "estabilizado", "mensaje": "..." }`. La temperatura debe ser un **entero entre 1 y 100** (un 400 si no lo es).

## Cómo probar el backend

Con el servidor en marcha, desde otra terminal. El estado es en memoria, así que reinicia el servidor antes de una tanda de pruebas.

**Linux / macOS / Git Bash:**

```bash
curl http://localhost:3000/api/inventario
curl http://localhost:3000/api/carga

curl -X POST http://localhost:3000/api/carga/agregar \
  -H "Content-Type: application/json" \
  -d '{"equipoId":201,"cantidad":2}'

curl -X PUT http://localhost:3000/api/carga/actualizar-unidades/201 \
  -H "Content-Type: application/json" \
  -d '{"cantidad":3}'

curl -X DELETE http://localhost:3000/api/carga/eliminar/201

curl -X POST http://localhost:3000/adjust \
  -H "Content-Type: application/json" \
  -d '{"temperatura":50}'
```

**Windows PowerShell** (`curl` es un alias de otro comando; usa `Invoke-RestMethod`):

```powershell
Invoke-RestMethod http://localhost:3000/api/inventario
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/carga/agregar `
  -ContentType 'application/json' -Body '{"equipoId":201,"cantidad":2}'
```

También sirven **Postman** o **Thunder Client** (extensión de VS Code).

Resultado esperado del `POST /api/carga/agregar` con 2 tanques de 50 Cr, partiendo de 500 créditos: `creditos: 400`, `total: 100`.

## Flujo de trabajo en equipo (gitflow)

- `main`: versión estable.
- `develop`: integración del equipo.
- `feature/*`: una rama por integrante o tarea, siempre creada desde `develop`.

```bash
git checkout develop && git pull
git checkout -b feature/nombre-de-la-tarea
# ... trabajar ...
git add <archivos>
git commit -m "feat(alcance): descripción breve"
git push -u origin feature/nombre-de-la-tarea
# abrir Pull Request hacia develop
```

Convención de commits: `feat`, `fix`, `docs`, `refactor`, seguido del alcance entre paréntesis.

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Missing script: "dev"` | `package.json` sin el script | Revisa que `backend/package.json` tenga `"dev": "node --watch server.js"` |
| `Cannot use import statement outside a module` / `require is not defined` | Falta `"type": "module"` | Agrégalo en `backend/package.json` |
| `Cannot find module '.../estado.js'` | Falta el archivo de estado | Haz `git pull` de `develop`; debe existir `backend/src/data/estado.js` |
| `EADDRINUSE` | El puerto 3000 ya está en uso | Cierra el otro proceso o usa otro `PORT` |
| Error de CORS en la consola del navegador | Vite corre en un puerto distinto de 5173 | Agrega ese origen en `backend/server.js` |
| `req.body` es `undefined` | Falta `Content-Type: application/json` en la petición | Envía el encabezado correcto |
| El catálogo muestra suministros de ejemplo que no están en `estado.js` | El frontend usa datos simulados | Revisa `USE_MOCK` en `frontend/src/api/reactorApi.js` y ponlo en `false` |
| Los resultados de las pruebas no coinciden | El estado en memoria quedó modificado | Reinicia el servidor |

## Licencia

Consulta el archivo [LICENSE](LICENSE).
