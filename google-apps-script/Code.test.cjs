const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function setup() {
  const values = ['2026-10-25T10:00:00.000Z', 'Invitado', 'invitado', 'Sí', 'No', '', '', 'grupo-1'];
  const sheet = {
    getLastRow: () => 2,
    getRange: (row, col, height, width) => ({
      getValues: () => [values.slice()],
      setValues: incoming => { assert.equal(row, 2); assert.equal(width, 6); values.splice(col - 1, width, ...incoming[0]); },
    }),
  };
  let released = false;
  const context = vm.createContext({
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => key === 'WEB_APP_SECRET' ? 'test-secret' : 'sheet' }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, hasLock: () => true, releaseLock: () => { released = true; } }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
  });
  vm.runInContext(readFileSync(__dirname + '/Code.gs', 'utf8'), context);
  const original = { id: '2', fecha: values[0], nombre: values[1], tipo: values[2], asiste: true, necesita_bus: false, alergias: null, observaciones: null, grupo_id: values[7] };
  const call = data => context.doPost({ postData: { contents: JSON.stringify({ secret: 'test-secret', action: 'update', original, updated: { ...original, nombre: 'Nuevo nombre', necesita_bus: true }, ...data }) } });
  return { call, values, original, released: () => released };
}

test('edita solo la respuesta y conserva fecha y grupo', () => {
  const state = setup();
  assert.equal(state.call().ok, true);
  assert.deepEqual(state.values, ['2026-10-25T10:00:00.000Z', 'Nuevo nombre', 'invitado', 'Sí', 'Sí', '', '', 'grupo-1']);
  assert.equal(state.released(), true);
});
test('rechaza cambios concurrentes sin sobrescribir', () => {
  const state = setup(); state.values[1] = 'Cambio externo';
  assert.equal(state.call().ok, false); assert.equal(state.values[1], 'Cambio externo');
});
test('rechaza un secreto incorrecto', () => {
  const state = setup(); assert.equal(state.call({ secret: 'incorrecto' }).ok, false); assert.equal(state.values[1], 'Invitado');
});
test('neutraliza fórmulas y desactiva el autobús al no asistir', () => {
  const state = setup();
  assert.equal(state.call({ updated: { ...state.original, nombre: '=formula()', asiste: false, necesita_bus: true } }).ok, true);
  assert.equal(state.values[1], "'=formula()"); assert.equal(state.values[3], 'No'); assert.equal(state.values[4], 'No');
});
test('rechaza filas fuera del rango y cambios de grupo', () => {
  const state = setup();
  assert.equal(state.call({ original: { ...state.original, id: '3' } }).ok, false);
  assert.equal(state.call({ updated: { ...state.original, grupo_id: 'otro' } }).ok, false);
});
