# Gemini Bulk File Downloader

Una poderosa extensión de Chrome para escanear páginas web y descargar archivos en masa, potenciada por Gemini AI.

![Gemini Bulk File Downloader](image.png)

## Características

### Escaneo Inteligente
- **Escaneo Estándar**: Análisis rápido y gratuito mediante parsing del DOM
- **Escaneo Profundo con IA**: Usa Gemini AI para detectar archivos en páginas complejas
- **Procesamiento por Lotes**: Escanea múltiples URLs simultáneamente (Función Pro)

### Interfaz Moderna
- Diseño oscuro y minimalista
- Filtros por tipo de archivo (Imágenes, Videos, Audio, Documentos, Archivos)
- Búsqueda en tiempo real
- Paginación automática
- Auto-detección de URL actual

### Tipos de Archivo Soportados
- **Imágenes**: JPG, PNG, GIF, WebP, SVG, ICO, BMP, TIFF
- **Videos**: MP4, WebM, AVI, MOV, MKV, FLV, WMV, M4V
- **Audio**: MP3, WAV, OGG, M4A, FLAC, AAC, WMA
- **Documentos**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF
- **Archivos**: ZIP, RAR, TAR, GZ, 7Z, BZ2, XZ
- **Otros**: APK, EXE, DMG, ISO, DEB, RPM, y más

## Instalación

### Requisitos Previos
- Node.js 18+ y npm
- Cuenta de Google Cloud con acceso a Gemini API
- Cuenta de Vercel (para el proxy)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd bulk-downloader
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_PROXY_URL=https://your-proxy-url.vercel.app/api/scrape
```

### 4. Desplegar el Proxy CORS

El proxy es necesario para evitar restricciones CORS al escanear páginas web.

**Opción A: Usando tu propia cuenta de Vercel**

```bash
cd gemini-proxy
vercel deploy --prod
```

Copia la URL generada y actualiza `VITE_PROXY_URL` en tu archivo `.env`.

**Opción B: Configuración Manual**

1. Ve a [vercel.com](https://vercel.com)
2. Crea un nuevo proyecto
3. Importa la carpeta `gemini-proxy`
4. Despliega

### 5. Generar Iconos

```bash
npm run generate-icons
```

### 6. Compilar la Extensión

```bash
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos de la extensión.

### 7. Cargar en Chrome

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el "Modo de desarrollador" (esquina superior derecha)
3. Haz clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `dist/`

## Configuración de Usuario

### Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea un nuevo proyecto o selecciona uno existente
3. Genera una nueva API key
4. Copia la clave

### Configurar la Extensión

1. Haz clic derecho en el icono de la extensión
2. Selecciona "Opciones" o "Options"
3. Pega tu API key de Gemini
4. Haz clic en "Guardar"

## Uso

### Escaneo Simple

1. Navega a cualquier página web
2. Haz clic en el icono de la extensión
3. La URL actual se cargará automáticamente
4. Haz clic en "Standard Scan" para un análisis rápido

### Escaneo Profundo con IA

1. Asegúrate de haber configurado tu API key de Gemini
2. Haz clic en "AI Deep Scan"
3. La IA analizará la página en detalle
4. Usuarios gratuitos tienen 5 escaneos incluidos

### Procesamiento por Lotes

1. Haz clic en "Batch Scan" (solo Pro)
2. Ingresa múltiples URLs, una por línea
3. Espera a que todos los escaneos se completen

### Filtrar y Buscar

- Usa los botones de filtro para ver tipos específicos de archivos
- Escribe en la barra de búsqueda para filtrar por nombre, URL o tipo
- Navega entre páginas si hay muchos resultados

### Descargar Archivos

1. Selecciona los archivos que deseas descargar
2. Haz clic en "Download Selected" en la barra inferior
3. Los archivos se descargarán a tu carpeta de Descargas

## Desarrollo

### Scripts Disponibles

```bash
# Modo desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Verificar tipos de TypeScript
npm run typecheck

# Limpiar carpeta dist
npm run clean

# Generar iconos desde SVG
npm run generate-icons
```

### Estructura del Proyecto

```
bulk-downloader/
├── components/          # Componentes React
│   ├── Header.tsx
│   ├── UrlInputForm.tsx
│   ├── FilterBar.tsx
│   ├── FileList.tsx
│   ├── ActionBar.tsx
│   ├── ProModal.tsx
│   └── WelcomeSplash.tsx
├── services/           # Lógica de negocio
│   └── geminiService.ts
├── icons/              # Iconos de la extensión
│   ├── icon.svg
│   └── icon*.png
├── manifest.json       # Configuración de Chrome
├── popup.html         # Página principal
├── options.html       # Página de configuración
├── App.tsx            # Componente raíz
├── options.tsx        # Componente de opciones
└── types.ts           # Definiciones TypeScript
```

### Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Chrome    │─────>│    Proxy     │─────>│  Página Web │
│  Extension  │      │   (Vercel)   │      │   Objetivo  │
└─────────────┘      └──────────────┘      └─────────────┘
       │
       ├─ DOM Parsing (Escaneo Estándar)
       │
       └─ Gemini AI (Escaneo Profundo)
```

## Seguridad

- **API Keys**: Almacenadas localmente usando `chrome.storage.sync`
- **CORS Proxy**: Incluye rate limiting (30 req/min por IP)
- **SSRF Protection**: Bloquea acceso a localhost y redes privadas
- **Timeout**: Máximo 15 segundos por petición
- **Límite de Tamaño**: Máximo 5MB por respuesta

## Limitaciones

- El escaneo estándar solo detecta archivos enlazados en el HTML
- El escaneo con IA requiere una API key válida de Gemini
- El proxy tiene un límite de 30 peticiones por minuto por IP
- Usuarios gratuitos tienen 5 escaneos de IA incluidos

## Modelo Freemium

### Versión Gratuita
- Escaneo estándar ilimitado
- 5 escaneos con IA incluidos
- Descargas ilimitadas
- Todos los filtros y búsqueda

### Versión Pro (Próximamente)
- Escaneos con IA ilimitados
- Procesamiento por lotes (múltiples URLs)
- Soporte prioritario
- Nuevas funciones exclusivas

## Tecnologías

- **Frontend**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **Estilos**: Tailwind CSS 3
- **IA**: Google Gemini API
- **Backend**: Vercel Serverless Functions
- **Generación de Iconos**: Sharp

## Licencia

Este proyecto es privado y de uso personal.

## Soporte

Para reportar bugs o solicitar funciones, contacta al desarrollador.

---

**¿Te gusta esta extensión?** Considera dejar una reseña en Chrome Web Store.
