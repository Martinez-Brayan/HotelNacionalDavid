
// Detecta el idioma de la página desde el atributo lang del HTML
// index.html → 'es' | index-en.html → 'en'
const pageLang = document.documentElement.lang || 'es';
const isEn = pageLang === 'en';

// ── Navegación ────────────────────────────────────────────────────────────────

function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            navbar.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        hamburger.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                hamburger.click();
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navbar.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function () {
        if (navbar) navbar.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
}

// ── Fechas ────────────────────────────────────────────────────────────────────

function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setupDateInputs() {
    const today = new Date();
    const todayISO = formatDateToISO(today);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = formatDateToISO(tomorrow);

    // Buscador rápido del hero
    const checkinHero = document.getElementById('checkin');
    const checkoutHero = document.getElementById('checkout');
    if (checkinHero) {
        checkinHero.min = todayISO;
        checkinHero.addEventListener('change', function () {
            if (checkoutHero) {
                const nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkoutHero.min = formatDateToISO(nextDay);
                if (checkoutHero.value && checkoutHero.value <= this.value) {
                    checkoutHero.value = '';
                }
            }
        });
    }
    if (checkoutHero) checkoutHero.min = tomorrowISO;

    // Formulario de reserva
    const checkinForm = document.getElementById('reservaCheckin');
    const checkoutForm = document.getElementById('reservaCheckout');
    if (checkinForm) {
        checkinForm.min = todayISO;
        checkinForm.addEventListener('change', function () {
            if (checkoutForm) {
                const nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkoutForm.min = formatDateToISO(nextDay);
                if (checkoutForm.value && checkoutForm.value <= this.value) {
                    checkoutForm.value = '';
                }
            }
        });
    }
    if (checkoutForm) checkoutForm.min = tomorrowISO;
}

// ── Formularios ───────────────────────────────────────────────────────────────

function setupFormHandling() {
    const reservationForm = document.getElementById('formularioReserva');
    const contactForm = document.getElementById('contactForm');

    if (reservationForm) {
        reservationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleReservationSubmit(this);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleContactSubmit(this);
        });
    }

    setupDateInputs();
}

function handleReservationSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.habitacion || !data.nombre || !data.email || !data.telefono || !data.checkin || !data.checkout) {
        alert(isEn
            ? 'Please complete all required fields.'
            : 'Por favor completa todos los campos requeridos.');
        return;
    }

    const checkin = new Date(data.checkin);
    const checkout = new Date(data.checkout);
    if (checkout <= checkin) {
        alert(isEn
            ? 'Check-out date must be after check-in date.'
            : 'La fecha de salida debe ser posterior a la de llegada.');
        return;
    }

    console.log('Datos de reserva:', data);
    alert(isEn
        ? 'Thank you! Your booking request has been received. We will contact you soon.'
        : '¡Gracias! Tu reserva ha sido recibida. Nos pondremos en contacto pronto.');

    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.nombre || !data.email || !data.telefono || !data.mensaje) {
        alert(isEn
            ? 'Please complete name, email, phone and message.'
            : 'Completa nombre, email, teléfono y mensaje.');
        return;
    }

    console.log('Mensaje de contacto:', data);
    alert(isEn
        ? 'Message sent! We will get back to you soon.'
        : '¡Mensaje enviado! Te responderemos a la brevedad.');

    form.reset();
}

// ── Buscador rápido ───────────────────────────────────────────────────────────

function setupQuickSearch() {
    const btnSearch = document.querySelector('.btn-search');
    if (!btnSearch) return;

    btnSearch.addEventListener('click', function () {
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const personas = document.getElementById('personas').value;

        if (!checkin || !checkout) {
            alert(isEn ? 'Please select dates.' : 'Por favor selecciona las fechas.');
            return;
        }

        const ci = new Date(checkin);
        const co = new Date(checkout);
        if (co <= ci) {
            alert(isEn ? 'Invalid dates.' : 'Las fechas no son válidas.');
            return;
        }

        document.getElementById('habitaciones').scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(function () {
            alert(isEn
                ? `Found rooms for ${personas} guest(s) from ${checkin} to ${checkout}.`
                : `Se encontraron habitaciones para ${personas} persona(s) del ${checkin} al ${checkout}.`);
        }, 500);
    });
}

// ── Animaciones de scroll ─────────────────────────────────────────────────────

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'slideInUp 0.6s ease-out';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.habitacion-card, .servicio-card, .experiencia-card, .contacto-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// ── Anclas suaves ─────────────────────────────────────────────────────────────

function setupAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── Sombra del header al hacer scroll ────────────────────────────────────────

function setupHeaderShadow() {
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (!header) return;
        header.style.boxShadow = window.scrollY > 50
            ? '0 6px 20px rgba(0, 0, 0, 0.15)'
            : '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
}

// ── Inicialización ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupFormHandling();
    setupQuickSearch();
    setupScrollAnimations();
    setupAnchorLinks();
    setupHeaderShadow();
});

console.log('Hotel Nacional David — Sitio web cargado correctamente');
