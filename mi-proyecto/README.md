# 🚀 Mi Dashboard

Aplicación web construida con **React + Vite** que integra dos fuentes de datos en una sola interfaz:

- **☁️ Cloudflare** — Dashboard con información de cuenta, dominios, tokens de API y datos de conexión en tiempo real.
- **🛸 Rick & Morty** — Explorador de personajes con buscador que consulta directamente la API pública.

---

## 📋 Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| [Node.js](https://nodejs.org/) | 18.x o superior |
| npm | 9.x o superior (viene con Node) |
| Cuenta de Cloudflare | Necesaria para la vista de CF |

---

## ⚡ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/lauravramirez27/pruebaMTD.git
cd pruebaMTD/mi-proyecto
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto (`mi-proyecto/.env`):

```env
VITE_CF_TOKEN=tu_token_de_cloudflare
VITE_CF_ACCOUNT_ID=tu_account_id_de_cloudflare
```

> **¿Cómo obtener estos valores?** — Ver sección [Configuración de Cloudflare](#️-configuración-de-cloudflare) más abajo.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 🔧 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Genera el bundle de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint sobre el código fuente |

---

## ☁️ Configuración de Cloudflare

### Obtener el Account ID

1. Inicia sesión en [dashboard.cloudflare.com](https://dashboard.cloudflare.com)
2. En la barra lateral derecha de la página principal, copia el **Account ID**

### Crear un API Token

1. Ve a **My Profile → API Tokens → Create Token**
2. Usa la plantilla **"Edit Cloudflare Workers"** o crea uno personalizado
3. Agrega los siguientes permisos según las secciones que quieras usar:

| Permiso | Tipo | Para qué |
|---|---|---|
| `Account → Account → Read` | Account | ✅ Obligatorio — info de cuenta |
| `Zone → Zone → Read` | Zone | Ver listado de dominios |
| `User → API Tokens → Read` | User | Ver listado de tokens |

4. Haz clic en **"Continue to Summary"** → **"Create Token"**
5. Copia el token generado (solo se muestra una vez)

> **⚠️ Importante:** El token va en `.env` como `VITE_CF_TOKEN`. El archivo `.env` está en `.gitignore` y **no debe subirse al repositorio**.

---

## 🏗️ Estructura del proyecto

```
mi-proyecto/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── CloudflareView.jsx   # Dashboard de Cloudflare
│   │   └── RickMortyView.jsx    # Explorador Rick & Morty
│   ├── App.jsx              # Componente raíz + navegación
│   ├── App.css              # Estilos globales
│   ├── main.jsx             # Entry point de React
│   └── index.css            # Reset CSS base
├── .env                     # Variables de entorno (NO subir a git)
├── .env.example             # Plantilla de variables (sí subir)
├── vite.config.js           # Configuración de Vite + proxy
├── package.json
└── README.md
```

---

## 🌐 Cómo funciona el proxy de Vite

La API de Cloudflare **no permite llamadas directas desde el navegador** (CORS bloqueado). Para resolverlo, en `vite.config.js` se configura un proxy que redirige las peticiones:

```
Navegador → http://localhost:5173/cf-api/...
                    ↓ (Vite redirige en el servidor)
         → https://api.cloudflare.com/...
```

Así, las peticiones salen del servidor de desarrollo (no del navegador) y el CORS no aplica.

> **Nota:** Este proxy solo funciona con `npm run dev`. En producción necesitarías un backend intermediario (ej. un Cloudflare Worker, un servidor Express, o similar).

---

## 🛸 Vista Rick & Morty

Consume la [Rick and Morty API](https://rickandmortyapi.com/) pública — no requiere autenticación.

**Funcionalidades:**
- Carga inicial de personajes
- **Buscador** con debounce de 500ms que consulta la API por nombre
- Botón de limpiar búsqueda
- Estado de carga y mensaje "no encontrado"

---

## 🐛 Problemas frecuentes

| Error | Causa | Solución |
|---|---|---|
| `CORS blocked` | Llamando a CF directamente sin proxy | Asegúrate de usar `npm run dev` y que `vite.config.js` tiene el proxy |
| `403 Forbidden` | Token sin los permisos necesarios | Revisa los permisos del token en el dashboard de CF |
| `429 Too Many Requests` | Rate limit de CF por doble montaje en StrictMode | Ya resuelto con `AbortController` en el código |
| Variables `undefined` | `.env` mal ubicado o sin el prefijo `VITE_` | El archivo debe estar en `mi-proyecto/.env` y las vars deben empezar con `VITE_` |

---

## 🛠️ Tecnologías

- [React 19](https://react.dev/) — Framework UI
- [Vite 8](https://vite.dev/) — Bundler y dev server con proxy
- [Cloudflare API v4](https://developers.cloudflare.com/api/) — Datos de cuenta/zonas/tokens
- [Rick and Morty API](https://rickandmortyapi.com/) — Datos de personajes
- [1.1.1.1 Trace](https://1.1.1.1/cdn-cgi/trace) — Datos de conexión en tiempo real

---

## 📄 Licencia

Proyecto de uso educativo / prueba técnica.
