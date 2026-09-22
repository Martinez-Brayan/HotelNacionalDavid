
// Detecta el idioma desde la URL o el atributo lang del HTML.
const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
const pageLang = requestedLanguage || document.documentElement.lang || 'es';
const isEn = pageLang === 'en';

function loadCarouselSlide(slide) {
    if (!slide || slide.src || !slide.dataset.src) return;
    slide.src = slide.dataset.src;
    slide.removeAttribute('data-src');
}

function watchCarouselLoading(container, slides) {
    const loadInitialSlides = () => {
        loadCarouselSlide(slides[0]);
        loadCarouselSlide(slides[1]);
    };

    if (!('IntersectionObserver' in window)) {
        loadInitialSlides();
        return;
    }

    const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        loadInitialSlides();
        observer.disconnect();
    }, { rootMargin: '300px 0px' });
    observer.observe(container);
}

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

    setupCardNumberFormatting();
    setupExpiryYearOptions();
    setupDateInputs();
}

function setupExpiryYearOptions() {
    const expiryYearSelect = document.querySelector('select[name="anioVencimiento"]');
    if (!expiryYearSelect) return;

    const placeholder = expiryYearSelect.querySelector('option[value=""]');
    expiryYearSelect.replaceChildren(placeholder);

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 15; year += 1) {
        const option = document.createElement('option');
        option.value = String(year);
        option.textContent = String(year);
        expiryYearSelect.appendChild(option);
    }
}

function setupCardNumberFormatting() {
    const cardNumberInput = document.querySelector('input[name="numeroTarjeta"]');
    if (!cardNumberInput) return;

    cardNumberInput.addEventListener('input', function () {
        const digits = this.value.replace(/\D/g, '').slice(0, 19);
        this.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
}

function handleReservationSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.habitacion || !data.nombre || !data.email || !data.telefono || !data.checkin || !data.checkout || !data.tipoTarjeta || !data.numeroTarjeta || !data.mesVencimiento || !data.anioVencimiento) {
        alert(isEn
            ? 'Please complete all required fields, including the card information.'
            : 'Por favor completa todos los campos requeridos, incluyendo los datos de la tarjeta.');
        return;
    }

    const cardNumber = data.numeroTarjeta.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) {
        alert(isEn
            ? 'Enter the complete card number using 13 to 19 digits.'
            : 'Ingresa la numeración completa de la tarjeta usando entre 13 y 19 dígitos.');
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
// ── Carruseles de galería ───────────────────────────────────────────────────

function setupGalleryCarousels() {
    const galleryConfig = {
        recepcion: [
            'assets/images/Galeria/Recepcion/lobby 1.png',
            'assets/images/Galeria/Recepcion/lobby 2.png',
            'assets/images/Galeria/Recepcion/recepcion.png'
        ],
        habitaciones: [],
        restaurante: [
            'assets/images/Galeria/Restaurante/portada_bohio.png',
            'assets/images/Galeria/Restaurante/restaurante_bohio.png',
            'assets/images/Galeria/Restaurante/restaurante_bohio2.png',
            'assets/images/Galeria/Restaurante/italiano_exterior.png',
            'assets/images/Galeria/Restaurante/italiano_terraza.png',
            'assets/images/Galeria/Restaurante/restaurante_italiano1.png',
            'assets/images/Galeria/Restaurante/restaurante_italiano2.png',
            'assets/images/Galeria/Restaurante/restaurante_italiano3.jpeg'
        ],
        piscina: [
            'assets/images/Galeria/Piscina/piscina1.png',
            'assets/images/Galeria/Piscina/piscina2.png',
            'assets/images/Galeria/Piscina/piscina3.png',
            'assets/images/Galeria/Piscina/piscina4.png'
        ],
        jardines: [],
        eventos: [],
        gimnasio: [
            'assets/images/Galeria/Gimnasio/gimnasio1.png',
            'assets/images/Galeria/Gimnasio/gimnasio2.png',
            'assets/images/Galeria/Gimnasio/gimnasio3.png',
            'assets/images/Galeria/Gimnasio/gimnasio4.png'
        ]
    };

    document.querySelectorAll('.galeria-item').forEach(item => {
        const container = item.querySelector('.galeria-image');
        const caption = item.querySelector('.galeria-caption');
        const key = container?.dataset.galeria;
        const images = key ? (galleryConfig[key] || []) : [];

        if (!container) return;

        if (!images.length) {
            if (caption) caption.style.opacity = '0.8';
            return;
        }

        const carousel = document.createElement('div');
        carousel.className = 'room-carousel';
        carousel.setAttribute('aria-label', isEn ? `${key} photo gallery` : `Galería de ${key}`);

        const track = document.createElement('div');
        track.className = 'room-carousel-track';

        const slides = images.map((path, index) => {
            const image = document.createElement('img');
            image.className = `room-carousel-slide${index === 0 ? ' is-active' : ''}`;
            const source = encodeURI(path);
            image.dataset.src = source;
            image.loading = 'lazy';
            image.alt = `${key} — ${index + 1}`;
            track.appendChild(image);
            return image;
        });

        carousel.appendChild(track);
        container.replaceChildren(carousel);
        watchCarouselLoading(carousel, slides);

        if (slides.length <= 1) return;

        let current = 0;
        let autoAdvance;
        const dots = document.createElement('div');
        dots.className = 'room-carousel-dots';

        const show = index => {
            current = (index + slides.length) % slides.length;
            loadCarouselSlide(slides[current]);
            loadCarouselSlide(slides[(current + 1) % slides.length]);
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
            dots.querySelectorAll('button').forEach((dot, i) => dot.classList.toggle('is-active', i === current));
        };

        [['prev', '‹', -1], ['next', '›', 1]].forEach(([direction, symbol, change]) => {
            const button = document.createElement('button');
            button.className = `room-carousel-control room-carousel-${direction}`;
            button.type = 'button';
            button.setAttribute('aria-label', isEn ? `${direction} photo` : `Foto ${direction === 'prev' ? 'anterior' : 'siguiente'}`);
            button.textContent = symbol;
            button.addEventListener('click', event => {
                event.stopPropagation();
                show(current + change);
            });
            carousel.appendChild(button);
        });

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `room-carousel-dot${index === 0 ? ' is-active' : ''}`;
            dot.type = 'button';
            dot.setAttribute('aria-label', `${isEn ? 'Show photo' : 'Mostrar foto'} ${index + 1}`);
            dot.addEventListener('click', event => {
                event.stopPropagation();
                show(index);
            });
            dots.appendChild(dot);
        });

        carousel.appendChild(dots);

        const startAutoAdvance = () => {
            autoAdvance = window.setInterval(() => show(current + 1), 5000);
        };
        const stopAutoAdvance = () => window.clearInterval(autoAdvance);

        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);
        carousel.addEventListener('focusin', stopAutoAdvance);
        carousel.addEventListener('focusout', startAutoAdvance);

        startAutoAdvance();
    });
}

function setupRestaurantCarousels() {
    const restaurantImages = {
        bohio: [
            'assets/images/Galeria/Restaurante/portada_bohio.png',
            'assets/images/Galeria/Restaurante/restaurante_bohio.png',
            'assets/images/Galeria/Restaurante/restaurante_bohio2.png'
        ],
        italiano: [
            'assets/images/Galeria/Restaurante/italiano_exterior.png',
            'assets/images/Galeria/Restaurante/italiano_terraza.png',
            'assets/images/Galeria/Restaurante/restaurante_italiano1.png',
            'assets/images/Galeria/Restaurante/restaurante_italiano2.png',
            'assets/images/Galeria/Restaurante/restaurante_italiano3.jpeg',
            'assets/images/Galeria/Restaurante/restaurante_italiano4.png'
        ]
    };

    document.querySelectorAll('.restaurante-carousel').forEach(container => {
        const images = restaurantImages[container.dataset.restaurante] || [];
        if (!images.length) return;

        const track = document.createElement('div');
        track.className = 'room-carousel-track';
        const slides = images.map((path, index) => {
            const image = document.createElement('img');
            image.className = `room-carousel-slide${index === 0 ? ' is-active' : ''}`;
            const source = encodeURI(path);
            image.dataset.src = source;
            image.loading = 'lazy';
            image.alt = `${container.dataset.restaurante} restaurant — ${index + 1}`;
            track.appendChild(image);
            return image;
        });
        container.appendChild(track);
        watchCarouselLoading(container, slides);

        let current = 0;
        const show = index => {
            current = (index + slides.length) % slides.length;
            loadCarouselSlide(slides[current]);
            loadCarouselSlide(slides[(current + 1) % slides.length]);
            slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === current));
            container.querySelectorAll('.restaurante-dot').forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === current));
        };

        [['prev', '‹', -1], ['next', '›', 1]].forEach(([direction, symbol, change]) => {
            const button = document.createElement('button');
            button.className = `room-carousel-control room-carousel-${direction}`;
            button.type = 'button';
            button.setAttribute('aria-label', isEn ? `${direction} restaurant photo` : `Foto ${direction === 'prev' ? 'anterior' : 'siguiente'} del restaurante`);
            button.textContent = symbol;
            button.addEventListener('click', () => show(current + change));
            container.appendChild(button);
        });

        const dots = document.createElement('div');
        dots.className = 'room-carousel-dots';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `room-carousel-dot restaurante-dot${index === 0 ? ' is-active' : ''}`;
            dot.type = 'button';
            dot.setAttribute('aria-label', `${isEn ? 'Show restaurant photo' : 'Mostrar foto del restaurante'} ${index + 1}`);
            dot.addEventListener('click', () => show(index));
            dots.appendChild(dot);
        });
        container.appendChild(dots);
    });
}

// ── Carrusel de Recepción ──────────────────────────────────────────────

function setupReceptionCarousel() {

    const base = 'assets/images/Galeria/Recepcion/';

    const receptionImages = [
        'lobby 1.png',
        'lobby 2.png',
        'recepcion.png'
    ];

    const container = document.querySelector(
        '.galeria-image[data-galeria="recepcion"]'
    );

    if (!container || receptionImages.length === 0) return;

    const originalText = container.querySelector('span');

    const carousel = document.createElement('div');
    carousel.className = 'room-carousel';

    carousel.setAttribute(
        'aria-label',
        isEn ? 'Reception photo gallery' : 'Galería de recepción'
    );

    const track = document.createElement('div');
    track.className = 'room-carousel-track';

    const slides = receptionImages.map((path, index) => {

        const image = document.createElement('img');

        image.className =
            `room-carousel-slide${index === 0 ? ' is-active' : ''}`;

        image.src = encodeURI(base + path);

        image.alt = `lobby — ${index + 1}`;

        track.appendChild(image);

        return image;
    });

    carousel.appendChild(track);

    if (originalText) {
        carousel.appendChild(originalText);
    }

    container.replaceChildren(carousel);

    if (slides.length === 1) return;

    let current = 0;
    let autoAdvance;

    const dots = document.createElement('div');
    dots.className = 'room-carousel-dots';

    const show = index => {

        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle(
                'is-active',
                i === current
            );
        });

        dots.querySelectorAll('button').forEach((dot, i) => {
            dot.classList.toggle(
                'is-active',
                i === current
            );
        });
    };

    [
        ['prev', '‹', -1],
        ['next', '›', 1]
    ].forEach(([direction, symbol, change]) => {

        const button = document.createElement('button');

        button.className =
            `room-carousel-control room-carousel-${direction}`;

        button.type = 'button';

        button.setAttribute(
            'aria-label',
            isEn
                ? `${direction} photo`
                : `Foto ${direction === 'prev' ? 'anterior' : 'siguiente'}`
        );

        button.textContent = symbol;

        button.addEventListener('click', event => {
            event.stopPropagation();
            show(current + change);
        });

        carousel.appendChild(button);
    });

    slides.forEach((_, index) => {

        const dot = document.createElement('button');

        dot.className =
            `room-carousel-dot${index === 0 ? ' is-active' : ''}`;

        dot.type = 'button';

        dot.setAttribute(
            'aria-label',
            `${isEn ? 'Show photo' : 'Mostrar foto'} ${index + 1}`
        );

        dot.addEventListener('click', event => {
            event.stopPropagation();
            show(index);
        });

        dots.appendChild(dot);
    });

    carousel.appendChild(dots);

    const startAutoAdvance = () => {

        autoAdvance = window.setInterval(() => {
            show(current + 1);
        }, 5000);

    };

    const stopAutoAdvance = () => {
        window.clearInterval(autoAdvance);
    };

    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);

    carousel.addEventListener('focusin', stopAutoAdvance);
    carousel.addEventListener('focusout', startAutoAdvance);

    startAutoAdvance();
}

// ── Carruseles de habitaciones ──────────────────────────────────────────────

function setupRoomCarousels() {
    const base = 'assets/images/Habitaciones/';
    const roomImages = {
        'HABITACIÓN DOBLE': ['Habitacion Doble/PORTADA-HAB DOBLE.png', 'Habitacion Doble/PORTADA-HABITACIÓN DOBLE_.png', 'Habitacion Doble/hab.doble.png', 'Habitacion Doble/habitacion_doble2.png'],
        'DOUBLE ROOM': ['Habitacion Doble/PORTADA-HAB DOBLE.png', 'Habitacion Doble/PORTADA-HABITACIÓN DOBLE_.png', 'Habitacion Doble/hab.doble.png', 'Habitacion Doble/habitacion_doble2.png'],
        'DELUXE KING': ['Deluxe King/DELUXE KING.png', 'Deluxe King/portada_DKing.png'],
        'DELUXE DOBLE': ['Deluxe Doble/PORTADA-DELUXE DOBLE.png'],
        'DELUXE DOUBLE': ['Deluxe Doble/PORTADA-DELUXE DOBLE.png'],
        'JR. SUITE KING': ['JR. Suite King/PORTADA- JR. KING SIZE.png', 'JR. Suite King/JR. KING SIZE 1.png', 'JR. Suite King/JR. KING SIZE 2.png'],
        'JR. SUITE DOBLE': ['JR. Suite Doble/PORTADA - JUNIOR SUITE DOBLE.png', 'JR. Suite Doble/Junior_Suite_Doble.png'],
        'JR. SUITE DOUBLE': ['JR. Suite Doble/PORTADA - JUNIOR SUITE DOBLE.png', 'JR. Suite Doble/Junior_Suite_Doble.png'],
        'POOL SIDE KING': ['Pool Side King/PORTADA - POOL SIDE_.png', 'Pool Side King/POOL SIDE - TERRAZA.jpg'],
        'POOL SIDE DOBLE': ['Pool Side Doble/PORTADA - POOL SIDE DOBLE.png', 'Pool Side Doble/TERRAZA POOL SIDE.png'],
        'POOL SIDE DOUBLE': ['Pool Side Doble/PORTADA - POOL SIDE DOBLE.png', 'Pool Side Doble/TERRAZA POOL SIDE.png'],
        'MASTER SUITE': ['Master Suite/PORTADA - MASTER SUITE.jpg', 'Master Suite/ENTRADA MASTER SUITE.png', 'Master Suite/MASTER SUITE CAMA KING.png']
    };

    document.querySelectorAll('.habitacion-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.trim().toUpperCase();
        const images = roomImages[title];
        const container = card.querySelector('.habitacion-image');
        if (!images || !container) return;

        const badge = container.querySelector('.habitacion-badge');
        const carousel = document.createElement('div');
        carousel.className = 'room-carousel';
        carousel.setAttribute('aria-label', isEn ? `${title} photo gallery` : `Galería de ${title}`);
        const track = document.createElement('div');
        track.className = 'room-carousel-track';
        const slides = images.map((path, index) => {
            const image = document.createElement('img');
            image.className = `room-carousel-slide${index === 0 ? ' is-active' : ''}`;
            const source = encodeURI(base + path);
            image.dataset.src = source;
            image.loading = 'lazy';
            image.alt = `${title} — ${index + 1}`;
            track.appendChild(image);
            return image;
        });
        carousel.appendChild(track);
        container.replaceChildren(carousel, badge);
        watchCarouselLoading(carousel, slides);

        if (slides.length === 1) return;
        let current = 0;
        let autoAdvance;
        const dots = document.createElement('div');
        dots.className = 'room-carousel-dots';
        const show = index => {
            current = (index + slides.length) % slides.length;
            loadCarouselSlide(slides[current]);
            loadCarouselSlide(slides[(current + 1) % slides.length]);
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
            dots.querySelectorAll('button').forEach((dot, i) => dot.classList.toggle('is-active', i === current));
        };
        [['prev', '‹', -1], ['next', '›', 1]].forEach(([direction, symbol, change]) => {
            const button = document.createElement('button');
            button.className = `room-carousel-control room-carousel-${direction}`;
            button.type = 'button';
            button.setAttribute('aria-label', isEn ? `${direction} photo` : `Foto ${direction === 'prev' ? 'anterior' : 'siguiente'}`);
            button.textContent = symbol;
            button.addEventListener('click', event => { event.stopPropagation(); show(current + change); });
            carousel.appendChild(button);
        });
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `room-carousel-dot${index === 0 ? ' is-active' : ''}`;
            dot.type = 'button';
            dot.setAttribute('aria-label', `${isEn ? 'Show photo' : 'Mostrar foto'} ${index + 1}`);
            dot.addEventListener('click', event => { event.stopPropagation(); show(index); });
            dots.appendChild(dot);
        });
        carousel.appendChild(dots);

        const startAutoAdvance = () => {
            autoAdvance = window.setInterval(() => show(current + 1), 5000);
        };
        const stopAutoAdvance = () => window.clearInterval(autoAdvance);
        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);
        carousel.addEventListener('focusin', stopAutoAdvance);
        carousel.addEventListener('focusout', startAutoAdvance);
        startAutoAdvance();
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
    setupRoomCarousels();
    setupGalleryCarousels();
    setupRestaurantCarousels();
    setupScrollAnimations();
    setupAnchorLinks();
    setupHeaderShadow();
});

console.log('Hotel Nacional David — Sitio web cargado correctamente');
