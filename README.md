# 🛡️ Pensionados MX v34 — Edición Suprema+

App web progresiva (PWA) para gestión de beneficiarios de programas sociales.  
Funciona **100% sin internet** — todos los datos se guardan en tu dispositivo.

---

## 📦 Archivos incluidos

| Archivo | Descripción |
|---|---|
| `index.html` | App completa (toda la lógica en un solo archivo) |
| `sw.js` | Service Worker v34 — permite uso offline, excluye API de caché |
| `manifest.json` | Configuración PWA con shortcuts de pantalla de inicio |
| `icon-192.png` | Ícono app (192×192) |
| `icon-512.png` | Ícono app (512×512) |
| `README.md` | Este archivo |

---

## 🚀 Cómo instalar en GitHub Pages

1. Sube **todos los archivos** a un repositorio en GitHub
2. Ve a **Settings → Pages**
3. En Source selecciona: `main` → `/ (root)`
4. Espera 1–2 minutos y abre la URL generada
5. En iPhone: Safari → botón Compartir → **"Agregar a pantalla de inicio"**

---

## 🔐 Primer uso

1. Abre la app → pantalla de bienvenida
2. Toca **"⚙️ Configurar cuenta de administrador"** (aparece solo la primera vez)
3. Crea tu usuario y contraseña (mínimo 8 caracteres)
4. Inicia sesión con tus nuevas credenciales

---

## 👥 Roles de usuario

| Rol | Acceso |
|---|---|
| 👑 **Creador** | Todo — único administrador de la app |
| 👤 **Registrado** | Agregar, editar, exportar, marcar visitas |
| 👻 **Invitado** | Solo lectura — sin datos sensibles |

---

## 🤖 Configurar el Asistente IA

1. En cualquier pantalla, toca el botón 🤖 (esquina inferior derecha)
2. En el chat, toca el botón **🔑** (esquina superior derecha)
3. Pega tu API Key de Anthropic (empieza con `sk-ant-`)
4. Toca **💾 Guardar**
5. El botón se vuelve verde ✅ cuando está activa

> 🔒 La API Key se guarda **solo en tu dispositivo** (localStorage). Obtenla en [console.anthropic.com](https://console.anthropic.com)

---

## ✨ Novedades v34 — Edición Suprema+

| Feature | Descripción |
|---|---|
| 🔑 **API Key gestionable** | Configura tu clave Anthropic directo en el chat IA |
| 📅 **Calendario en Visitas** | Vista mensual con eventos y visitas programadas |
| 📊 **Importar Excel nativo** | Sube `.xlsx` directamente — ya no necesitas convertir a CSV |
| 💬 **WhatsApp individual** | Mensaje personalizado desde el detalle de cada beneficiario |
| 🔎 **Filtros de edad y dups** | Ahora funcionan en la búsqueda avanzada |
| 🗜️ **Compresión automática** | Historial se comprime si el almacenamiento supera el 75% |
| 🐛 **PDF corregido** | Íconos de visita aparecen correctamente en el PDF imprimible |
| ⚡ **SW mejorado** | Las llamadas al API de Anthropic ya no se cachean offline |
| 📱 **Shortcuts PWA** | "Nuevo registro" y "Buscar" disponibles desde el ícono de la app |

---

## ⌨️ Atajos de teclado (escritorio)

| Tecla | Acción |
|---|---|
| `/` | Ir a Búsqueda y enfocar el campo |
| `N` | Abrir formulario de nuevo registro |
| `A` | Abrir Asistente IA |
| `H` | Ir a Inicio |
| `S` | Ir a Estadísticas |
| `Esc` | Cerrar panel o modal activo |

---

## 📱 Requisitos

- iPhone: iOS 14+ / Safari
- Android: Chrome 90+
- Sin conexión a internet requerida después de la primera carga
- **Asistente IA**: Requiere conexión a internet + API Key de Anthropic
- **Importar Excel**: Requiere conexión (carga SheetJS la primera vez)

---

## 💾 Respaldo y migración

- Ve a **General → Almacenamiento → Respaldar JSON** para exportar todos tus datos
- Usa **Importar → CSV/Excel** para restaurar o migrar desde otra app
- Se recomienda hacer respaldo semanal si tienes más de 500 registros
