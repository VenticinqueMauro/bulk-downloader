# 🔍 Cómo Debuggear el Service Worker

Si ves el error "No se pudo iniciar el escaneo", sigue estos pasos para diagnosticar:

## ⚠️ IMPORTANTE: Build Configuration

**Si no ves logs en la consola**, verifica que la minificación esté desactivada en `vite.config.ts`:

```typescript
build: {
  // TEMPORARILY DISABLED for debugging - keep console.log statements visible
  minify: false,
  // terserOptions: {
  //   compress: {
  //     drop_console: true, // This removes all console.log!
  //     drop_debugger: true,
  //   },
  // },
}
```

Cuando `minify: 'terser'` está activo con `drop_console: true`, TODOS los console.log son eliminados del build, haciendo imposible debuggear. Para producción puedes reactivarlo, pero para debugging debe estar desactivado.

## 1. Abrir DevTools del Service Worker

1. Ve a `chrome://extensions/`
2. Activa "Modo de desarrollador" (esquina superior derecha)
3. Busca "FileHarvest"
4. Haz click en **"service worker"** (link azul debajo del nombre)
   - Si dice "inactivo", haz click en "service worker" para activarlo
5. Se abrirá DevTools específico para el service worker

## 2. Ver Errores en la Consola

En DevTools del service worker, revisa la pestaña **Console**:

### ✅ Mensajes Esperados (Todo OK):
```
🚀 FileHarvest background service worker loaded
📨 Background received message: START_STANDARD_SCAN
🔍 Background: Starting standard scan for https://...
✅ Background: Standard scan completed. Found X files
```

### ❌ Errores Comunes:

#### Error 1: Service Worker no se carga
```
Uncaught SyntaxError: ...
```
**Solución:** Hay un error de sintaxis. Rebuild necesario.

#### Error 2: No se puede importar módulos
```
Failed to load module script
```
**Solución:** Problema con imports. Ver abajo.

#### Error 3: Chrome APIs no disponibles
```
chrome.storage is not defined
```
**Solución:** Manifest.json mal configurado.

## 3. Probar Manualmente el Service Worker

En la consola del Service Worker, ejecuta:

```javascript
// Test 1: Verificar que el service worker está funcionando
console.log('SW Test: Service worker is alive');

// Test 2: Verificar chrome APIs
console.log('SW Test: Chrome storage?', typeof chrome.storage);
console.log('SW Test: Chrome notifications?', typeof chrome.notifications);

// Test 3: Verificar estado actual
chrome.runtime.sendMessage({ type: 'GET_SCAN_STATE' }, response => {
  console.log('SW Test: Current state:', response);
});

// Test 4: Probar escaneo manual
chrome.runtime.sendMessage({
  type: 'START_STANDARD_SCAN',
  url: 'https://example.com',
  preferences: {
    categories: [],
    minSize: 0,
    maxSize: 0,
    rememberPreferences: false
  }
}, response => {
  console.log('SW Test: Scan started?', response);
});
```

## 4. Ver Mensajes Entre Popup y Background

### En DevTools del POPUP (click derecho en popup → Inspeccionar):
```javascript
// Ver mensajes enviados
console.log('Popup: Sending message to background');
chrome.runtime.sendMessage({ type: 'GET_SCAN_STATE' }, res => {
  console.log('Popup: Response from background:', res);
});
```

### En DevTools del SERVICE WORKER:
```javascript
// Ver mensajes recibidos (debería aparecer automáticamente)
// Busca: "📨 Background received message"
```

## 5. Recargar Service Worker

Si hiciste cambios:

1. En `chrome://extensions/`
2. Click en el botón **🔄 Recargar** de FileHarvest
3. Cierra y reabre el popup
4. Revisa la consola del service worker de nuevo

## 6. Ver Storage del Service Worker

En DevTools del Service Worker, pestaña **Application**:
- Storage → Local Storage → `chrome-extension://...`
- Debería haber un item `scanState` cuando hay un escaneo

## 7. Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| El link "service worker" no aparece | Manifest.json mal configurado |
| Service worker dice "inactivo" | Normal, se activa cuando envías mensajes |
| No hay logs en consola | Service worker puede haber crasheado, recarga la extensión |
| Error "message port closed" | El service worker respondió después de cerrarse el canal |
| Scan se queda en loading infinito | Service worker crasheó o no respondió |

## 8. Logs para Reportar

Si el problema persiste, copia estos logs:

1. **Consola del Service Worker**: Todo el output
2. **Consola del Popup**: Todo el output
3. **Application → Local Storage**: El contenido de `scanState`
4. **Network tab**: Cualquier request fallido

## 9. Reset Completo

Si nada funciona:

```javascript
// En consola del SERVICE WORKER:
chrome.storage.local.clear();
chrome.action.setBadgeText({ text: '' });
console.log('SW: Storage cleared');

// Recarga la extensión en chrome://extensions/
```

## 10. Verificar Manifest

En `dist/manifest.json`, debe tener:

```json
{
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "permissions": [
    "storage",
    "notifications",
    ...
  ]
}
```

---

## Debugging Tips

1. **Siempre abre DevTools del Service Worker PRIMERO**
2. **Luego abre el popup**
3. **Mira ambas consolas simultáneamente**
4. **Recarga la extensión después de cada build**
