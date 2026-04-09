# Changelog — Pensionados MX

## v39 (2026-04-08)
### ✅ Errores corregidos
- `SyntaxError: Unexpected identifier 'secciones'` — onclick anidado en strings JS
- `Unexpected string` en chips de sección — onclick con comillas conflictivas
- `updateSyncBadge` duplicada (líneas 11932 y 12240)
- Botones de panel SIGE con comillas rotas

### 🗺 SIGE — Búsqueda por Sección Electoral
- Barra de búsqueda estilo INE/SIGE
- Panel de estadísticas por sección (total, visitados, pendientes)
- Chips rápidos con secciones activas
- Centrado automático del mapa en la sección buscada
- 3 capas de mapa: Calles / Oscuro (CartoDB) / Satélite (Esri)
- Tema visual SIGE (azul marino + rojo electoral)

### 🤖 Automatización
- GPS capturado automáticamente al abrir formulario
- Sección sugerida por vecinos GPS (radio 300m)
- Botón "Auto" en campo Sección
- Teléfono auto-formateado: `4921234567` → `492-123-4567`
- Búsqueda home extendida: sección + colonia + CURP
- Chips SIGE se refrescan al guardar registros
- Tipografía: DM Sans + JetBrains Mono + Syne

## v38 (2026-04-07)
- Mapa Leaflet con marcadores por programa
- Filtros de mapa por programa (PAM/PCD/JCF/MT/BBJ)
- Página de Secciones con heatmap de cobertura
- Tema Cosmos rediseñado

## v37
- Heatmap de secciones
- Asignación masiva de sección
- Exportación por sección

## v36
- Rediseño completo header + nav + home
- Bottom nav con iconos SVG
- Hero card con gradiente
