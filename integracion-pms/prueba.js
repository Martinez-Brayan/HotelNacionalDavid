'use strict';

/**
 * Prueba local del generador de XML. No se conecta a ningún servidor.
 *
 * Uso:
 *   node integracion-pms/prueba.js [ruta-al-xml-de-ejemplo]
 *
 * Con la ruta del XML de ejemplo del proveedor, además compara las etiquetas generadas
 * contra las del ejemplo.
 */

const fs = require('fs');
const assert = require('assert');
const { construirXmlReserva } = require('./reserva-xml');
const { HABITACIONES } = require('./pms-codigos');

let pasadas = 0;
function prueba(nombre, fn) {
    try {
        fn();
        pasadas++;
        console.log('  OK   ' + nombre);
    } catch (error) {
        console.log('  FALLA ' + nombre + '\n         ' + error.message);
        process.exitCode = 1;
    }
}

const base = {
    habitacion: 'deluxe-king',
    checkin: '2026-12-10',
    checkout: '2026-12-12',
    personas: '2',
    personasAdicionales: '',
    nombre: 'Maria Perez Gomez',
    email: 'maria@example.com',
    telefono: '+507 6000-0000',
    mensaje: 'Llegada tarde',
    // Datos de tarjeta de prueba (NO reales): deben ser ignorados por el generador.
    tipoTarjeta: 'visa',
    numeroTarjeta: '4111 1111 1111 1111',
    vencimiento: '12/30'
};
const fijo = { localizer: '99001', ahora: new Date('2026-11-19T12:00:00Z') };

console.log('Pruebas del generador de reservas:');

prueba('genera los códigos del PMS (habitación 20, régimen 26, tarifa 14)', () => {
    const xml = construirXmlReserva(base, fijo);
    assert(xml.includes('<RoomCode>20</RoomCode>'));
    assert(xml.includes('<BoardCode>26</BoardCode>'));
    assert(xml.includes('<Rate>14</Rate>'));
    assert(xml.includes('<FromDate>2026-12-10</FromDate>'));
    assert(xml.includes('<ToDate>2026-12-12</ToDate>'));
    assert(xml.includes('<CreationDate>2026-11-19</CreationDate>'));
    assert(xml.includes('<Localizer>99001</Localizer>'));
});

prueba('NO incluye ningún dato de tarjeta', () => {
    const xml = construirXmlReserva(base, fijo);
    assert(!xml.includes('4111'), 'aparece el número de tarjeta');
    assert(!xml.includes('12/30'), 'aparece el vencimiento');
    assert(xml.includes('<CardNumber></CardNumber>'));
    assert(xml.includes('<CardExpiration></CardExpiration>'));
});

prueba('anota solo marca y últimos 4 dígitos en las observaciones', () => {
    const xml = construirXmlReserva({ ...base, tarjetaMarca: 'visa', tarjetaUltimos4: '1111' }, fijo);
    assert(xml.includes('Llegada tarde | Tarjeta Visa terminada en 1111 (solo validacion)'));
    assert(!xml.includes('4111'), 'aparece el número completo');
});

prueba('rechaza un número completo en el campo de últimos 4', () => {
    assert.throws(() => construirXmlReserva({ ...base, tarjetaMarca: 'visa', tarjetaUltimos4: '4111111111111111' }, fijo), /4 dígitos/);
    assert.throws(() => construirXmlReserva({ ...base, tarjetaMarca: 'amex', tarjetaUltimos4: '1111' }, fijo), /visa o mastercard/);
});

prueba('suma personas adicionales a los adultos', () => {
    const xml = construirXmlReserva({ ...base, habitacion: 'deluxe-doble', personas: '2', personasAdicionales: '2' }, fijo);
    assert(xml.includes('<Adult>4</Adult>'));
    assert(xml.includes('<RoomCode>19</RoomCode>'));
});

prueba('separa nombre y apellido', () => {
    const xml = construirXmlReserva(base, fijo);
    assert(xml.includes('<Name>Maria</Name>'));
    assert(xml.includes('<Surname>Perez Gomez</Surname>'));
});

prueba('escapa caracteres especiales en el XML', () => {
    const xml = construirXmlReserva({ ...base, nombre: 'Ana <script> & Co', mensaje: 'Quiero "cuna" & vista' }, fijo);
    assert(!xml.includes('<script>'));
    assert(xml.includes('Ana &lt;script&gt; &amp; Co'));
    assert(xml.includes('&quot;cuna&quot; &amp; vista'));
});

prueba('rechaza habitación desconocida', () => {
    assert.throws(() => construirXmlReserva({ ...base, habitacion: 'suite-presidencial' }, fijo), /desconocido/);
});

prueba('rechaza salida igual o anterior a la llegada', () => {
    assert.throws(() => construirXmlReserva({ ...base, checkout: '2026-12-10' }, fijo), /posterior/);
    assert.throws(() => construirXmlReserva({ ...base, checkout: '2026-12-01' }, fijo), /posterior/);
});

prueba('rechaza llegada en fecha pasada y acepta la de hoy (hora de Panamá)', () => {
    assert.throws(() => construirXmlReserva({ ...base, checkin: '2026-11-18', checkout: '2026-11-20' }, fijo), /anterior a hoy/);
    assert(construirXmlReserva({ ...base, checkin: '2026-11-19', checkout: '2026-11-20' }, fijo).includes('<FromDate>2026-11-19</FromDate>'));
    // 21:00 en Panamá del 19-nov ya es el 20-nov en UTC: la llegada del día 19 debe seguir siendo válida.
    const nocheEnPanama = { localizer: '99002', ahora: new Date('2026-11-20T02:00:00Z') };
    const xml = construirXmlReserva({ ...base, checkin: '2026-11-19', checkout: '2026-11-20' }, nocheEnPanama);
    assert(xml.includes('<CreationDate>2026-11-19</CreationDate>'));
});

prueba('rechaza fechas con formato inválido y datos de contacto vacíos', () => {
    assert.throws(() => construirXmlReserva({ ...base, checkin: '10/12/2026' }, fijo), /llegada/);
    assert.throws(() => construirXmlReserva({ ...base, email: '' }, fijo), /email/);
});

prueba('todas las habitaciones de la web tienen código PMS', () => {
    for (const valor of Object.keys(HABITACIONES)) {
        const xml = construirXmlReserva({ ...base, habitacion: valor }, fijo);
        assert(xml.includes(`<RoomCode>${HABITACIONES[valor].codigo}</RoomCode>`), valor);
    }
});

const rutaEjemplo = process.argv[2];
if (rutaEjemplo) {
    prueba('las etiquetas coinciden con el XML de ejemplo del proveedor', () => {
        const etiquetas = texto => new Set((texto.match(/<([A-Za-z][A-Za-z0-9]*)/g) || []).map(t => t.slice(1)));
        const ejemplo = etiquetas(fs.readFileSync(rutaEjemplo, 'utf8'));
        const generado = etiquetas(construirXmlReserva(base, fijo));
        const sobran = [...generado].filter(t => !ejemplo.has(t));
        assert.deepStrictEqual(sobran, [], 'etiquetas que el ejemplo no tiene: ' + sobran.join(', '));
        const faltan = [...ejemplo].filter(t => !generado.has(t));
        console.log('         Etiquetas del ejemplo que NO se generan (a revisar con el proveedor): ' + (faltan.join(', ') || 'ninguna'));
    });
}

console.log(`\n${pasadas} prueba(s) pasada(s)` + (process.exitCode ? ' — HAY FALLAS' : ''));
