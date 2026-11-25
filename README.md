# Web de Blanca y Esaú

## Qué archivo editar

| Quiero cambiar | Archivo |
| --- | --- |
| Fecha, hoteles, regalo, mensajes y fotos | [app/boda.ts](app/boda.ts) |
| Texto de la portada, ceremonia y banquete | [app/page.tsx](app/page.tsx) |
| Menú de la hoja central y comportamiento del tríptico | [components/Triptico.tsx](components/Triptico.tsx) |
| Colores, tipografía, tamaños, bordes y animaciones | [app/globals.css](app/globals.css) |
| Campos del formulario de asistencia | [components/RsvpForm.tsx](components/RsvpForm.tsx) |

En `fotosMenu` puedes cambiar `src` para elegir la imagen de cada opción y `encuadre` para ajustar qué parte se ve. Las imágenes del menú están en `public/invitacion/menu`. Para el álbum, guarda las fotos en `public/fotos` y añade sus rutas y descripciones a `fotos`. En el código, escribe `/fotos/retrato.jpg` para un archivo guardado como `public/fotos/retrato.jpg`.

## Ver los cambios en tu ordenador

1. Abre la carpeta del proyecto en Visual Studio Code. Si acabas de clonar el repositorio, ejecuta `npm ci` en el terminal integrado.
2. Si el servidor ya está activo, abre la [vista previa local](http://127.0.0.1:3015/). Para iniciarlo desde Visual Studio Code, abre la paleta con **Ctrl + Mayús + P**, elige **Tasks: Run Task** y selecciona **Boda · Abrir servidor local**.
3. Guarda los archivos con **Ctrl + S**. La vista previa se actualiza al guardar. Prueba el menú con **Abrir invitación** y comprueba el apartado que hayas tocado.

## Publicar una actualización

1. Abre **Control de código fuente** con **Ctrl + Mayús + G** y revisa el diff de cada archivo.
2. Pulsa **+** junto a los archivos que quieras publicar. Incluye las imágenes nuevas si has cambiado alguna ruta.
3. Escribe un mensaje breve y pulsa **Confirmar** o **Commit**.
4. Pulsa **Sincronizar cambios** o elige **Push** en el menú **…**. La rama de producción es `main` y el remoto es [iscuer/boda-blanca-esau](https://github.com/iscuer/boda-blanca-esau).
5. Vercel crea el despliegue automáticamente. Cuando figure como **Ready**, revisa la [invitación publicada](https://boda-blanca-esau.vercel.app/).

Las variables privadas se guardan en `.env.local` y en Vercel. Git ignora `.env.local`. En la [zona privada](https://boda-blanca-esau.vercel.app/novios) se pueden consultar y editar las respuestas y descargar el Excel.

## Conectar la hoja de esta boda

1. Crea una hoja privada en Google Sheets y copia su ID desde la URL.
2. En Extensiones → Apps Script, pega `google-apps-script/Code.gs`.
3. En las propiedades del script, configura `SPREADSHEET_ID` y un `GOOGLE_SHEETS_SECRET` aleatorio y largo.
4. Implementa el script como aplicación web, ejecútalo como propietario y permite que el servidor lo llame sin iniciar sesión. El script exige el secreto y la hoja permanece privada.
5. Copia `.env.example` a `.env.local`. Configura la URL de Apps Script terminada en `/exec`, el mismo secreto y la contraseña de la zona privada. Usa esas variables también en el alojamiento.
6. Comprueba un envío en la pestaña Confirmaciones, entra en `/novios` y abre el Excel descargado.
