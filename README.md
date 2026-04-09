# 🏛 Pensionados MX v39

**Sistema de gestión de beneficiarios de programas sociales** — PWA offline-first para registro, seguimiento y mapeo geoespacial de adultos mayores y personas con discapacidad en México.

---

## 🗂 Estructura del proyecto

```
PensionadosMX/
├── index.html          # Shell HTML (PWA)
├── manifest.json       # Configuración PWA
├── sw.js               # Service Worker (offline)
├── css/
│   └── styles.css      # Estilos completos (temas, SIGE, mapa)
├── js/
│   └── app.js          # Lógica principal (~12,000 líneas)
├── assets/
│   ├── icon-192.png    # Ícono PWA
│   └── icon-512.png    # Ícono PWA splash
└── docs/
    ├── CHANGELOG.md    # Historial de versiones
    └── CSV_TEMPLATE.md # Formato de importación
```

---

## 🚀 Programas soportados

| Código | Programa |
|--------|----------|
| PAM    | Adultos Mayores |
| PCD    | Personas con Discapacidad |
| JCF    | Jóvenes Construyendo el Futuro |
| MT     | Mujeres Trabajadoras |
| BBJ    | Beca Benito Juárez |

---

## 🗺 SIGE — Sistema de Información Geográfica Electoral

La pestaña **Mapa** integra búsqueda por sección electoral:

- Buscar sección por número
- Ver cobertura de visitas por sección
- Centrar mapa en marcadores de la sección
- Exportar registros de sección a CSV
- Chips rápidos con secciones activas
- 3 capas base: Calles / Oscuro / Satélite

**Auto-funciones del SIGE:**
- GPS capturado automáticamente al abrir formulario
- Sección sugerida por vecinos geográficos (radio 300m)
- Chips de sección se actualizan al guardar registros

---

## 📱 Instalación como PWA

1. Abre `index.html` en el servidor
2. En iOS: Safari → Compartir → **Agregar a inicio**
3. En Android: Chrome → Menú → **Instalar app**

---

## 📥 Importación masiva CSV

Formato del CSV para importar beneficiarios:

```
Folio,Nombre,Programa,Telefono,Domicilio,Numero,Colonia,Seccion,Area,Ruta,CURP,FechaNacimiento,Estatus,Observaciones
F-0001,GARCIA LOPEZ JUAN,PAM,492-000-0000,Calle Juarez,123,Centro,617,Norte,Ruta 1,GALJ800101HZSMRN05,1980-01-01,Activo,Ejemplo
```

---

## 🎨 Temas disponibles

`cosmos` · `sige` · `aurora` · `solar` · `rose` · `arctic` · `midnight` · `carbon` · `campo`

---

## 📋 Versión

**v39** — Rediseño SIGE + Automatización GPS + Corrección de errores JS  
Desarrollado para uso en campo — Zacatecas, México
