# Screenshot Guide for Chrome Web Store

Para la publicación en Chrome Web Store, necesitas crear screenshots que muestren las características principales de FileHarvest.

## Requisitos de Screenshots

- **Cantidad**: Mínimo 1, recomendado 3-5 screenshots
- **Tamaño**: 1280x800 o 640x400 píxeles
- **Formato**: PNG o JPEG
- **Calidad**: Alta resolución, clara y legible

## Screenshots Recomendados

### Screenshot 1: Main Interface (OBLIGATORIO)
**Título sugerido**: "Scan any webpage for downloadable files"

**Qué mostrar**:
1. Abre FileHarvest en cualquier página con archivos
2. Muestra el popup con archivos detectados
3. Asegúrate de que se vean:
   - El header "FileHarvest"
   - La URL de entrada
   - Los botones "Standard Scan" y "AI Deep Scan"
   - Lista de archivos encontrados
   - Filtros (All, Image, Video, etc.)

**Cómo capturar**:
```
1. Abre Chrome
2. Ve a una página con muchos archivos (ej: una galería de imágenes)
3. Haz clic en el icono de FileHarvest
4. Espera a que cargue la lista de archivos
5. Presiona Win+Shift+S (Windows) o Cmd+Shift+4 (Mac)
6. Captura toda la ventana del popup
7. Redimensiona a 1280x800 en un editor de imágenes
```

### Screenshot 2: File Filtering
**Título sugerido**: "Advanced filtering and search"

**Qué mostrar**:
1. Muestra los filtros activos (por ejemplo, filtro de "Image")
2. La barra de búsqueda
3. Archivos seleccionados con checkboxes marcados
4. La barra inferior con "X files selected" y botón "Download Selected"

### Screenshot 3: AI Deep Scan Feature
**Título sugerido**: "AI-powered deep scanning for complex pages"

**Qué mostrar**:
1. El botón "AI Deep Scan" destacado
2. Idealmente, muestra más archivos encontrados con AI vs Standard
3. Texto explicativo visible

### Screenshot 4: Settings/Options Page
**Título sugerido**: "Easy API key configuration"

**Qué mostrar**:
1. La página de opciones (options.html)
2. El campo de API Key
3. Las instrucciones de cómo obtener la API key

### Screenshot 5: File Types Support
**Título sugerido**: "Supports all major file types"

**Qué mostrar**:
1. Lista con variedad de tipos de archivos
2. Diferentes íconos/etiquetas de tipos (Image, Video, Document, etc.)
3. Tamaños de archivos mostrados

## Herramientas Recomendadas para Crear Screenshots

### Para capturar:
- **Windows**: Win+Shift+S (Snipping Tool)
- **Mac**: Cmd+Shift+4
- **Chrome Extension**: "Awesome Screenshot"

### Para editar/redimensionar:
- **Online**:
  - https://www.photopea.com/ (gratis, como Photoshop)
  - https://www.canva.com/
- **Desktop**:
  - GIMP (gratis)
  - Photoshop
  - Paint.NET (Windows)

### Para añadir anotaciones (opcional):
- Flechas apuntando a características importantes
- Texto explicativo
- Resaltar botones o áreas importantes

## Consejos para Buenos Screenshots

1. **Usa datos realistas**: Muestra archivos reales, no ejemplos vacíos
2. **Buena iluminación**: Asegúrate de que el tema oscuro se vea bien
3. **Resolución clara**: No pixelado ni borroso
4. **Contexto útil**: Muestra la extensión haciendo algo útil
5. **Evita información personal**: No muestres URLs privadas o datos sensibles

## Proceso Paso a Paso

1. **Preparar el entorno**:
   ```bash
   # Asegúrate de tener la extensión compilada
   npm run build

   # Carga la extensión en Chrome
   # chrome://extensions/ > Load unpacked > selecciona carpeta dist/
   ```

2. **Navegar a páginas de prueba**:
   - Galería de imágenes: https://unsplash.com/
   - Página con PDFs: https://www.pdfdrive.com/
   - Página con videos: https://www.pexels.com/videos/

3. **Capturar screenshots**:
   - Toma 5 screenshots siguiendo las recomendaciones arriba
   - Guárdalas con nombres descriptivos (screenshot-1-main.png, etc.)

4. **Redimensionar**:
   - Abre cada imagen en Photopea o GIMP
   - Redimensiona a 1280x800 píxeles
   - Exporta como PNG de alta calidad

5. **Revisar**:
   - Verifica que se vea todo claro
   - Asegúrate de que no hay información sensible
   - Confirma que representan bien las características

## Ubicación de los Screenshots

Guarda los screenshots en una carpeta llamada `store-assets/screenshots/`:

```
bulk-downloader/
├── store-assets/
│   ├── screenshots/
│   │   ├── 1-main-interface.png
│   │   ├── 2-file-filtering.png
│   │   ├── 3-ai-deep-scan.png
│   │   ├── 4-settings.png
│   │   └── 5-file-types.png
│   └── promotional/
│       └── tile-440x280.png
```

## Siguiente Paso

Una vez que tengas los screenshots listos, necesitarás también crear la imagen promocional de 440x280 píxeles que se mostrará en la Chrome Web Store (ver PROMOTIONAL_IMAGE_GUIDE.md).
