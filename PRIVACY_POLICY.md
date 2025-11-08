# Política de Privacidad - Gemini Bulk File Downloader

**Última actualización:** Noviembre 2025

## Introducción

Esta Política de Privacidad describe cómo **Gemini Bulk File Downloader** ("la Extensión", "nosotros", "nuestro") recopila, usa y protege la información cuando utilizas nuestra extensión de Chrome.

Tu privacidad es importante para nosotros. Esta extensión ha sido diseñada con la privacidad en mente, minimizando la recopilación de datos y manteniendo tu información segura.

## Información que NO Recopilamos

Para ser completamente transparentes, **NO recopilamos, almacenamos ni compartimos**:

- Información personal identificable (nombre, dirección, teléfono, etc.)
- Direcciones de correo electrónico
- Historial de navegación
- URLs que escaneas
- Archivos que descargas
- Información de pago o facturación
- Cookies o identificadores de seguimiento
- Datos de ubicación
- Información demográfica

## Información que Almacenamos Localmente

La extensión almacena la siguiente información **únicamente en tu navegador** utilizando la API `chrome.storage.sync`:

### 1. API Key de Gemini
- **Qué es:** La clave de API que obtienes de Google AI Studio para usar la función de AI Deep Scan
- **Dónde se almacena:** En tu navegador local mediante `chrome.storage.sync`
- **Quién tiene acceso:** Solo tú, a través de tu navegador Chrome
- **Sincronización:** Si tienes activada la sincronización de Chrome, esta clave se sincronizará entre tus dispositivos usando la infraestructura segura de Google
- **Control:** Puedes eliminarla en cualquier momento desde la página de Opciones de la extensión

### 2. Estado de Usuario
- **Qué es:** Información sobre tu estado (usuario gratuito o Pro) y número de escaneos de IA restantes
- **Dónde se almacena:** En la memoria del navegador durante tu sesión
- **Persistencia:** Se restablece cuando cierras y abres la extensión

## Cómo Usamos el Proxy CORS

Para evitar restricciones de seguridad del navegador (CORS), la extensión utiliza un servicio proxy desplegado en Vercel:

### ¿Qué hace el proxy?
- Actúa como intermediario para obtener el contenido HTML de las páginas que deseas escanear
- Recibe la URL que solicitas escanear
- Descarga el contenido de esa URL
- Te devuelve el contenido a la extensión

### ¿Qué NO hace el proxy?
- NO registra (logs) las URLs que escaneas
- NO almacena el contenido descargado
- NO recopila información personal
- NO comparte datos con terceros

### Medidas de Seguridad del Proxy
- **Rate Limiting:** Máximo 30 peticiones por minuto por dirección IP (para prevenir abuso)
- **SSRF Protection:** Bloquea acceso a localhost y redes privadas
- **Timeout:** Máximo 15 segundos por petición
- **Límite de Tamaño:** Máximo 5MB por respuesta
- **Sin Logs:** No se registran las peticiones después de procesarlas

## Uso de APIs de Terceros

### Google Gemini API

Cuando utilizas la función **AI Deep Scan**, la extensión envía el contenido HTML de la página a la API de Gemini de Google para su análisis.

**Lo que se envía a Gemini:**
- El contenido HTML de la página que estás escaneando
- Un prompt preguntando qué archivos descargables están presentes

**Lo que NO se envía:**
- Tu información personal
- Historial de navegación
- Datos no relacionados con el escaneo actual

**Privacidad en Gemini:**
- El uso de la API de Gemini está sujeto a la [Política de Privacidad de Google](https://policies.google.com/privacy)
- Usas tu propia API Key, por lo que cualquier uso se registra en tu cuenta de Google Cloud
- Google puede procesar los datos según sus políticas de IA

### Chrome APIs

La extensión utiliza las siguientes APIs de Chrome:

- **chrome.storage.sync:** Para almacenar tu API Key de forma segura
- **chrome.downloads:** Para iniciar descargas de archivos
- **chrome.tabs:** Para obtener la URL de la pestaña actual
- **chrome.runtime:** Para gestión interna de la extensión

Estas APIs son proporcionadas por Google Chrome y están sujetas a la [Política de Privacidad de Chrome](https://www.google.com/chrome/privacy/).

## Permisos de la Extensión

La extensión solicita los siguientes permisos de Chrome:

### 1. `downloads`
- **Propósito:** Permitir que la extensión inicie descargas de archivos
- **Uso:** Solo cuando haces clic en "Download Selected"
- **Sin acceso a:** Historial de descargas previas

### 2. `storage`
- **Propósito:** Almacenar tu API Key de forma segura
- **Uso:** Guardar y recuperar tu configuración
- **Sin acceso a:** Datos de otras extensiones o sitios web

### 3. `activeTab`
- **Propósito:** Leer la URL de la pestaña actual
- **Uso:** Auto-completar el campo de URL cuando abres la extensión
- **Sin acceso a:** Contenido de la página o historial de navegación

### 4. `tabs`
- **Propósito:** Obtener información básica sobre la pestaña actual
- **Uso:** Detectar la URL actual para escaneo
- **Sin acceso a:** Contenido sensible o historial

### 5. `<all_urls>` (Host Permissions)
- **Propósito:** Permitir descargas desde cualquier sitio web
- **Uso:** Necesario para que Chrome permita descargar archivos de URLs arbitrarias
- **Sin acceso a:** Datos de páginas que no estás escaneando activamente

## Seguridad de Datos

### Almacenamiento Local
- Toda tu información se almacena localmente en tu navegador
- Utilizamos `chrome.storage.sync` que está encriptado por Chrome
- No tenemos acceso a tus datos almacenados

### Transmisión de Datos
- Las comunicaciones con el proxy usan HTTPS
- Las comunicaciones con Gemini API usan HTTPS
- No se transmiten datos no encriptados

### No hay Servidores Propios
- No operamos servidores que almacenen datos de usuarios
- El proxy en Vercel es stateless (sin estado) y no guarda información

## Derechos del Usuario

Tienes derecho a:

### 1. Acceder a tus Datos
- Puedes ver tu API Key almacenada en la página de Opciones
- Toda la información está en tu navegador local

### 2. Eliminar tus Datos
- **Eliminar API Key:**
  - Ve a la página de Opciones
  - Haz clic en "Clear API Key"

- **Desinstalar completamente:**
  - Ve a `chrome://extensions/`
  - Haz clic en "Quitar" en Gemini Bulk File Downloader
  - Confirma la eliminación
  - Todos los datos locales serán eliminados automáticamente

### 3. Portabilidad de Datos
- Puedes copiar tu API Key desde la página de Opciones
- No hay otros datos para exportar

### 4. No ser Rastreado
- Esta extensión NO te rastrea
- NO usamos analytics o seguimiento de usuario
- NO colocamos cookies de terceros

## Cambios a Esta Política

Podemos actualizar esta Política de Privacidad ocasionalmente. Los cambios se reflejarán con una nueva "Última actualización" en la parte superior.

**Te notificaremos de cambios importantes:**
- Mediante actualización de la extensión en Chrome Web Store
- Incluyendo un aviso en las notas de la versión

**Tu uso continuado de la extensión después de cambios constituye aceptación de la nueva política.**

## Cumplimiento Legal

### GDPR (Reglamento General de Protección de Datos)
Si te encuentras en la Unión Europea:
- No recopilamos datos personales, por lo que no aplica la mayoría del GDPR
- Tu API Key se almacena localmente bajo tu control
- No compartimos datos con terceros (excepto Google Gemini, usando tu propia clave)

### CCPA (California Consumer Privacy Act)
Si te encuentras en California:
- No vendemos información personal
- No compartimos información personal con fines comerciales
- No recopilamos información personal identificable

### COPPA (Children's Online Privacy Protection Act)
- Esta extensión no está dirigida a niños menores de 13 años
- No recopilamos intencionalmente información de menores
- Si eres padre/madre y crees que tu hijo ha proporcionado información, contáctanos

## Servicios de Terceros

Esta extensión interactúa con los siguientes servicios de terceros:

### 1. Google Gemini API
- **Política de Privacidad:** [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Uso:** Análisis de contenido web con IA
- **Tu control:** Usas tu propia API Key

### 2. Vercel (Proxy CORS)
- **Política de Privacidad:** [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)
- **Uso:** Hosting del servicio proxy
- **Datos procesados:** URLs solicitadas (no almacenadas)

### 3. Chrome Web Store
- **Política de Privacidad:** [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Uso:** Distribución de la extensión
- **Datos:** Información de instalación/actualización gestionada por Google

## Responsabilidad del Usuario

Como usuario, eres responsable de:

### 1. Proteger tu API Key
- No compartas tu API Key de Gemini con nadie
- Guárdala de forma segura
- Revoca y genera una nueva si crees que fue comprometida

### 2. Uso Legal
- Escanear solo páginas web que tengas derecho a acceder
- Descargar solo archivos que tengas derecho a descargar
- Cumplir con los términos de servicio de los sitios web que visitas

### 3. Respeto a los Derechos de Autor
- No uses la extensión para piratería o violación de derechos de autor
- Respeta las licencias de los archivos que descargas
- El desarrollador no es responsable del uso indebido de la extensión

## Contacto

Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad:

- **Email:** [Tu correo de soporte]
- **GitHub:** [Repositorio del proyecto para reportar issues]
- **Chrome Web Store:** [Página de la extensión]

## Transparencia

Esta extensión es de **código abierto** (o puede serlo). Puedes:
- Revisar el código fuente para verificar nuestras afirmaciones
- Auditar la seguridad y privacidad
- Reportar problemas o vulnerabilidades

## Consentimiento

Al instalar y usar **Gemini Bulk File Downloader**, aceptas esta Política de Privacidad.

Si no estás de acuerdo con esta política, por favor no uses la extensión.

---

**Esta política fue diseñada para ser clara, honesta y transparente. Tu privacidad es nuestra prioridad.**

Última actualización: Noviembre 2025
