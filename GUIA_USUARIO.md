# Guía de Usuario - FileHarvest

Bienvenido a **FileHarvest**, la extensión de Chrome que te permite encontrar y descargar archivos de cualquier página web de forma rápida y sencilla.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Configuración Inicial](#configuración-inicial)
3. [Cómo Usar la Extensión](#cómo-usar-la-extensión)
4. [Funciones Avanzadas](#funciones-avanzadas)
5. [Solución de Problemas](#solución-de-problemas)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Instalación

### Desde Chrome Web Store (Próximamente)

1. Visita la página de la extensión en Chrome Web Store
2. Haz clic en "Agregar a Chrome"
3. Confirma haciendo clic en "Agregar extensión"
4. La extensión aparecerá en tu barra de herramientas

### Instalación Manual (Para Desarrolladores)

Si tienes el código fuente:

1. Descarga y descomprime el archivo de la extensión
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador" (interruptor en la esquina superior derecha)
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `dist/` de la extensión

---

## Configuración Inicial

### Obtener tu API Key de IA

Para usar la función de **Escaneo Profundo con IA**, necesitas una clave de API de Google AI:

1. **Visita Google AI Studio**
   - Ve a [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Inicia sesión** con tu cuenta de Google

3. **Crea una API Key**
   - Haz clic en "Create API Key"
   - Si es tu primera vez, acepta los términos de servicio
   - Selecciona o crea un proyecto de Google Cloud
   - Copia la clave generada

4. **Guarda tu API Key de forma segura**
   - No compartas esta clave con nadie
   - Guárdala en un lugar seguro (como un gestor de contraseñas)

### Configurar la Extensión

1. **Abre la Página de Opciones**
   - Haz clic derecho en el icono de la extensión en la barra de herramientas
   - Selecciona "Opciones" del menú

   O también puedes:
   - Ir a `chrome://extensions/`
   - Buscar "FileHarvest"
   - Hacer clic en "Detalles"
   - Seleccionar "Opciones de la extensión"

2. **Ingresa tu API Key**
   - Pega la clave de API que copiaste de Google AI Studio
   - Haz clic en "Guardar API Key"
   - Verás un mensaje de confirmación en verde

3. **¡Listo!**
   - Tu clave está almacenada de forma segura en tu navegador
   - Solo tú tienes acceso a ella
   - Se sincronizará con tu cuenta de Chrome si tienes sincronización activada

---

## Cómo Usar la Extensión

### Escaneo Básico (Gratuito)

El **Escaneo Estándar** analiza el código HTML de la página para encontrar enlaces a archivos.

**Pasos:**

1. **Navega a la página web** que quieres escanear
2. **Haz clic en el icono** de FileHarvest en tu barra de herramientas
3. La URL de la página actual se cargará automáticamente en el campo de entrada
4. **Haz clic en "Standard Scan"**
5. Espera unos segundos mientras se realiza el análisis
6. Los archivos encontrados aparecerán en una lista

**¿Qué detecta el Escaneo Estándar?**
- Enlaces directos a archivos en etiquetas `<a>`, `<img>`, `<video>`, `<audio>`, `<source>`, etc.
- Archivos con extensiones comunes (JPG, PDF, MP4, ZIP, etc.)
- Funciona en la mayoría de páginas web simples

### Escaneo Profundo con IA

El **AI Deep Scan** usa inteligencia artificial para encontrar archivos que el escaneo estándar podría no detectar.

**Pasos:**

1. Asegúrate de haber configurado tu API Key (ver [Configuración Inicial](#configuración-inicial))
2. **Navega a la página web** que quieres escanear
3. **Haz clic en el icono** de la extensión
4. **Haz clic en "AI Deep Scan"** (botón dorado)
5. La IA analizará el contenido de la página en profundidad
6. Los archivos encontrados se agregarán a la lista

**¿Cuándo usar AI Deep Scan?**
- Páginas con contenido dinámico o cargado con JavaScript
- Sitios con galerías de imágenes complejas
- Cuando el escaneo estándar no encuentra todos los archivos
- Páginas con archivos incrustados de forma no convencional

**Límites:**
- **Usuarios Gratuitos**: 5 escaneos de IA incluidos
- **Usuarios Pro**: Escaneos ilimitados (próximamente)

### Filtrar Resultados

Una vez que tengas archivos en la lista, puedes filtrarlos por tipo:

- **All**: Muestra todos los archivos encontrados
- **Image**: Solo imágenes (JPG, PNG, GIF, etc.)
- **Video**: Solo videos (MP4, WebM, AVI, etc.)
- **Audio**: Solo archivos de audio (MP3, WAV, etc.)
- **Document**: Solo documentos (PDF, DOCX, etc.)
- **Archive**: Solo archivos comprimidos (ZIP, RAR, etc.)

Haz clic en el botón correspondiente para aplicar el filtro.

### Buscar Archivos

Si tienes muchos archivos, puedes buscar específicamente:

1. Haz clic en la **barra de búsqueda** (icono de lupa)
2. Escribe el nombre del archivo, URL o tipo
3. La lista se filtrará automáticamente en tiempo real
4. Para limpiar la búsqueda, haz clic en la "X"

### Seleccionar Archivos para Descargar

**Selección Individual:**
- Haz clic en la casilla junto a cada archivo que quieras descargar

**Seleccionar Todos:**
- Haz clic en la casilla en el encabezado de la tabla
- Esto seleccionará todos los archivos visibles (según el filtro actual)

**Ver Selección:**
- El número de archivos seleccionados aparece en la parte inferior
- La barra de acción se mostrará cuando tengas al menos un archivo seleccionado

### Descargar Archivos

1. **Selecciona** los archivos que quieres descargar
2. Haz clic en **"Download Selected"** en la barra inferior
3. Los archivos comenzarán a descargarse automáticamente
4. Se guardarán en tu carpeta de Descargas predeterminada de Chrome

**Nota sobre Descargas Masivas:**
- Chrome puede pedirte permiso para "descargar múltiples archivos"
- Haz clic en "Permitir" para continuar
- Algunos navegadores limitan las descargas simultáneas (Chrome permite ~6 por vez)

---

## Funciones Avanzadas

### Procesamiento por Lotes (Solo Pro)

Los usuarios Pro pueden escanear múltiples URLs a la vez:

1. Haz clic en **"Batch Scan"**
2. Ingresa múltiples URLs, **una por línea**:
   ```
   https://example.com/page1
   https://example.com/page2
   https://example.com/page3
   ```
3. Haz clic en **"Start Batch Scan"**
4. La extensión escaneará todas las URLs en paralelo
5. Los resultados se combinarán en una sola lista
6. Se eliminarán archivos duplicados automáticamente

**Ventajas:**
- Ahorra tiempo al escanear múltiples páginas
- Procesa todas las URLs simultáneamente
- Ideal para descargar recursos de varios artículos o galerías

### Paginación

Cuando tienes muchos archivos (más de 20), la extensión los organiza en páginas:

- **20 archivos por página**
- Usa los botones **"Previous"** y **"Next"** para navegar
- El indicador muestra "Page X of Y"
- El contador muestra cuántos archivos hay en total

---

## Solución de Problemas

### No aparecen archivos después del escaneo

**Posibles causas:**
- La página no tiene archivos descargables
- Los archivos están cargados dinámicamente con JavaScript (prueba AI Deep Scan)
- La página está bloqueando el acceso

**Solución:**
1. Intenta con **AI Deep Scan** si usaste Standard Scan
2. Verifica que la página realmente tenga archivos descargables
3. Revisa la consola de Chrome (F12) para ver si hay errores

### Error: "API key is not configured"

**Causa:** No has configurado tu API Key de IA

**Solución:**
1. Haz clic en el botón **"Open Settings"** en el mensaje de error
2. Sigue las instrucciones en [Configuración Inicial](#configuración-inicial)
3. Guarda tu API Key
4. Intenta el escaneo nuevamente

### Error: "You are out of AI scans"

**Causa:** Has usado tus 5 escaneos gratuitos

**Solución:**
1. Puedes seguir usando el **Escaneo Estándar** (ilimitado)
2. Espera hasta el próximo mes para recibir más créditos (si implementamos reinicio mensual)
3. Actualiza a la versión Pro para escaneos ilimitados (próximamente)

### La descarga no inicia

**Posibles causas:**
- El archivo ya no existe en el servidor
- El servidor requiere autenticación
- Chrome bloqueó la descarga por seguridad

**Solución:**
1. Intenta descargar el archivo manualmente (copia la URL y pégala en el navegador)
2. Verifica que tengas permisos de descarga en Chrome
3. Revisa si Chrome bloqueó la descarga en la barra de direcciones

### La extensión está lenta

**Posibles causas:**
- Estás escaneando una página muy grande
- Tienes miles de archivos en la lista
- El proxy está experimentando tráfico alto

**Solución:**
1. Espera a que termine el escaneo actual
2. Usa filtros y búsqueda para reducir la lista visible
3. Limpia los resultados haciendo un nuevo escaneo

### Errores de CORS o "Failed to fetch"

**Causa:** Problemas con el proxy CORS o la conexión

**Solución:**
1. Verifica tu conexión a Internet
2. Intenta nuevamente en unos minutos
3. Si el problema persiste, el proxy podría estar caído (contacta al desarrollador)

---

## Preguntas Frecuentes

### ¿Es seguro usar esta extensión?

Sí, la extensión:
- No almacena ni comparte tus datos personales
- Tu API Key se guarda solo en tu navegador
- No enviamos información a servidores externos (excepto al proxy para escaneos)
- Es de código abierto (puedes revisar el código)

### ¿Necesito pagar por la API de IA?

Google ofrece un nivel gratuito generoso para su API de IA que es suficiente para uso personal. Solo pagarías si excedes los límites gratuitos, lo cual es poco probable con uso normal.

### ¿Qué es el escaneo estándar?

Es un análisis rápido que busca enlaces a archivos en el código HTML de la página. No usa IA, por lo que es completamente gratuito e ilimitado.

### ¿Qué diferencia hay con el AI Deep Scan?

El AI Deep Scan usa inteligencia artificial para:
- Analizar contenido dinámico cargado con JavaScript
- Encontrar archivos incrustados de formas no convencionales
- Detectar patrones y URLs que el escaneo estándar no puede ver

### ¿Puedo usar la extensión sin API Key?

Sí, puedes usar el **Escaneo Estándar** sin ninguna configuración. Solo necesitas la API Key si quieres usar el **AI Deep Scan**.

### ¿Los archivos se descargan directamente de la página original?

Sí, la extensión solo encuentra las URLs de los archivos. Las descargas se hacen directamente desde el servidor original, no pasan por ningún intermediario.

### ¿Funciona en cualquier página web?

Funciona en la mayoría de páginas web públicas. No funcionará en:
- Páginas locales (file://)
- Páginas de configuración del navegador (chrome://)
- Páginas que requieren iniciar sesión complejo
- Páginas con protecciones anti-scraping muy agresivas

### ¿Puedo descargar archivos de sitios con autenticación?

Si ya has iniciado sesión en la página web en tu navegador, la extensión podrá ver los archivos que tú ves. Sin embargo, las descargas usarán tu sesión actual de Chrome.

### ¿Cómo actualizo a la versión Pro?

La versión Pro estará disponible próximamente. Habrá un botón "Upgrade to Pro" en la extensión cuando esté lista.

### ¿Dónde se guardan los archivos descargados?

Los archivos se guardan en tu carpeta de **Descargas** predeterminada de Chrome. Puedes cambiar esto en la configuración de Chrome:
1. Ve a `chrome://settings/downloads`
2. Cambia la ubicación de descarga

### ¿Puedo cambiar mi API Key?

Sí, simplemente:
1. Ve a la página de Opciones de la extensión
2. Ingresa la nueva API Key
3. Haz clic en "Guardar"

La nueva clave reemplazará la anterior.

### ¿La extensión funciona offline?

No, necesitas conexión a Internet para:
- Escanear páginas (el proxy necesita acceder a la URL)
- Usar AI Deep Scan (se conecta a la API de IA)
- Descargar archivos (vienen del servidor original)

### ¿Cuántos archivos puedo descargar a la vez?

No hay límite por parte de la extensión, pero Chrome tiene sus propias limitaciones:
- ~6 descargas simultáneas por defecto
- Puede pedirte permiso para descargas múltiples
- Muy grandes cantidades pueden ralentizar el navegador

---

## Necesitas Ayuda?

Si tienes problemas que no están cubiertos en esta guía:

1. **Revisa la consola del navegador** (F12) para mensajes de error
2. **Verifica la página de configuración** de la extensión
3. **Contacta al desarrollador** con detalles del problema

---

**¡Gracias por usar FileHarvest!**

Si te gusta la extensión, considera dejar una reseña en Chrome Web Store.
