# FileHarvest - Chrome Web Store Publication Checklist

## ✅ Pasos Completados

- [x] Manifest.json actualizado con versión 1.0.0
- [x] Autor configurado: Mauro Venticinque
- [x] Homepage URL: https://www.m25.com.ar/
- [x] Descripción actualizada (sin menciones a freemium o batch scan)
- [x] Cuenta de desarrollador pagada ($5 USD)
- [x] Build exitoso sin errores
- [x] Política de privacidad creada

## 📋 Pasos Pendientes

### 1. Crear Assets Visuales (CRÍTICO)

#### Screenshots (Mínimo 1, Recomendado 5)
**Ubicación**: `store-assets/screenshots/`

- [ ] Screenshot 1: Main interface (1280x800 px) - OBLIGATORIO
- [ ] Screenshot 2: File filtering (1280x800 px)
- [ ] Screenshot 3: AI Deep Scan (1280x800 px)
- [ ] Screenshot 4: Settings page (1280x800 px)
- [ ] Screenshot 5: File types variety (1280x800 px)

**Instrucciones**: Ver `SCREENSHOT_GUIDE.md`

#### Imagen Promocional (OBLIGATORIO)
**Ubicación**: `store-assets/promotional/tile-440x280.png`

- [ ] Crear imagen 440x280 px
- [ ] Logo centrado
- [ ] Texto "FileHarvest"
- [ ] Subtítulo descriptivo

**Instrucciones**: Ver `PROMOTIONAL_IMAGE_GUIDE.md`

### 2. Publicar Política de Privacidad (OBLIGATORIO)

La Chrome Web Store requiere una URL pública para la política de privacidad.

**Opciones**:

#### Opción A: GitHub Pages (Recomendado - Gratis)
```bash
# Ya tienes el archivo PRIVACY_POLICY.md
# Solo necesitas activar GitHub Pages:
1. Ve a: https://github.com/VenticinqueMauro/bulk-downloader/settings/pages
2. En "Source" selecciona: main branch
3. Espera 1-2 minutos
4. Tu política estará en:
   https://venticinquemauro.github.io/bulk-downloader/PRIVACY_POLICY.md
```

#### Opción B: Tu sitio web
```
Sube PRIVACY_POLICY.md a:
https://www.m25.com.ar/fileharvest/privacy-policy
```

- [ ] URL de política de privacidad publicada: _________________

### 3. Preparar Información para Chrome Web Store

#### Información Básica
- **Nombre**: FileHarvest
- **Descripción corta**: Scan webpages and download files in bulk. Features filtering, real file sizes, and AI-powered scanning.
- **Categoría**: Productivity
- **Idioma**: English (puedes agregar Spanish después)

#### Descripción Detallada
**Copiar de**: `CHROME_STORE_LISTING.md`

#### Justificación de Permisos
Cuando Chrome te pida justificar permisos, usa esto:

**downloads**:
```
Required to download files selected by the user from scanned webpages.
```

**storage**:
```
Required to securely store the user's Google AI API key locally in the browser.
```

**activeTab**:
```
Required to scan the content of the current active tab to detect downloadable files.
```

**tabs**:
```
Required to auto-fill the current page URL in the extension popup for user convenience.
```

**host_permissions (all_urls)**:
```
Required to scan any webpage the user visits to detect downloadable files.
The extension only accesses pages when the user explicitly clicks the extension
icon and initiates a scan. No data is collected or transmitted.
```

### 4. Compilar Versión Final para Publicación

```bash
# Asegúrate de estar en la carpeta del proyecto
cd bulk-downloader

# Limpia build anterior
npm run clean

# Build de producción
npm run build

# Verifica que dist/ tenga todos los archivos
ls -la dist/
```

- [ ] Build final completado
- [ ] Verificado que dist/ contiene todos los archivos necesarios

### 5. Crear el Paquete ZIP

```bash
# En la carpeta bulk-downloader
cd dist
zip -r ../fileharvest-v1.0.0.zip .
cd ..

# Verificar que el zip se creó correctamente
ls -lh fileharvest-v1.0.0.zip
```

- [ ] ZIP creado: `fileharvest-v1.0.0.zip`
- [ ] Tamaño del ZIP: _______ MB

### 6. Publicar en Chrome Web Store

#### Paso 1: Ir al Developer Dashboard
1. Ve a: https://chrome.google.com/webstore/devconsole
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "New Item"

#### Paso 2: Subir el ZIP
- [ ] Subir `fileharvest-v1.0.0.zip`
- [ ] Esperar a que se procese

#### Paso 3: Completar el Formulario

**Store Listing Tab**:
- [ ] Descripción detallada (copiar de CHROME_STORE_LISTING.md)
- [ ] Icono (128x128) - ya está en el ZIP
- [ ] Screenshots (mínimo 1)
- [ ] Imagen promocional (440x280)
- [ ] Categoría: Productivity

**Privacy Practices Tab**:
- [ ] Single Purpose Description:
  ```
  FileHarvest helps users find and download files from webpages they visit.
  ```
- [ ] Permission Justifications (copiar de arriba)
- [ ] Privacy Policy URL: _________________
- [ ] ¿Certificas que no vendes datos de usuarios?: YES
- [ ] ¿Usas datos para propósitos no relacionados con la funcionalidad?: NO

**Distribution Tab**:
- [ ] Visibility: Public
- [ ] Países: All countries (o selecciona específicos)
- [ ] Pricing: Free

#### Paso 4: Enviar para Revisión
- [ ] Revisar toda la información
- [ ] Hacer clic en "Submit for Review"
- [ ] Esperar aprobación (usualmente 1-3 días)

## 📊 Información de Contacto para Soporte

Si Chrome Web Store te pide información de contacto:
- **Email de soporte**: Tu email
- **Website**: https://www.m25.com.ar/

## ⏰ Timeline Estimado

1. **Crear assets visuales**: 1-2 horas
2. **Publicar política de privacidad**: 5 minutos
3. **Build y crear ZIP**: 5 minutos
4. **Completar formulario Chrome Store**: 30 minutos
5. **Revisión de Google**: 1-3 días hábiles

**Tiempo total**: ~2-4 días

## 🚨 Problemas Comunes y Soluciones

### "Your extension requests access to all URLs"
**Solución**: Proporciona justificación clara en "Permission Justifications"

### "Screenshots are required"
**Solución**: Sube al menos 1 screenshot de 1280x800 px

### "Privacy policy URL is invalid"
**Solución**: Asegúrate de que la URL es pública y accesible

### "Icon size is incorrect"
**Solución**: Verifica que icon128.png sea exactamente 128x128 px

## 📞 Contacto

Si tienes problemas durante la publicación:
- Chrome Web Store Help: https://support.google.com/chrome_webstore/
- Chrome Extension Development Forum: https://groups.google.com/a/chromium.org/g/chromium-extensions

## ✨ Después de la Publicación

Una vez aprobado:
1. Comparte el link de la extensión
2. Pide a amigos/usuarios que dejen reviews
3. Monitorea feedback y reportes de bugs
4. Prepara actualizaciones basadas en feedback

Link de tu extensión será:
```
https://chrome.google.com/webstore/detail/[ID-ÚNICO-GENERADO-POR-CHROME]
```

---

**¡Buena suerte con la publicación de FileHarvest! 🚀**
