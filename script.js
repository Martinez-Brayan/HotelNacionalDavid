const translations = {
    es: {
        'nav.home': 'Inicio',
        'nav.rooms': 'Habitaciones',
        'nav.services': 'Servicios',
        'nav.restaurant': 'Restaurante',
        'nav.gallery': 'Galería',
        'nav.location': 'Ubicación',
        'nav.contact': 'Contacto',
        'nav.bookNow': 'Reservar Ahora',
        'hero.title': 'Tu descanso perfecto comienza aquí',
        'hero.subtitle': 'Habitaciones cómodas, excelente ubicación y atención personalizada',
        'hero.viewRooms': 'Ver Habitaciones',
        'hero.bookButton': 'Reservar Ahora',
        'search.checkin': 'Fecha de Llegada',
        'search.checkout': 'Fecha de Salida',
        'search.guests': 'Personas',
        'search.search': 'Buscar',
        'guest.1': '1 Persona',
        'guest.2': '2 Personas',
        'guest.3': '3 Personas',
        'guest.4': '4 Personas',
        'guest.5': '5+ Personas',
        'rooms.title': 'Nuestras Habitaciones',
        'rooms.subtitle': 'Descubre el confort de nuestras instalaciones',
        'services.title': 'Servicios del Hotel',
        'why.title': '¿Por Qué Elegirnos?',
        'restaurant.title': 'Nuestro Restaurante',
        'restaurant.subtitle': 'Deléitate con nuestras exquisitas opciones culinarias',
        'gallery.title': 'Galería',
        'gallery.subtitle': 'Visualiza la belleza de nuestro hotel',
        'experiences.title': 'Experiencias Especiales',
        'reviews.title': 'Opiniones de Clientes',
        'location.title': 'Ubicación',
        'faq.title': 'Preguntas Frecuentes',
        'booking.title': 'Formulario de Reserva',
        'booking.roomType': 'Tipo de Habitación',
        'booking.checkin': 'Fecha de Llegada',
        'booking.checkout': 'Fecha de Salida',
        'booking.guests': 'Número de Personas',
        'booking.fullName': 'Nombre Completo',
        'booking.email': 'Email',
        'booking.phone': 'Teléfono / WhatsApp',
        'booking.message': 'Mensaje o Solicitudes Especiales',
        'booking.messagePlaceholder': 'Cuéntanos sobre tus necesidades especiales...',
        'booking.submit': 'Realizar Reserva'
    },
    en: {
        'nav.home': 'Home',
        'nav.rooms': 'Rooms',
        'nav.services': 'Services',
        'nav.restaurant': 'Restaurant',
        'nav.gallery': 'Gallery',
        'nav.location': 'Location',
        'nav.contact': 'Contact',
        'nav.bookNow': 'Book Now',
        'hero.title': 'Your perfect getaway starts here',
        'hero.subtitle': 'Comfortable rooms, excellent location and personalized service',
        'hero.viewRooms': 'View Rooms',
        'hero.bookButton': 'Book Now',
        'search.checkin': 'Check-in Date',
        'search.checkout': 'Check-out Date',
        'search.guests': 'Guests',
        'search.search': 'Search',
        'guest.1': '1 Guest',
        'guest.2': '2 Guests',
        'guest.3': '3 Guests',
        'guest.4': '4 Guests',
        'guest.5': '5+ Guests',
        'rooms.title': 'Our Rooms',
        'rooms.subtitle': 'Discover the comfort of our facilities',
        'services.title': 'Hotel Services',
        'why.title': 'Why Choose Us?',
        'restaurant.title': 'Our Restaurant',
        'restaurant.subtitle': 'Indulge in our exquisite culinary options',
        'gallery.title': 'Gallery',
        'gallery.subtitle': 'See the beauty of our hotel',
        'experiences.title': 'Special Experiences',
        'reviews.title': 'Guest Reviews',
        'location.title': 'Location',
        'faq.title': 'Frequently Asked Questions',
        'booking.title': 'Booking Form',
        'booking.roomType': 'Room Type',
        'booking.checkin': 'Check-in Date',
        'booking.checkout': 'Check-out Date',
        'booking.guests': 'Number of Guests',
        'booking.fullName': 'Full Name',
        'booking.email': 'Email',
        'booking.phone': 'Phone / WhatsApp',
        'booking.message': 'Message or Special Requests',
        'booking.messagePlaceholder': 'Tell us about your special needs...',
        'booking.submit': 'Book Now'
    }
};

let currentLanguage = 'es';

function initializeEventListeners() {
    const btnEspanol = document.getElementById('btnEspanol');
    const btnIngles = document.getElementById('btnIngles');

    if (btnEspanol) {
        btnEspanol.addEventListener('click', function() {
            setLanguage('es');
        });
    }

    if (btnIngles) {
        btnIngles.addEventListener('click', function() {
            setLanguage('en');
        });
    }
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateLanguageButtons();
    applyTranslations();
}

function loadLanguagePreference() {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) {
        currentLanguage = saved;
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        currentLanguage = browserLang.startsWith('es') ? 'es' : 'en';
    }
    updateLanguageButtons();
    applyTranslations();
}

function updateLanguageButtons() {
    const btnEspanol = document.getElementById('btnEspanol');
    const btnIngles = document.getElementById('btnIngles');

    if (btnEspanol && btnIngles) {
        btnEspanol.classList.toggle('active', currentLanguage === 'es');
        btnIngles.classList.toggle('active', currentLanguage === 'en');
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const value = translations[currentLanguage][key];
        if (value) {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-option]').forEach(option => {
        const key = option.dataset.i18nOption;
        const value = translations[currentLanguage][key];
        if (value) {
            option.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        const value = translations[currentLanguage][key];
        if (value) {
            element.placeholder = value;
        }
    });
}

function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navbar.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        hamburger.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                hamburger.click();
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (navbar) {
            navbar.classList.remove('active');
        }
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    });
}

function setupFormHandling() {
    const reservationForm = document.getElementById('formularioReserva');
    const contactForm = document.getElementById('contactForm');

    if (reservationForm) {
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleReservationSubmit(this);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleContactSubmit(this);
        });
    }

    const checkinInputs = document.querySelectorAll('input[type="date"][name="checkin"]');
    checkinInputs.forEach(input => {
        input.addEventListener('change', function() {
            const today = new Date().toISOString().split('T')[0];
            if (this.value < today) {
                alert(currentLanguage === 'es' ? 'La fecha debe ser futura' : 'The date must be in the future');
                this.value = '';
            }
        });
    });
}

function handleReservationSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.habitacion || !data.nombre || !data.email || !data.telefono || !data.checkin || !data.checkout) {
        alert(currentLanguage === 'es' ? 'Por favor completa todos los campos' : 'Please complete all fields');
        return;
    }

    const checkin = new Date(data.checkin);
    const checkout = new Date(data.checkout);
    if (checkout <= checkin) {
        alert(currentLanguage === 'es' ? 'La fecha de salida debe ser posterior a la de llegada' : 'Checkout date must be after check-in date');
        return;
    }

    console.log('Datos de reserva:', data);
    alert(currentLanguage === 'es'
        ? '¡Gracias! Tu reserva ha sido recibida. Nos pondremos en contacto pronto.'
        : 'Thank you! Your booking request has been received. We will contact you soon.');

    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.nombre || !data.email || !data.telefono || !data.mensaje) {
        alert(currentLanguage === 'es' ? 'Completa nombre, email, teléfono y mensaje.' : 'Please complete name, email, phone and message.');
        return;
    }

    console.log('Mensaje de contacto:', data);
    alert(currentLanguage === 'es'
        ? '¡Mensaje enviado! Te responderemos a la brevedad.'
        : 'Message sent! We will get back to you soon.');

    form.reset();
}

function setupQuickSearch() {
    const btnSearch = document.querySelector('.btn-search');
    if (!btnSearch) {
        return;
    }

    btnSearch.addEventListener('click', function() {
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const personas = document.getElementById('personas').value;

        if (!checkin || !checkout) {
            alert(currentLanguage === 'es' ? 'Por favor selecciona las fechas' : 'Please select dates');
            return;
        }

        const ci = new Date(checkin);
        const co = new Date(checkout);
        if (co <= ci) {
            alert(currentLanguage === 'es' ? 'Las fechas no son válidas' : 'Invalid dates');
            return;
        }

        document.getElementById('habitaciones').scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(function() {
            alert(currentLanguage === 'es'
                ? `Se encontraron habitaciones para ${personas} persona(s) del ${checkin} al ${checkout}`
                : `Found rooms for ${personas} guest(s) from ${checkin} to ${checkout}`);
        }, 500);
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
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

function setupHeaderShadow() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (!header) {
            return;
        }

        if (window.scrollY > 50) {
            header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadLanguagePreference();
    setupNavigation();
    setupFormHandling();
    setupQuickSearch();
    setupScrollAnimations();
    setupAnchorLinks();
    setupHeaderShadow();
});

console.log('Hotel Nacional David - Sitio web cargado correctamente');
