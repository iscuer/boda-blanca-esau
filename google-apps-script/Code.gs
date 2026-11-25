// Propiedades del script necesarias: SPREADSHEET_ID y GOOGLE_SHEETS_SECRET.
// No publiques la hoja: solo se accede desde el servidor con el secreto.
function doPost(e) {
  const json = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  let lock;
  try {
    const data = JSON.parse(e.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('GOOGLE_SHEETS_SECRET');
    if (!secret || data.secret !== secret) return json({ok: false, error: 'Secreto incorrecto.'});
    if (!['append', 'read', 'update'].includes(data.action)) return json({ok: false, error: 'Acción no disponible. Publica una nueva versión de Apps Script.'});
    if (data.action === 'append' && (!Array.isArray(data.rows) || data.rows.length < 1 || data.rows.length > 2)) return json({ok: false, error: 'Filas no válidas.'});
    lock = LockService.getScriptLock();
    lock.waitLock(20000);
    const book = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
    const sheet = book.getSheetByName('Confirmaciones') || book.insertSheet('Confirmaciones');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Fecha', 'Nombre y apellidos', 'Tipo', 'Asiste', 'Autobús', 'Alergias o intolerancias', 'Observaciones', 'Grupo']);
      sheet.setFrozenRows(1);
      sheet.getRange('A1:H1').setFontWeight('bold').setBackground('#9b6b45').setFontColor('#ffffff');
      sheet.setColumnWidths(1, 8, 180);
    }
    if (data.action === 'read') {
      const values = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues() : [];
      return json({ok: true, rows: values.map((r, i) => ({id: String(i + 2), fecha: r[0], nombre: r[1], tipo: r[2], asiste: r[3] === 'Sí', necesita_bus: r[4] === 'Sí', alergias: r[5] || null, observaciones: r[6] || null, grupo_id: r[7]}))});
    }
    const safe = (value, limit) => {
      const text = typeof value === 'string' ? value.trim().slice(0, limit) : '';
      return /^[=+@-]/.test(text) ? "'" + text : text;
    };
    if (data.action === 'update') {
      const original = data.original;
      const r = data.updated;
      const index = Number(original && original.id);
      if (!Number.isInteger(index) || index < 2 || index > sheet.getLastRow() || !r ||
          typeof r.nombre !== 'string' || !r.nombre.trim() || r.nombre.length > 150 ||
          !['invitado', 'acompañante'].includes(r.tipo) || typeof r.asiste !== 'boolean' ||
          typeof r.necesita_bus !== 'boolean' || r.grupo_id !== original.grupo_id) return json({ok: false, error: 'Los datos editados no son válidos.'});
      const current = sheet.getRange(index, 1, 1, 8).getValues()[0];
      const expected = [original.fecha, original.nombre, original.tipo, original.asiste ? 'Sí' : 'No', original.necesita_bus ? 'Sí' : 'No', original.alergias || '', original.observaciones || '', original.grupo_id];
      if (current.some((v, i) => JSON.stringify(v) !== JSON.stringify(expected[i]))) return json({ok: false, error: 'La fila cambió desde que se abrió. Recarga la página.'});
      sheet.getRange(index, 2, 1, 6).setValues([[safe(r.nombre, 150), r.tipo, r.asiste ? 'Sí' : 'No', r.asiste && r.necesita_bus ? 'Sí' : 'No', safe(r.alergias, 500), safe(r.observaciones, 1000)]]);
      SpreadsheetApp.flush();
      return json({ok: true});
    }
    const values = data.rows.map(r => {
      if (!r.nombre || !r.grupo_id || !['invitado', 'acompañante'].includes(r.tipo)) throw new Error('Fila no válida');
      return [new Date().toISOString(), safe(r.nombre, 150), r.tipo, r.asiste === true ? 'Sí' : 'No', r.necesita_bus === true ? 'Sí' : 'No', safe(r.alergias, 500), safe(r.observaciones, 1000), safe(r.grupo_id, 100)];
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, 8).setValues(values);
    SpreadsheetApp.flush();
    return json({ok: true});
  } catch (error) {
    return json({ok: false, error: error && error.message ? error.message : 'Error interno de Apps Script.'});
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
