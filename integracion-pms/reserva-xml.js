'use strict';

const { HABITACIONES, DEFECTOS } = require('./pms-codigos');

/**
 * Convierte los datos del formulario de reserva (index.html, #formularioReserva)
 * en el XML <Bookings> con el formato del ejemplo entregado por el proveedor del PMS.
 *
 * Reglas:
 *  - Los datos de tarjeta (numeroTarjeta, vencimiento, tipoTarjeta) se IGNORAN a propósito.
 *    CardNumber y CardExpiration salen vacíos, como en el ejemplo. El hotel debe decidir cómo
 *    garantizar la reserva antes de enviar tarjetas por FTP.
 *  - Es una función pura: no lee archivos ni se conecta a nada.
 *
 * SUPUESTOS pendientes de validar con el proveedor (ver comentarios marcados SUPUESTO).
 */

function escapeXml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function esFechaIso(valor) {
    return /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor));
}

// Fecha de hoy en Panamá (UTC-5, sin horario de verano) y no en UTC: de noche, UTC ya está en "mañana".
function hoyIso(ahora) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Panama' }).format(ahora);
}

// SUPUESTO: el formulario trae un solo "Nombre Completo"; se toma la primera palabra como nombre
// y el resto como apellido.
function separarNombre(nombreCompleto) {
    const partes = String(nombreCompleto || '').trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return { nombre: '', apellido: '' };
    return { nombre: partes[0], apellido: partes.slice(1).join(' ') };
}

function validar(datos, ahora) {
    const errores = [];
    if (!HABITACIONES[datos.habitacion]) errores.push(`Tipo de habitación desconocido: "${datos.habitacion}"`);
    if (!esFechaIso(datos.checkin)) errores.push('Fecha de llegada inválida (se espera AAAA-MM-DD)');
    if (!esFechaIso(datos.checkout)) errores.push('Fecha de salida inválida (se espera AAAA-MM-DD)');
    if (esFechaIso(datos.checkin) && esFechaIso(datos.checkout) && datos.checkout <= datos.checkin) {
        errores.push('La salida debe ser posterior a la llegada');
    }
    if (esFechaIso(datos.checkin) && datos.checkin < hoyIso(ahora)) {
        errores.push('La fecha de llegada no puede ser anterior a hoy');
    }
    if (!String(datos.nombre || '').trim()) errores.push('Falta el nombre');
    if (!String(datos.email || '').trim()) errores.push('Falta el email');
    if (!String(datos.telefono || '').trim()) errores.push('Falta el teléfono');
    const adultos = Number(datos.personas) + Number(datos.personasAdicionales || 0);
    if (!Number.isInteger(adultos) || adultos < 1) errores.push('Número de personas inválido');
    // Referencia de tarjeta: opcional, pero si viene debe ser solo marca y 4 dígitos.
    // Se rechaza cualquier otra cosa para que un número completo nunca llegue al XML.
    if (datos.tarjetaUltimos4 !== undefined && datos.tarjetaUltimos4 !== '' && !/^\d{4}$/.test(String(datos.tarjetaUltimos4))) {
        errores.push('tarjetaUltimos4 debe tener exactamente 4 dígitos');
    }
    if (datos.tarjetaMarca !== undefined && datos.tarjetaMarca !== '' && !['visa', 'mastercard'].includes(datos.tarjetaMarca)) {
        errores.push('tarjetaMarca debe ser visa o mastercard');
    }
    return errores;
}

/**
 * @param {object} datos  Campos del formulario (habitacion, checkin, checkout, personas,
 *                        personasAdicionales, nombre, email, telefono, mensaje).
 * @param {object} [opciones]
 * @param {string} [opciones.localizer]  Referencia única de la reserva. Por defecto, la hora actual en ms.
 *                                       SUPUESTO: el PMS acepta un localizador numérico (el ejemplo usa 20003).
 * @param {Date}   [opciones.ahora]      Fecha de creación (útil para pruebas).
 * @param {number} [opciones.regimen]    Código de régimen (por defecto 26).
 * @param {number} [opciones.tarifa]     Código de tarifa (por defecto 14).
 * @returns {string} XML de la reserva.
 */
function construirXmlReserva(datos, opciones = {}) {
    const ahora = opciones.ahora || new Date();
    const errores = validar(datos, ahora);
    if (errores.length > 0) {
        const error = new Error('Datos de reserva inválidos: ' + errores.join('; '));
        error.errores = errores;
        throw error;
    }

    const habitacion = HABITACIONES[datos.habitacion];
    const regimen = opciones.regimen ?? DEFECTOS.regimen;
    const tarifa = opciones.tarifa ?? DEFECTOS.tarifa;
    const localizer = opciones.localizer || String(ahora.getTime());
    const adultos = Number(datos.personas) + Number(datos.personasAdicionales || 0);
    const { nombre, apellido } = separarNombre(datos.nombre);
    // Una sola línea de observaciones, como en el ejemplo del proveedor.
    // La referencia de tarjeta es solo informativa (validación); no se debe cobrar con ella.
    const marcas = { visa: 'Visa', mastercard: 'Mastercard' };
    const referenciaTarjeta = datos.tarjetaUltimos4
        ? `Tarjeta ${marcas[datos.tarjetaMarca] || ''} terminada en ${datos.tarjetaUltimos4} (solo validacion)`.replace('Tarjeta  ', 'Tarjeta ')
        : '';
    const observaciones = [String(datos.mensaje || '').trim(), referenciaTarjeta].filter(Boolean).join(' | ');

    // SUPUESTO: solo se lista como Pax a la persona que reserva; el resto de adultos va en <PaxRoom>.
    // El formulario no pide nombres de acompañantes.
    const pax = `<Pax>
                    <OccupantId>1</OccupantId><Name>${escapeXml(nombre)}</Name>
                    <Surname>${escapeXml(apellido)}</Surname>
                    <Phone>${escapeXml(datos.telefono)}</Phone>
                    <Email>${escapeXml(datos.email)}</Email>
                    <CardNumber></CardNumber>
                    <CardExpiration></CardExpiration>
                </Pax>`;

    return `<Bookings>
    <Booking>
        <MappedCodes>true</MappedCodes>
        <Localizer>${escapeXml(localizer)}</Localizer>
        <AgencyCode>${escapeXml(DEFECTOS.agencia)}</AgencyCode>
        <Phone>${escapeXml(datos.telefono)}</Phone>
        <Email>${escapeXml(datos.email)}</Email>
        <Rooms><Room>
            <CreationDate>${hoyIso(ahora)}</CreationDate>
            <FromDate>${escapeXml(datos.checkin)}</FromDate>
            <ToDate>${escapeXml(datos.checkout)}</ToDate>
            <BoardCode>${regimen}</BoardCode>
            <Rate>${tarifa}</Rate>
            <RoomCode>${habitacion.codigo}</RoomCode>
            <LineId>1</LineId>
            <Status>1</Status>
            <RoomReference>1</RoomReference>
            <SequenceID>1</SequenceID><PackageCode/>
            <Contact>${escapeXml(datos.nombre)}</Contact>
            <PaxRoom>
                <Adult>${adultos}</Adult>
                <Child>0</Child>
                <Baby>0</Baby>
            </PaxRoom><Paxes>
                <AdultPaxes>${pax}</AdultPaxes></Paxes><Observations><Line>${escapeXml(observaciones)}</Line></Observations></Room></Rooms></Booking>
</Bookings>`;
}

module.exports = { construirXmlReserva, escapeXml };
