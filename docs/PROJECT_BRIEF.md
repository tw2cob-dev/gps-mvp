# GPS-MVP - Brief tecnico para Codex

## Objetivo del producto
Construir un portal de tracking para ROIG/ROCH que:
- Recibe posiciones GPS por camion desde proveedor externo (API/export).
- Permite asignar manualmente camion -> contenedor.
- Genera link publico temporal (solo lectura) para compartir tracking.
- Fase siguiente: automatizar disparo del link cuando ValenciaportPCS envia evento release.

MVP: todo manual + link + mapa + email.

## Usuarios y roles
### Admin/Operativo ROIG (zona privada)
- Crea viajes (trip)
- Asigna camion a contenedor
- Genera/revoca link
- Envia email automatico a Cotransa

### Viewer publico (sin login)
- Accede con token en link
- Ve mapa y ultima posicion

## Flujo principal (MVP)
1. Operativo crea Trip con:
- containerNo
- vehicle
- driverName, driverPhone
- notifyEmail (Cotransa)
- ttl del link (ej. 72h)
2. Operativo pulsa "Compartir tracking".
3. Backend genera ShareLink(token, expiresAt) y devuelve URL `https://<dominio>/t/<token>`.
4. Backend envia email automatico con contenedor, link y datos del chofer.
5. Link publico muestra mapa con ultima posicion y ultima actualizacion.
6. Si expira o se revoca, mostrar estado caducado/revocado.

## Mapa (gratis)
- Leaflet + OpenStreetMap (sin Google Maps).
- Clustering opcional en panel interno.

## Integracion GPS
### MVP (mock)
- Endpoint/backoffice para actualizar posicion manual o job con JSON de prueba.

### Real (posterior)
Conector `gpsProvider` con:
- vehicleProviderId
- lat, lng, timestamp
- speed (opcional)

Normalizar a ultima posicion por vehiculo.

## Integracion ValenciaportPCS (Fase 2)
- Mensajeria XML (ReleaseConfirmation / AcceptanceConfirmation).
- Campos relevantes: PlateNumber (contenedor), FullOrEmptyState, ActualDateAndTime, opcional TruckPlateNumber, ExitDateAndTime.
- Objetivo:
  - Release -> activar trip + disparar link + email
  - Acceptance -> revocar link / cerrar trip
- No implementar ahora; preparar interfaz + parser.

Referencia tecnica recibida: `ce0b758c-0ea8-415e-bc32-1162d5d`.

## Backend + DB (Firebase-first)
### Servicios
- Firestore (datos)
- Cloud Functions para:
  - generar tokens
  - validar tokens
  - enviar emails
  - exponer endpoints publicos/privados
- Firebase Auth opcional para panel interno

### Colecciones minimas
#### vehicles
- id
- providerId
- plate
- name
- lastPosition: { lat, lng, timestamp, speed? }

#### trips
- id
- containerNo (PlateNumber)
- vehicleId
- driverName
- driverPhone
- notifyEmail
- status: planned | active | delivered | cancelled
- createdAt

#### shareLinks
- id
- tripId
- token
- expiresAt
- revokedAt?
- createdAt
- createdBy?
- viewCount?
- lastAccessAt?

## Endpoints (Cloud Functions HTTP)
### Privados (panel)
- POST `/api/createTrip`
- POST `/api/updateTrip`
- POST `/api/createShareLink`
  - input: { tripId, ttlMinutes }
  - output: { url, expiresAt }
  - side effect: envia email a notifyEmail
- POST `/api/revokeShareLink`
  - input: token o shareLinkId

### Publicos
- GET `/api/publicTrip?token=...`
  - valida token existente, no expirado, no revocado
  - devuelve: contenedor, chofer, ultima posicion, timestamp

## Seguridad minima
- Token no adivinable: 32 bytes random base64url.
- Token generado solo en backend.
- Caducidad por `expiresAt` y revocacion por `revokedAt`.
- Log de acceso opcional: token, ts, ip.

## UI minima
### Panel ROIG (`/admin`)
- Lista trips
- Form nuevo trip
- Boton "Compartir tracking" (URL + copiar)
- Estado link (activo/caducado/revocado)

### Publico (`/t/[token]`)
- Mapa Leaflet
- Texto: contenedor, chofer+telefono, ultima actualizacion
- Refresco cada 15-30s (polling)

## Email (Firebase Functions)
- Proveedor sugerido: SendGrid/Brevo/Resend.
- Plantilla minima:
  - Asunto: `Tracking contenedor {containerNo}`
  - Cuerpo: contenedor, link, chofer, caducidad.
