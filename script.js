
// Detecta el idioma desde la URL o el atributo lang del HTML.
const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
const pageLang = requestedLanguage || document.documentElement.lang || 'es';
const isEn = pageLang === 'en';

function loadCarouselSlide(slide) {
    if (!slide || !slide.dataset.src) return;
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

// â”€â”€ NavegaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Fechas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

    // Buscador rÃ¡pido del hero
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

// â”€â”€ Formularios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
            : 'Ingresa la numeraciÃ³n completa de la tarjeta usando entre 13 y 19 dÃ­gitos.');
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
        : 'Â¡Gracias! Tu reserva ha sido recibida. Nos pondremos en contacto pronto.');

    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.nombre || !data.email || !data.telefono || !data.mensaje) {
        alert(isEn
            ? 'Please complete name, email, phone and message.'
            : 'Completa nombre, email, telÃ©fono y mensaje.');
        return;
    }

    console.log('Mensaje de contacto:', data);
    alert(isEn
        ? 'Message sent! We will get back to you soon.'
        : 'Â¡Mensaje enviado! Te responderemos a la brevedad.');

    form.reset();
}

// â”€â”€ Buscador rÃ¡pido â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
            alert(isEn ? 'Invalid dates.' : 'Las fechas no son vÃ¡lidas.');
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
//carrusel de galeria
function setupGalleryCarousels() {
    const galleryConfig = {
        recepcion: [
            'assets/images/Galeria/Recepcion/lobby 1.png',
            'assets/images/Galeria/Recepcion/lobby 2.png',
            'assets/images/Galeria/Recepcion/recepcion.png'
        ],
        habitaciones: [
            'assets/images/Habitaciones/Habitacion Doble/PORTADA-HAB DOBLE.png',
            'assets/images/Habitaciones/Habitacion Doble/HAB (1). DOBLE.png',
            'assets/images/Habitaciones/Habitacion Doble/HAB (2). DOBLE.png',
            'assets/images/Habitaciones/Deluxe King/DELUXE KING (1).png',
            'assets/images/Habitaciones/Deluxe King/PORTADA-DELUXE KING SIZE (1).png',
            'assets/images/Habitaciones/Deluxe Doble/PORTADA-DELUXE DOBLE.png',
            'assets/images/Habitaciones/JR. Suite King/PORTADA- JR. KING SIZE.png',
            'assets/images/Habitaciones/JR. Suite King/JR. KING SIZE 1.png',
            'assets/images/Habitaciones/JR. Suite King/JR. KING SIZE 2.png',
            'assets/images/Habitaciones/JR. Suite Doble/PORTADA - JUNIOR SUITE DOBLE.png',
            'assets/images/Habitaciones/JR. Suite Doble/JUNIOR SUITE DOBLE (1).png',
            'assets/images/Habitaciones/Pool Side King/PORTADA - POOL SIDE .png',
            'assets/images/Habitaciones/Pool Side Doble/PORTADA - POOL SIDE DOBLE.png',
            'assets/images/Habitaciones/Pool Side Doble/TERRAZA POOL SIDE.png',
            'assets/images/Habitaciones/Pool Side Doble/POOL SIDE - TERRAZA.jpg',
            'assets/images/Habitaciones/Pool Side Doble/POOL SIDE - TERRAZA (1).jpg',
            'assets/images/Habitaciones/Master Suite/PORTADA - MASTER SUITE.jpg',
            'assets/images/Habitaciones/Master Suite/ENTRADA MASTER SUITE.png',
            'assets/images/Habitaciones/Master Suite/MASTER SUITE CAMA KING.png'
        ],
        restaurante: [
            'assets/images/Galeria/Restaurante/Bohio/restaurante_bohio.png',
            'assets/images/Galeria/Restaurante/Bohio/restaurante_bohio2.png',
            'assets/images/Galeria/Restaurante/Bohio/restaurante_bohio3.png',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano3.jpeg',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano4.png',
            'assets/images/Galeria/Restaurante/Italiano/portada_terraza_italiano.png',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano5.png',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano6.png'
        ],
        piscina: [
            'assets/images/Galeria/Piscina/piscina1.png',
            'assets/images/Galeria/Piscina/piscina2.png',
            'assets/images/Galeria/Piscina/piscina3.png',
            'assets/images/Galeria/Piscina/piscina4.png',
            'assets/images/Galeria/Piscina/piscina5.png',
        ],
        eventos: [
            'assets/images/Galeria/Eventos/eventos1.png',
            'assets/images/Galeria/Eventos/eventos2.png',
            'assets/images/Galeria/Eventos/eventos3.png',
            'assets/images/Galeria/Eventos/eventos4.png',
            'assets/images/Galeria/Eventos/eventos5.png',
            'assets/images/Galeria/Eventos/eventos6.png'
        ],
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
        carousel.setAttribute('aria-label', isEn ? `${key} photo gallery` : `GalerÃ­a de ${key}`);

        const track = document.createElement('div');
        track.className = 'room-carousel-track';

        const slides = images.map((path, index) => {
            const image = document.createElement('img');
            image.className = `room-carousel-slide${index === 0 ? ' is-active' : ''}`;
            const source = encodeURI(path);
            image.dataset.src = source;
            image.loading = 'lazy';
            image.alt = `${key} â€” ${index + 1}`;
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

        [['prev', '\u2039', -1], ['next', '\u203A', 1]].forEach(([direction, symbol, change]) => {
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
            'assets/images/Galeria/Restaurante/Bohio/restaurante_bohio.png',
            'assets/images/Galeria/Restaurante/Bohio/restaurante_bohio2.png',
            'assets/images/Galeria/Restaurante/Bohio/restaurante_bohio3.png'
        ],
        italiano: [
            'assets/images/Galeria/Restaurante/Italiano/portada_terraza_italiano.png',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano3.jpeg',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano4.png',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano5.png',
            'assets/images/Galeria/Restaurante/Italiano/restaurante_italiano6.png'
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
            image.alt = `${container.dataset.restaurante} restaurant â€” ${index + 1}`;
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

        [['prev', '\u2039', -1], ['next', '\u203A', 1]].forEach(([direction, symbol, change]) => {
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

// â”€â”€ Carrusel de RecepciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
        isEn ? 'Reception photo gallery' : 'GalerÃ­a de recepciÃ³n'
    );

    const track = document.createElement('div');
    track.className = 'room-carousel-track';

    const slides = receptionImages.map((path, index) => {

        const image = document.createElement('img');

        image.className =
            `room-carousel-slide${index === 0 ? ' is-active' : ''}`;

        image.src = encodeURI(base + path);

        image.alt = `lobby â€” ${index + 1}`;

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
        ['prev', '\u2039', -1],
        ['next', '\u203A', 1]
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

// â”€â”€ Carruseles de habitaciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function setupRoomCarousels() {
    const base = 'assets/images/Habitaciones/';
    const roomImages = {
        'HABITACION DOBLE': ['Habitacion Doble/PORTADA-HAB DOBLE.png', 'Habitacion Doble/HAB (1). DOBLE.png', 'Habitacion Doble/HAB (2). DOBLE.png'],
        'DOUBLE ROOM': ['Habitacion Doble/PORTADA-HAB DOBLE.png', 'Habitacion Doble/HAB (1). DOBLE.png', 'Habitacion Doble/HAB (2). DOBLE.png'],
        'DELUXE KING': ['Deluxe King/DELUXE KING (1).png', 'Deluxe King/PORTADA-DELUXE KING SIZE (1).png'],
        'DELUXE DOBLE': ['Deluxe Doble/PORTADA-DELUXE DOBLE.png'],
        'DELUXE DOUBLE': ['Deluxe Doble/PORTADA-DELUXE DOBLE.png'],
        'JR. SUITE KING': ['JR. Suite King/PORTADA- JR. KING SIZE.png', 'JR. Suite King/JR. KING SIZE 1.png', 'JR. Suite King/JR. KING SIZE 2.png'],
        'JR. SUITE DOBLE': ['JR. Suite Doble/PORTADA - JUNIOR SUITE DOBLE.png', 'JR. Suite Doble/JUNIOR SUITE DOBLE (1).png'],
        'JR. SUITE DOUBLE': ['JR. Suite Doble/PORTADA - JUNIOR SUITE DOBLE.png', 'JR. Suite Doble/JUNIOR SUITE DOBLE (1).png'],
        'POOL SIDE KING': ['Pool Side King/PORTADA - POOL SIDE .png'],
        'POOL SIDE DOBLE': ['Pool Side Doble/PORTADA - POOL SIDE DOBLE.png', 'Pool Side Doble/TERRAZA POOL SIDE.png', 'Pool Side Doble/POOL SIDE - TERRAZA.jpg', 'Pool Side Doble/POOL SIDE - TERRAZA (1).jpg'],
        'POOL SIDE DOUBLE': ['Pool Side Doble/PORTADA - POOL SIDE DOBLE.png', 'Pool Side Doble/TERRAZA POOL SIDE.png', 'Pool Side Doble/POOL SIDE - TERRAZA.jpg', 'Pool Side Doble/POOL SIDE - TERRAZA (1).jpg'],
        'MASTER SUITE': ['Master Suite/PORTADA - MASTER SUITE.jpg', 'Master Suite/ENTRADA MASTER SUITE.png', 'Master Suite/MASTER SUITE CAMA KING.png']
    };

    document.querySelectorAll('.habitacion-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.trim().toUpperCase();
        const normalizedTitle = title?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const images = roomImages[normalizedTitle];
        const container = card.querySelector('.habitacion-image');
        if (!images || !container) return;

        const badge = container.querySelector('.habitacion-badge');
        const carousel = document.createElement('div');
        carousel.className = 'room-carousel';
        carousel.setAttribute('aria-label', isEn ? `${title} photo gallery` : `GalerÃ­a de ${title}`);
        const track = document.createElement('div');
        track.className = 'room-carousel-track';
        const slides = images.map((path, index) => {
            const image = document.createElement('img');
            image.className = `room-carousel-slide${index === 0 ? ' is-active' : ''}`;
            const source = encodeURI(base + path);
            image.dataset.src = source;
            image.loading = 'lazy';
            image.alt = `${title} â€” ${index + 1}`;
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
        [['prev', '\u2039', -1], ['next', '\u203A', 1]].forEach(([direction, symbol, change]) => {
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

// â”€â”€ Animaciones de scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Anclas suaves â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Sombra del header al hacer scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function setupHeaderShadow() {
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (!header) return;
        header.style.boxShadow = window.scrollY > 50
            ? '0 6px 20px rgba(0, 0, 0, 0.15)'
            : '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
}

function setupImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = lightbox?.querySelector('.image-lightbox-content');
    const closeButton = lightbox?.querySelector('.image-lightbox-close');
    const previousButton = lightbox?.querySelector('.image-lightbox-prev');
    const nextButton = lightbox?.querySelector('.image-lightbox-next');
    if (!lightbox || !lightboxImage || !closeButton || !previousButton || !nextButton) return;

    let lightboxSlides = [];
    let lightboxIndex = 0;

    const showSlide = index => {
        if (!lightboxSlides.length) return;
        lightboxIndex = (index + lightboxSlides.length) % lightboxSlides.length;
        const image = lightboxSlides[lightboxIndex];
        loadCarouselSlide(image);
        lightboxImage.src = image.currentSrc || image.src || image.dataset.src;
        lightboxImage.alt = image.alt;
    };

    const close = () => {
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        lightboxSlides = [];
        lightboxIndex = 0;
        document.body.classList.remove('lightbox-open');
    };

    const open = image => {
        const carousel = image.closest('.room-carousel, .restaurante-carousel');
        lightboxSlides = carousel
            ? Array.from(carousel.querySelectorAll('.room-carousel-slide'))
            : [image];
        lightboxIndex = Math.max(0, lightboxSlides.indexOf(image));
        showSlide(lightboxIndex);
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
    };

    document.querySelectorAll('.galeria-image img, .habitacion-image img, .restaurante-carousel img').forEach(image => {
        image.addEventListener('click', event => {
            event.stopPropagation();
            open(image);
        });
    });

    document.addEventListener('click', event => {
        const image = event.target.closest?.('.galeria-image img, .habitacion-image img, .restaurante-carousel img');
        if (image) open(image);
    });

    closeButton.addEventListener('click', close);
    const navigate = (direction, event) => {
        event.stopPropagation();
        event.preventDefault();
        showSlide(lightboxIndex + direction);
    };
    previousButton.addEventListener('click', event => navigate(-1, event));
    nextButton.addEventListener('click', event => navigate(1, event));
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', event => {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') showSlide(lightboxIndex - 1);
        if (event.key === 'ArrowRight') showSlide(lightboxIndex + 1);
    });
}

// â”€â”€ InicializaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    setupImageLightbox();
});

console.log('Hotel Nacional David â€” Sitio web cargado correctamente');
