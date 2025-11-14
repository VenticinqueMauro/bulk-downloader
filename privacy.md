# Política de Privacidad - FileHarvest

**Última Actualización:** Noviembre 2025

## Introducción

Esta Política de Privacidad describe cómo **FileHarvest** ("la Extensión", "nosotros", "nuestro") recopila, usa y protege la información cuando usas nuestra extensión de Chrome.

Tu privacidad es importante para nosotros. Esta extensión ha sido diseñada con la privacidad en mente, minimizando la recopilación de datos y manteniendo tu información segura.

## Información que NO Recopilamos

Para ser completamente transparentes, **NO recopilamos, almacenamos ni compartimos**:

- Información de identificación personal (nombre, dirección, teléfono, etc.)
- Direcciones de correo electrónico
- Historial de navegación
- URLs que escaneas
- Archivos que descargas
- Información de pago o facturación
- Información de donaciones (procesada directamente por PayPal/servicios de pago)
- Cookies o identificadores de rastreo
- Datos de ubicación
- Información demográfica

## Información que Almacenamos Localmente

La extensión almacena la siguiente información **solo en tu navegador** usando la API `chrome.storage.sync`:

### 1. Clave API de IA
- **Qué es:** La clave API que obtienes de Google AI Studio para usar la función AI Deep Scan
- **Dónde se almacena:** En tu navegador local vía `chrome.storage.sync`
- **Quién tiene acceso:** Solo tú, a través de tu navegador Chrome
- **Sincronización:** Si tienes la sincronización de Chrome habilitada, esta clave se sincronizará en tus dispositivos usando la infraestructura segura de Google
- **Control:** Puedes eliminarla en cualquier momento desde la página de Opciones de la extensión

### 2. Estado del Usuario
- **Qué es:** Información sobre tu estado (usuario gratuito o Pro) y número de escaneos de IA restantes
- **Dónde se almacena:** En la memoria del navegador durante tu sesión
- **Persistencia:** Se reinicia cuando cierras y vuelves a abrir la extensión

## Cómo Usamos el Proxy CORS

Para evitar restricciones de seguridad del navegador (CORS), la extensión usa un servicio proxy desplegado en Vercel:

### ¿Qué hace el proxy?
- Actúa como intermediario para obtener contenido HTML de páginas que quieres escanear
- Recibe la URL que solicitas escanear
- Descarga el contenido de esa URL
- Devuelve el contenido a la extensión

### ¿Qué NO hace el proxy?
- NO registra las URLs que escaneas
- NO almacena contenido descargado
- NO recopila información personal
- NO comparte datos con terceros

### Medidas de Seguridad del Proxy
- **Limitación de Tasa:** Máximo 30 solicitudes por minuto por dirección IP (para prevenir abuso)
- **Protección SSRF:** Bloquea acceso a localhost y redes privadas
- **Tiempo de Espera:** Máximo 15 segundos por solicitud
- **Límite de Tamaño:** Máximo 5MB por respuesta
- **Sin Registros:** Las solicitudes no se registran después del procesamiento

## Uso de APIs de Terceros

### API de Google Gemini

Cuando usas la función **AI Deep Scan**, la extensión envía el contenido HTML de la página a la API Gemini de Google para análisis.

**Qué se envía a Gemini:**
- El contenido HTML de la página que estás escaneando
- Un prompt preguntando qué archivos descargables están presentes

**Qué NO se envía:**
- Tu información personal
- Historial de navegación
- Datos no relacionados con el escaneo actual

**Privacidad de Gemini:**
- El uso de la API Gemini está sujeto a la [Política de Privacidad de Google](https://policies.google.com/privacy)
- Usas tu propia clave API, por lo que cualquier uso se registra en tu cuenta de Google Cloud
- Google puede procesar datos según sus políticas de IA

### APIs de Chrome

La extensión usa las siguientes APIs de Chrome:

- **chrome.storage.sync:** Para almacenar de forma segura tu clave API
- **chrome.downloads:** Para iniciar descargas de archivos
- **chrome.tabs:** Para obtener la URL de la pestaña actual
- **chrome.runtime:** Para gestión interna de la extensión

Estas APIs son proporcionadas por Google Chrome y están sujetas a la [Política de Privacidad de Chrome](https://www.google.com/chrome/privacy/).

## Permisos de la Extensión

La extensión solicita los siguientes permisos de Chrome:

### 1. `downloads`
- **Propósito:** Permitir que la extensión inicie descargas de archivos
- **Uso:** Solo cuando haces clic en "Descargar Selección"
- **Sin acceso a:** Historial de descargas previas

### 2. `storage`
- **Propósito:** Almacenar de forma segura tu clave API
- **Uso:** Guardar y recuperar tu configuración
- **Sin acceso a:** Datos de otras extensiones o sitios web

### 3. `activeTab`
- **Propósito:** Leer la URL de la pestaña actual
- **Uso:** Auto-rellenar el campo de URL cuando abres la extensión
- **Sin acceso a:** Contenido de la página o historial de navegación

### 4. `tabs`
- **Propósito:** Obtener información básica sobre la pestaña actual
- **Uso:** Detectar la URL actual para escanear
- **Sin acceso a:** Contenido sensible o historial

### 5. `<all_urls>` (Permisos de Host)
- **Propósito:** Permitir descargas desde cualquier sitio web
- **Uso:** Necesario para que Chrome permita descargar archivos desde URLs arbitrarias
- **Sin acceso a:** Datos de páginas que no estás escaneando activamente

## Seguridad de Datos

### Almacenamiento Local
- Toda tu información se almacena localmente en tu navegador
- Usamos `chrome.storage.sync` que está cifrado por Chrome
- No tenemos acceso a tus datos almacenados

### Transmisión de Datos
- Las comunicaciones con el proxy usan HTTPS
- Las comunicaciones con la API Gemini usan HTTPS
- No se transmiten datos sin cifrar

### Sin Servidores Propietarios
- No operamos servidores que almacenen datos de usuarios
- El proxy de Vercel es sin estado y no guarda información

## Derechos del Usuario

Tienes derecho a:

### 1. Acceder a Tus Datos
- Puedes ver tu clave API almacenada en la página de Opciones
- Toda la información está en tu navegador local

### 2. Eliminar Tus Datos
- **Eliminar Clave API:**
  - Ve a la página de Opciones
  - Haz clic en "Eliminar Clave API"

- **Desinstalación Completa:**
  - Ve a `chrome://extensions/`
  - Haz clic en "Eliminar" en FileHarvest
  - Confirma la eliminación
  - Todos los datos locales se eliminarán automáticamente

### 3. Portabilidad de Datos
- Puedes copiar tu clave API desde la página de Opciones
- No hay otros datos para exportar

### 4. No Ser Rastreado
- Esta extensión NO te rastrea
- NO usamos análisis o rastreo de usuarios
- NO colocamos cookies de terceros

## Cambios a Esta Política

Podemos actualizar esta Política de Privacidad ocasionalmente. Los cambios se reflejarán con una nueva fecha de "Última Actualización" en la parte superior.

**Te notificaremos de cambios significativos:**
- A través de una actualización de la extensión en Chrome Web Store
- Incluyendo un aviso en las notas de la versión

**Tu uso continuado de la extensión después de los cambios constituye aceptación de la nueva política.**

## Cumplimiento Legal

### GDPR (Reglamento General de Protección de Datos)
Si estás en la Unión Europea:
- No recopilamos datos personales, por lo que la mayoría del GDPR no aplica
- Tu clave API se almacena localmente bajo tu control
- No compartimos datos con terceros (excepto Google Gemini, usando tu propia clave)

### CCPA (Ley de Privacidad del Consumidor de California)
Si estás en California:
- No vendemos información personal
- No compartimos información personal con fines comerciales
- No recopilamos información de identificación personal

### COPPA (Ley de Protección de la Privacidad en Línea de los Niños)
- Esta extensión no está dirigida a niños menores de 13 años
- No recopilamos intencionalmente información de menores
- Si eres padre y crees que tu hijo ha proporcionado información, contáctanos

## Servicios de Terceros

Esta extensión interactúa con los siguientes servicios de terceros:

### 1. API de Google Gemini
- **Política de Privacidad:** [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Uso:** Análisis de contenido web con IA
- **Tu control:** Usas tu propia clave API

### 2. Vercel (Proxy CORS)
- **Política de Privacidad:** [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)
- **Uso:** Alojamiento del servicio proxy
- **Datos procesados:** URLs solicitadas (no almacenadas)

### 3. Chrome Web Store
- **Política de Privacidad:** [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Uso:** Distribución de la extensión
- **Datos:** Información de instalación/actualización gestionada por Google

## Responsabilidad del Usuario

Como usuario, eres responsable de:

### 1. Proteger Tu Clave API
- No compartas tu clave API de Gemini con nadie
- Mantenla segura
- Revócala y genera una nueva si crees que fue comprometida

### 2. Uso Legal
- Solo escanea páginas web a las que tienes derecho de acceder
- Solo descarga archivos que tienes derecho a descargar
- Cumple con los términos de servicio de los sitios web que visitas

### 3. Respeto por los Derechos de Autor
- No uses la extensión para piratería o infracción de derechos de autor
- Respeta las licencias de los archivos que descargas
- El desarrollador no es responsable del mal uso de la extensión

## Donaciones Opcionales

FileHarvest es completamente gratuito. La extensión incluye enlaces opcionales para donaciones voluntarias.

**Importante:**
- Las donaciones son **100% opcionales** y no afectan la funcionalidad de la extensión
- Todas las transacciones de donación son procesadas directamente por servicios de pago de terceros (PayPal, bancos, etc.)
- **No recopilamos ni tenemos acceso** a información de donaciones o datos de pago
- No rastreamos quién dona o cuánto dona
- Las donaciones no desbloquean funciones adicionales (la extensión es completamente gratuita para todos)

Los enlaces de donación te redirigen a servicios externos que tienen sus propias políticas de privacidad:
- **PayPal**: [https://www.paypal.com/privacy](https://www.paypal.com/privacy)

## Contacto

Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad:

- **Email:** mauro25qe@gmail.com
- **Sitio Web:** https://www.m25.com.ar
- **GitHub:** https://github.com/VenticinqueMauro/bulk-downloader

## Transparencia

Esta extensión es **código abierto**. Puedes:
- Revisar el código fuente para verificar nuestras afirmaciones
- Auditar seguridad y privacidad
- Reportar problemas o vulnerabilidades

## Consentimiento

Al instalar y usar **FileHarvest**, aceptas esta Política de Privacidad.

Si no estás de acuerdo con esta política, por favor no uses la extensión.

---

**Esta política fue diseñada para ser clara, honesta y transparente. Tu privacidad es nuestra prioridad.**

Última actualización: Noviembre 2025
