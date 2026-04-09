# Formato CSV para importación de beneficiarios

## Columnas requeridas

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| Folio | Clave única del beneficiario | F-0001 |
| Nombre | Nombre completo (MAYÚSCULAS) | GARCIA LOPEZ JUAN |
| Programa | PAM / PCD / JCF / MT / BBJ | PAM |
| Telefono | 10 dígitos o formato xxx-xxx-xxxx | 492-123-4567 |
| Domicilio | Nombre de calle | Calle Juárez |
| Numero | Número exterior | 123 |
| Colonia | Colonia o barrio | Centro |
| Seccion | Sección electoral | 617 |
| Area | Zona de cobertura | Norte |
| Ruta | Ruta asignada | Ruta 1 |
| CURP | 18 caracteres | GALJ800101HZSMRN05 |
| FechaNacimiento | YYYY-MM-DD | 1980-01-01 |
| Estatus | Activo / Inactivo / Pendiente / Baja | Activo |
| Observaciones | Notas adicionales | Domicilio confirmado |

## Ejemplo completo

```csv
Folio,Nombre,Programa,Telefono,Domicilio,Numero,Colonia,Seccion,Area,Ruta,CURP,FechaNacimiento,Estatus,Observaciones
F-0001,GARCIA LOPEZ JUAN,PAM,492-123-4567,Calle Juarez,123,Centro,617,Norte,Ruta 1,GALJ800101HZSMRN05,1980-01-01,Activo,Primer registro
F-0002,MARTINEZ ROMO ANA,PCD,492-456-7890,Av. Hidalgo,45,La Joya,618,Sur,Ruta 2,MARA750315MZSRMN08,1975-03-15,Activo,Requiere silla de ruedas
```
