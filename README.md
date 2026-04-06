# 🛡️ Pensionados MX v32

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

## ✨ Novedades v32 — Edición Suprema

- **🤖 Asistente IA integrado** — Chat con Claude que analiza tu base de datos en tiempo real. Pregunta en lenguaje natural: ¿Quién visitar hoy? ¿Cuántos activos hay? ¿Cuál sección tiene menos cobertura?
- **🏆 Sistema de logros** — 10 badges desbloqueables por hitos (10 registros, 50 visitas, racha de 7 días, 80% cobertura, etc.)
- **🎯 Cola de prioridad inteligente** — Algoritmo que rankea automáticamente a quién visitar hoy según días sin actualizar, estatus y cumpleaños
- **🗺️ Mapa de calor de cobertura** — Grid visual por sección con colores según % visitado (🔴<30% 🟡30-60% 🔵60-99% 🟢100%)
- **💡 Insights IA en dashboard** — Chip rotativo con análisis automático de tu base de datos
- **🎉 Confeti al cumplir meta** — Celebración animada cuando alcanzas tu meta de visitas diaria
- **🔢 Contadores animados** — Todos los números hacen animación suave al actualizarse

---

## 📱 Requisitos

- iPhone: iOS 14+ / Safari
- Android: Chrome 90+
- Sin conexión a internet requerida después de la primera carga
- **Asistente IA**: Requiere conexión a internet solo cuando uses el chat
