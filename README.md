# Web de boda

Edita `app/boda.ts` en Visual Studio Code para añadir hoteles (nombre, zona y URL), los mensajes de Blanca y Esaú y la información del regalo. Guarda las imágenes en `public/fotos` y rellena cada entrada de la galería con su ruta (por ejemplo, `/fotos/retrato.jpg`) y una descripción breve.

Ejecuta `npm ci` y `npm run dev`. La página principal incluye el formulario de asistencia. En `/novios` se pueden consultar y editar las respuestas y descargar el archivo `.xlsx`.

## Conectar la hoja de esta boda

1. Crea una hoja privada en Google Sheets y copia su ID desde la URL.
2. En Extensiones → Apps Script, pega `google-apps-script/Code.gs`.
3. En las propiedades del script, configura `SPREADSHEET_ID` y un `GOOGLE_SHEETS_SECRET` aleatorio y largo.
4. Implementa el script como aplicación web, ejecútalo como propietario y permite que el servidor lo llame sin iniciar sesión. El script exige el secreto y la hoja permanece privada.
5. Copia `.env.example` a `.env.local`. Configura la URL de Apps Script terminada en `/exec`, el mismo secreto y la contraseña de la zona privada. Usa esas variables también en el alojamiento.
6. Comprueba un envío en la pestaña Confirmaciones, entra en `/novios` y abre el Excel descargado.
