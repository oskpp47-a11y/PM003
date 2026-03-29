# 🛡️ Pensionados MX v31

App web progresiva (PWA) para gestión de beneficiarios de programas sociales.  
Funciona **100% sin internet** — todos los datos se guardan en tu dispositivo.

---

## 📦 Archivos incluidos

| Archivo | Descripción |
|---|---|
| `index.html` | App completa (toda la lógica en un solo archivo) |
| `sw.js` | Service Worker — permite uso offline |
| `manifest.json` | Configuración PWA |
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

## ✨ Novedades v31

- Sistema de auth completamente reescrito (3 roles)
- Pantallas de bienvenida / login / registro / invitado independientes
- Ícono SVG profesional en la barra de navegación inferior
- Reloj en tiempo real en el encabezado (toca para cambiar 12h/24h)
- Limitaciones completas para modo invitado
- Teléfono y CURP enmascarados para invitados
- Modal de upgrade al intentar funciones restringidas
- Sección General rediseñada con perfil, estadísticas y FAQ

---

## 📱 Requisitos

- iPhone: iOS 14+ / Safari
- Android: Chrome 90+
- Sin conexión a internet requerida después de la primera carga
