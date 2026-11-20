'use strict';

/**
 * Equivalencias entre el formulario de la web y los códigos del PMS del hotel.
 * Fuente: tablas ARTICULOS / ARTICULOSREGIMENES / TARIFASHOTEL de la base FHOTELNACIONAL
 * (respaldo del 14-04-2026) y capturas entregadas por el proveedor.
 *
 * Los valores de la web son los `value` del <select name="habitacion"> de index.html.
 */

const HABITACIONES = {
    // "Habitación Doble" = 17 (Standar, 2 camas dobles), según la tabla del proveedor. Confirmado por Brayan.
    'habitacion-doble': { codigo: 17, referencia: 'HAB001', descripcion: 'Standar, 2 camas dobles' },
    'double-room': { codigo: 17, referencia: 'HAB001', descripcion: 'Standar, 2 camas dobles' },

    'deluxe-king': { codigo: 20, referencia: 'HAB004', descripcion: 'King DeLux, 1 cama King' },

    'deluxe-doble': { codigo: 19, referencia: 'HAB003', descripcion: 'Doble DeLux, 2 camas dobles' },
    'deluxe-double': { codigo: 19, referencia: 'HAB003', descripcion: 'Doble DeLux, 2 camas dobles' },

    'jr-suite-king': { codigo: 21, referencia: 'HAB005', descripcion: 'JrSuit 1, 1 cama King' },

    'jr-suite-doble': { codigo: 22, referencia: 'HAB006', descripcion: 'JrSuit 2, 2 camas King' },
    'jr-suite-double': { codigo: 22, referencia: 'HAB006', descripcion: 'JrSuit 2, 2 camas King' },

    'pool-side-king': { codigo: 23, referencia: 'HAB007', descripcion: 'PoolSide 1, 1 cama King' },

    'pool-side-doble': { codigo: 24, referencia: 'HAB008', descripcion: 'PoolSide 2, 2 camas Dobles' },
    'pool-side-double': { codigo: 24, referencia: 'HAB008', descripcion: 'PoolSide 2, 2 camas Dobles' },

    'master-suite': { codigo: 25, referencia: 'HAB009', descripcion: 'Master Suit Interconectada' }
    // Sin equivalente en la web: 18 (Standar discapacitado, HAB002) y 1002 (Standars Basica, HAB010).
};

const REGIMENES = {
    desayuno: { codigo: 26, referencia: 'REG001' },
    almuerzo: { codigo: 27, referencia: 'REG002' },
    cena: { codigo: 28, referencia: 'REG003' },
    sinRegimen: { codigo: 39, referencia: 'REG004' }
};

const TARIFAS = {
    HOTEL_WEB: 14
};

/**
 * Valores por defecto de una reserva hecha desde la web.
 * SUPUESTOS a validar con el proveedor del PMS:
 *  - regimen 26 (desayuno): es el REGIMENWEB configurado en la ficha del hotel.
 *  - tarifa 14 (HOTEL WEB): la tarifa pensada para la web.
 */
const DEFECTOS = {
    regimen: REGIMENES.desayuno.codigo,
    tarifa: TARIFAS.HOTEL_WEB,
    agencia: 'WEB'
};

module.exports = { HABITACIONES, REGIMENES, TARIFAS, DEFECTOS };
