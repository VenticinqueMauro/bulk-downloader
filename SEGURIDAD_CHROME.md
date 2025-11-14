# 🛡️ Sobre la Advertencia de Chrome "Ten cuidado"

## ¿Por qué aparece esta advertencia?

Cuando instalas FileHarvest, es posible que Chrome muestre una advertencia que dice:
> "Ten cuidado - Navegación segura mejorada no confía en esta extensión"

**Esta advertencia NO significa que la extensión sea maliciosa o insegura.**

## Razones de la Advertencia

Chrome muestra esta advertencia en extensiones que:

### 1. ✨ Son Nuevas en el Store
- FileHarvest es una extensión recién publicada
- Chrome necesita tiempo para "conocer" la extensión
- A medida que más usuarios la instalen, la advertencia desaparecerá

### 2. 📊 Tienen Pocas Instalaciones
- Las extensiones con menos de 1,000 usuarios suelen mostrar esta advertencia
- Es un mecanismo de protección de Chrome
- **No indica ningún problema de seguridad**

### 3. ⭐ No Tienen Suficientes Reseñas
- Chrome usa las reseñas como indicador de confianza
- Tu instalación y reseña positiva ayudan a otros usuarios

## ¿Es Seguro Instalar FileHarvest?

**✅ SÍ, es completamente seguro.** Aquí está por qué:

### 🔓 Código Abierto (Open Source)
- El código fuente completo está disponible en GitHub
- Cualquiera puede revisarlo y verificar su seguridad
- **Repositorio:** https://github.com/VenticinqueMauro/bulk-downloader

### 🔒 Permisos Mínimos
FileHarvest solo solicita 4 permisos esenciales:

1. **`downloads`** - Para iniciar descargas de archivos
2. **`storage`** - Para guardar tu API key localmente
3. **`activeTab`** - Para leer la URL de la pestaña actual
4. **`tabs`** - Para detectar cambios de pestaña

**NO solicita:**
- ❌ Acceso a todas las páginas web (`<all_urls>`)
- ❌ Acceso a tu historial de navegación
- ❌ Acceso a tus cookies
- ❌ Acceso a datos sensibles

### 🛡️ Privacidad Primero
- **No recopilamos datos personales**
- **No rastreamos tu navegación**
- **No vendemos información**
- **Sin publicidad**
- **Sin analíticas**

Consulta nuestra [Política de Privacidad](./privacy.md) completa.

### 🧪 Auditable
Como la extensión es open source, puedes:
- Revisar el código fuente
- Compilarlo tú mismo
- Verificar que no hace nada malicioso
- Reportar cualquier problema en GitHub

## ¿Cómo Puedes Ayudar?

Tu ayuda es crucial para que esta advertencia desaparezca:

### 1. 🌟 Deja una Reseña
Si te gusta FileHarvest, deja una reseña de 5 estrellas en Chrome Web Store. Esto ayuda a:
- Aumentar la confianza de Chrome en la extensión
- Que otros usuarios vean que es segura
- Reducir la advertencia para futuros usuarios

### 2. 📢 Comparte
Comparte FileHarvest con amigos y colegas que necesiten descargar archivos en masa.

### 3. 💬 Reporta Problemas
Si encuentras algún problema, repórtalo en:
- **GitHub Issues:** https://github.com/VenticinqueMauro/bulk-downloader/issues
- **Email:** mauro25qe@gmail.com

## Comparación con Otras Extensiones

Muchas extensiones populares mostraron la misma advertencia cuando eran nuevas:
- Chrono Download Manager
- Video DownloadHelper
- Bulk Media Downloader

Todas pasaron por este proceso de "ganarse la confianza" de Chrome.

## Para Usuarios Técnicos

Si quieres verificar la seguridad tú mismo:

### Auditar el Código
```bash
# Clona el repositorio
git clone https://github.com/VenticinqueMauro/bulk-downloader.git
cd bulk-downloader

# Revisa el código
# Todos los archivos están en TypeScript/React, fáciles de leer
```

### Compilar Desde Fuente
```bash
# Instala dependencias
npm install

# Compila la extensión
npm run build

# La extensión compilada estará en ./dist
# Cárgala manualmente en chrome://extensions/
```

### Verificar Permisos
1. Ve a `chrome://extensions/`
2. Busca FileHarvest
3. Haz clic en "Detalles"
4. Revisa la sección "Permisos"

## Alternativas Si No Confías

Si prefieres no instalar hasta que la extensión tenga más usuarios:

### Opción 1: Espera
- Espera a que la extensión acumule más instalaciones
- Revisa las reseñas de otros usuarios
- La advertencia desaparecerá con el tiempo

### Opción 2: Compila Tú Mismo
- Clona el repositorio de GitHub
- Revisa todo el código fuente
- Compila y carga la extensión manualmente

### Opción 3: Úsala Sin IA
- Instala la extensión
- No configures la API key de Gemini
- Usa solo el "Standard Scan" (funciona sin internet externo)

## Preguntas Frecuentes

### ¿La advertencia desaparecerá?
**Sí.** A medida que más usuarios instalen FileHarvest y dejen reseñas positivas, Chrome dejará de mostrar la advertencia.

### ¿Chrome bloqueará la extensión?
**No.** Chrome no bloquea extensiones legítimas. La advertencia es solo informativa.

### ¿Puedo confiar en el desarrollador?
- Mauro Venticinque es un desarrollador argentino
- Puedes contactarlo en: mauro25qe@gmail.com
- Sitio web: https://www.m25.com.ar
- GitHub: https://github.com/VenticinqueMauro

### ¿FileHarvest recopila mis datos?
**No.** La extensión NO recopila ningún dato personal. Todo se almacena localmente en tu navegador.

### ¿Necesito pagar algo?
**No.** FileHarvest es 100% gratuito y siempre lo será.

## Conclusión

La advertencia de Chrome es un mecanismo de protección para extensiones nuevas, **NO una indicación de que FileHarvest sea insegura.**

FileHarvest es:
- ✅ Open source
- ✅ Sin rastreo
- ✅ Sin publicidad
- ✅ Permisos mínimos
- ✅ Auditable
- ✅ Respeta tu privacidad

**Si tienes dudas, revisa el código fuente o espera a que más usuarios la instalen.**

---

**Tu confianza es importante. Si tienes preguntas, no dudes en contactarnos.**

📧 Email: mauro25qe@gmail.com
🐙 GitHub: https://github.com/VenticinqueMauro/bulk-downloader
🌐 Web: https://www.m25.com.ar
