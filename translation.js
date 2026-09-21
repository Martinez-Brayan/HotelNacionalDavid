const translations = {
    es: {
        navigation: {
            home: 'Inicio',
            rooms: 'Habitaciones',
            services: 'Servicios',
            restaurant: 'Restaurante',
            gallery: 'Galería',
            location: 'Ubicación',
            contact: 'Contacto',
            bookNow: 'Reservar Ahora'
        },
        hero: {
            title: 'Donde el descanso de tus sueños se hace realidad',
            subtitle: 'Habitaciones cómodas, excelente ubicación y atención personalizada',
            viewRooms: 'Ver Habitaciones',
            bookNow: 'Reservar Ahora'
        },
        rooms: {
            title: 'Nuestras Habitaciones',
            subtitle: 'Descubre el confort de nuestras instalaciones',
            double: 'Habitación Doble',
            deluxeKing: 'Deluxe King',
            deluxeDouble: 'Deluxe Doble',
            juniorSuiteKing: 'Jr. Suite King',
            juniorSuiteDouble: 'Jr. Suite Doble',
            poolSideKing: 'Pool Side King',
            poolSideDouble: 'Pool Side Doble',
            masterSuite: 'Master Suite'
        },
        gallery: {
            title: 'Galería',
            subtitle: 'Conoce nuestras instalaciones'
        },
        reservation: {
            title: 'Formulario de Reserva',
            room: 'Tipo de Habitación',
            selectRoom: 'Selecciona una habitación',
            checkin: 'Fecha de Llegada',
            checkout: 'Fecha de Salida',
            guests: 'Número de Personas',
            fullName: 'Nombre Completo',
            email: 'Email',
            phone: 'Teléfono / WhatsApp',
            cardType: 'Tipo de Tarjeta',
            selectCard: 'Selecciona Visa o Mastercard',
            cardNumber: 'Número completo de la tarjeta',
            cardNumberPlaceholder: '1234 5678 9012 3456',
            expiryMonth: 'Mes de vencimiento',
            selectMonth: 'Mes',
            expiryYear: 'Año de vencimiento',
            selectYear: 'Año',
            message: 'Mensaje o Solicitudes Especiales',
            messagePlaceholder: 'Cuéntanos sobre tus necesidades especiales...',
            submit: 'Realizar Reserva'
        },
        contact: {
            title: 'Contacto',
            phone: 'Teléfono',
            email: 'Email',
            whatsapp: 'WhatsApp',
            location: 'Ubicación',
            sendMessage: 'Enviar mensaje'
        },
        validation: {
            required: 'Por favor completa todos los campos requeridos.',
            dates: 'Por favor selecciona las fechas.',
            invalidDates: 'Las fechas no son válidas.',
            checkoutAfterCheckin: 'La fecha de salida debe ser posterior a la de llegada.',
            reservationSuccess: '¡Gracias! Tu reserva ha sido recibida. Nos pondremos en contacto pronto.',
            contactSuccess: '¡Mensaje enviado! Te responderemos a la brevedad.'
        }
    },
    en: {
        navigation: {
            home: 'Home',
            rooms: 'Rooms',
            services: 'Services',
            restaurant: 'Restaurant',
            gallery: 'Gallery',
            location: 'Location',
            contact: 'Contact',
            bookNow: 'Book Now'
        },
        hero: {
            title: 'Where your dream rest becomes reality',
            subtitle: 'Comfortable rooms, excellent location and personalized service',
            viewRooms: 'View Rooms',
            bookNow: 'Book Now'
        },
        rooms: {
            title: 'Our Rooms',
            subtitle: 'Discover the comfort of our facilities',
            double: 'Double Room',
            deluxeKing: 'Deluxe King',
            deluxeDouble: 'Deluxe Double',
            juniorSuiteKing: 'Junior Suite King',
            juniorSuiteDouble: 'Junior Suite Double',
            poolSideKing: 'Pool Side King',
            poolSideDouble: 'Pool Side Double',
            masterSuite: 'Master Suite'
        },
        gallery: {
            title: 'Gallery',
            subtitle: 'Discover our facilities'
        },
        reservation: {
            title: 'Booking Form',
            room: 'Room Type',
            selectRoom: 'Select a room',
            checkin: 'Check-in Date',
            checkout: 'Check-out Date',
            guests: 'Number of Guests',
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone / WhatsApp',
            cardType: 'Card Type',
            selectCard: 'Select Visa or Mastercard',
            cardNumber: 'Full card number',
            cardNumberPlaceholder: '1234 5678 9012 3456',
            expiryMonth: 'Expiration month',
            selectMonth: 'Month',
            expiryYear: 'Expiration year',
            selectYear: 'Year',
            message: 'Message or Special Requests',
            messagePlaceholder: 'Tell us about your special needs...',
            submit: 'Make Reservation'
        },
        contact: {
            title: 'Contact',
            phone: 'Phone',
            email: 'Email',
            whatsapp: 'WhatsApp',
            location: 'Location',
            sendMessage: 'Send message'
        },
        validation: {
            required: 'Please complete all required fields.',
            dates: 'Please select the dates.',
            invalidDates: 'The dates are not valid.',
            checkoutAfterCheckin: 'Check-out date must be after check-in date.',
            reservationSuccess: 'Thank you! Your booking request has been received. We will contact you soon.',
            contactSuccess: 'Message sent! We will get back to you soon.'
        }
    }
};

function getCurrentLanguage() {
    const language = document.documentElement.lang || 'es';
    return translations[language] ? language : 'es';
}

function getTranslation(path, language = getCurrentLanguage()) {
    return path.split('.').reduce((value, key) => value?.[key], translations[language]) || path;
}

function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = getTranslation(element.dataset.i18n);
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        element.setAttribute('placeholder', getTranslation(element.dataset.i18nPlaceholder));
    });

    root.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        element.setAttribute('aria-label', getTranslation(element.dataset.i18nAriaLabel));
    });
}

const pageTranslations = {
    en: {
        ribbon: '100% of our electricity consumption is produced with renewable energy (solar panels).',
        imageAlt: {
            logo: 'Hotel Nacional David Logo',
            hero: 'View of Hotel Nacional David'
        },
        metadata: {
            title: 'Hotel Nacional David - Online Booking',
            description: 'Hotel Nacional David — Located in the heart of David, Chiriquí. Comfortable rooms, restaurant, pool and personalized service. Book now.',
            logoLabel: 'Hotel logo',
            menuLabel: 'Open menu',
            whatsappLabel: 'Contact via WhatsApp'
        },
        rooms: [
            {
                badge: 'Double',
                title: 'DOUBLE ROOM',
                description: 'Comfortable and functional, with a maximum capacity of up to 2 guests. Ideal for a practical and comfortable stay.',
                guests: 'Up to 2 guests',
                features: ['Double beds · Air conditioning · TV · Free WiFi', 'Private bathroom · Toiletries · Towels · Bottled water', 'Breakfast included'],
                price: 'From: <strong>$95.00 + 10%.</strong> (1–2 guests)'
            },
            {
                badge: 'King',
                title: 'DELUXE KING',
                description: 'Comfortable, equipped with one King bed, and with a maximum capacity of 2 guests. Ideal for a quiet and pleasant stay.',
                guests: 'Up to 2 guests',
                features: ['1 King bed · Air conditioning · TV · Free WiFi', 'Private bathroom · Toiletries · Safe', 'Safe', 'Breakfast included'],
                price: 'From: <strong>$95.00 + 10%.</strong> (1–2 guests)'
            },
            {
                badge: 'Double',
                title: 'DELUXE DOUBLE',
                description: 'Comfortable and modern, with two double beds and capacity for up to 4 adults and children. Ideal for a quiet and comfortable stay.',
                guests: 'Up to 4 guests',
                features: ['Double beds · Air conditioning · TV · Free WiFi', 'Private bathroom · Toiletries · Towels · Bottled water', 'Breakfast included'],
                price: 'From: <strong>$95.00 + 10%.</strong> (1–2 guests)<br><strong>$25.00 + 10%.</strong> (additional guest)'
            },
            {
                badge: 'King Suite',
                title: 'JR. SUITE KING',
                description: 'Spacious and comfortable, with a King bed and a small sitting area perfect for resting, relaxing, or working comfortably. Maximum capacity: 2 guests.',
                guests: 'Up to 2 guests',
                features: ['1 King bed · Air conditioning · TV · Free WiFi', 'Private bathroom · Toiletries · Towels · Bottled water', 'Safe', 'Breakfast included'],
                price: 'From: <strong>$135.00 + 10%.</strong> (1–2 guests)'
            },
            {
                badge: 'Double Suite',
                title: 'JR. SUITE DOUBLE',
                description: 'Spacious and comfortable, with two double beds and a welcoming space ideal for resting and enjoying a pleasant stay. Maximum capacity: 4 guests.',
                guests: 'Up to 4 guests',
                features: ['Double beds · Sofa bed · Air conditioning · TV · Free WiFi', 'Private bathroom · Toiletries · Towels · Bottled water', 'Breakfast included'],
                price: 'From: <strong>$135.00 + 10%.</strong> (1–3 guests)<br><strong>$25.00 + 10%.</strong> (additional guest)'
            },
            {
                badge: 'Pool Side King',
                title: 'POOL SIDE KING',
                description: 'Comfortable and welcoming, with a King bed and a private terrace facing the pool, ideal for relaxing and enjoying the surroundings. Maximum capacity: 2 guests.',
                guests: 'Up to 2 guests',
                features: ['King beds · Private terrace · Pool access/view', 'Air conditioning · Free WiFi · TV · Private bathroom', 'Toiletries · Towels · Bottled water', 'Safe', 'Breakfast included'],
                price: 'From: <strong>$150.00 + 10%.</strong> (1–2 guests)'
            },
            {
                badge: 'Pool Side Double',
                title: 'POOL SIDE DOUBLE',
                description: 'Comfortable and welcoming, with two double beds and a terrace facing the pool, ideal for relaxing and enjoying the surroundings. Maximum capacity: 4 guests.',
                guests: 'Up to 4 guests',
                features: ['Double beds · Private terrace · Pool access/view', 'Air conditioning · Free WiFi · TV · Private bathroom', 'Toiletries · Safe', 'Safe', 'Breakfast included'],
                price: 'Rate: <strong>$150.00 + 10%.</strong> (1–2 guests)<br><strong>$25.00 + 10%.</strong> (additional guest)'
            },
            {
                badge: 'Master Suite',
                title: 'MASTER SUITE',
                description: 'Ideal for families, located on the third floor with stair access. It has two independent bedrooms, separated by a door, each with a King bed, TV, air conditioning, and private bathroom. Capacity for up to 5 guests.',
                guests: 'Up to 5 guests',
                features: ['2 independent bedrooms with King bed · Sofa bed', 'Air conditioning · Free WiFi · TV · Private bathroom', 'Toiletries · Towels · Bottled water · Refrigerator', 'Breakfast included'],
                price: 'From: <strong>$200.00 + 10%.</strong> (1–5 guests)'
            }
        ],
        services: [
            ['Swimming Pool', 'Refresh your days and relax surrounded by gardens.'],
            ['Restaurant', 'A culinary offering to enjoy on every occasion.'],
            ['Bar', 'Exclusive cocktails and a wide selection of drinks.'],
            ['Gym', 'Everything you need to stay active during your stay.'],
            ['Event Hall', 'Versatile space for conferences and celebrations.'],
            ['Transportation', 'Airport shuttle service: Airport → Hotel → Airport.'],
            ['Parking', 'Spacious outdoor parking available at no charge.']
        ],
        servicesTitle: 'Hotel Services',
        whyTitle: 'Why Choose Us?',
        features: [
            ['Excellent Location', 'In downtown David, near shops and restaurants.'],
            ['Free WiFi', 'High-speed connection throughout the hotel.'],
            ['Parking', 'Spacious outdoor parking available at no charge.'],
            ['Breakfast Included', 'Start your day with a delicious selection.'],
            ['24-Hour Service', 'Front desk and service available 24 hours a day.'],
            ['Rooms for Every Stay', 'Comfortable spaces designed for families and business guests.']
        ],
        restaurant: {
            title: 'Our Restaurant',
            subtitle: 'Indulge in our exquisite culinary options',
            heading: 'Gastronomic Experience',
            imageAlt: 'Bohío Barbecue Restaurant',
            venues: [
                {
                    name: 'Bohío Barbecue Restaurant',
                    description: 'Enjoy a relaxed experience with grilled flavors and a welcoming atmosphere.',
                    hours: 'Hours: 4:30 PM to 10:00 PM',
                    galleryLabel: 'Bohío Barbecue Restaurant gallery'
                },
                {
                    name: 'Italian Restaurant / Pizzeria',
                    description: 'An Italian offering with pizzas and dishes prepared to enjoy with family or friends.',
                    hours: 'Hours: 11:00 AM to 10:00 PM',
                    galleryLabel: 'Italian Restaurant and Pizzeria gallery'
                }
            ],
            description: 'Our restaurant offers a varied selection of dishes combining the best international cuisine with the typical flavors of the region.',
            schedule: ['Breakfast at the cafeteria from 6:30 AM to 10:30 AM', 'Buffet lunch from 12:00 PM to 2:30 PM', 'Italian pizzeria restaurant from 11:00 AM to 10:00 PM', 'Bohío Barbecue Restaurant from 4:30 PM to 10:00 PM.']
        },
        gallery: {
            title: 'Gallery',
            subtitle: 'See the beauty of our hotel',
            captions: ['Rooms', 'Reception', 'Restaurant', 'Pool', 'Gardens', 'Events', 'Gym']
        },
        reviews: {
            title: 'Guest Reviews',
            entries: [
                ['"Excellent hotel, very clean and the staff is very attentive. I will be back soon."', 'Verified Traveler'],
                ['"The location is perfect and the breakfast buffet is amazing. 100% recommended."', 'Verified Traveler'],
                ['"We had a wonderful honeymoon. The staff made everything special for us."', 'Newlyweds']
            ]
        },
        location: {
            title: 'Location',
            map: 'Integrated map',
            heading: 'How to get here and nearby places',
            address: 'Address',
            addressText: 'Av. Central & C. Central, David, Chiriquí Province, Panama',
            directions: 'How to get here',
            directionsText: 'Located in the city center, just a few minutes from the airport with easy access from David\'s main road.',
            nearby: 'Nearby places',
            nearbyItems: ['Airport: 10–15 minutes by car', 'Restaurants: a wide variety in the city center and surroundings', 'Shopping centers: 5 minutes from the hotel', 'Beaches and attractions: an ideal location for reaching beaches, attractions and tourist destinations in the region.'],
            contact: 'Contact'
        },
        faq: [
            ['What time is check-in?', 'Check-in is from 2:00 PM. If you arrive earlier, contact reception about early check-in availability.'],
            ['Are pets allowed?', 'Pets are not allowed.'],
            ['Is there parking?', 'Yes, we have complimentary outdoor parking.'],
            ['Is breakfast included?', 'Yes, breakfast is included.'],
            ['Can I cancel my reservation?', 'We accept cancellations up to 48 hours before arrival without penalty.'],
            ['Is WiFi available?', 'Yes, high-speed WiFi is available free of charge throughout the hotel.']
        ],
        contact: {
            title: 'Contact',
            cards: ['Phone', 'Email', 'WhatsApp', 'Location'],
            locationText: 'Av. Central, Central Street, David, Chiriquí, Panama',
            form: ['Name', 'Email', 'Phone / WhatsApp', 'Subject', 'Message', 'Inquiry, booking, etc.', 'Send message']
        },
        footer: {
            description: 'Your best choice for a stay in David, Chiriquí.',
            quickLinks: 'Quick Links',
            quickLinkItems: ['Home', 'Rooms', 'Services', 'Contact'],
            legal: 'Legal',
            privacy: 'Privacy Policy',
            terms: 'Terms and Conditions',
            hours: 'Hours',
            reception: 'Reception: 24/7',
            restaurant: 'Restaurant: 7:00 AM - 10:00 PM',
            checkin: 'Check-in: 2:00 PM',
            follow: 'Follow Us',
            rights: '© 2026 All rights reserved.',
            floatingBook: 'Book'
        }
    }
};

function setIconText(element, text) {
    const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
    if (textNodes.length) {
        textNodes[textNodes.length - 1].textContent = ` ${text}`;
    } else {
        element.textContent = text;
    }
}

function applyPageTranslations(language) {
    const content = pageTranslations[language];
    if (!content) return;

    const setText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    setText('.cintillo .texto', content.ribbon);
    document.title = content.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.metadata.description);
    document.querySelector('.brand-lockup')?.setAttribute('aria-label', content.metadata.logoLabel);
    document.querySelector('.hamburger')?.setAttribute('aria-label', content.metadata.menuLabel);
    document.querySelector('.whatsapp-float')?.setAttribute('title', content.metadata.whatsappLabel);
    document.querySelector('.logo img')?.setAttribute('alt', content.imageAlt.logo);
    document.querySelector('.hero-image img')?.setAttribute('alt', content.imageAlt.hero);
    setText('#servicios .section-title', content.servicesTitle);
    setText('.por-que .section-title', content.whyTitle);

    document.querySelectorAll('.habitacion-card').forEach((card, index) => {
        const room = content.rooms[index];
        if (!room) return;
        card.querySelector('.habitacion-badge').textContent = room.badge;
        card.querySelector('h3').textContent = room.title;
        card.querySelector('.habitacion-descripcion').textContent = room.description;
        const guestText = card.querySelector('.habitacion-info p');
        if (guestText) setIconText(guestText, room.guests);
        card.querySelectorAll('.servicios-habitacion li').forEach((feature, featureIndex) => {
            if (room.features[featureIndex]) setIconText(feature, room.features[featureIndex]);
        });
        const price = card.querySelector('.precio');
        if (price) price.innerHTML = room.price;
        card.querySelectorAll('a.btn-primary').forEach(button => { button.textContent = content.footer.floatingBook === 'Book' ? 'Book' : 'Reservar'; });
    });

    document.querySelectorAll('.servicio-card').forEach((card, index) => {
        if (!content.services[index]) return;
        card.querySelector('h3').textContent = content.services[index][0];
        card.querySelector('p').textContent = content.services[index][1];
    });
    document.querySelectorAll('.caracteristica').forEach((card, index) => {
        if (!content.features[index]) return;
        card.querySelector('h4').textContent = content.features[index][0];
        card.querySelector('p').textContent = content.features[index][1];
    });

    setText('#restaurante .section-title', content.restaurant.title);
    setText('#restaurante .section-subtitle', content.restaurant.subtitle);
    setText('#restaurante h3', content.restaurant.heading);
    setText('#restaurante .restaurante-info > p', content.restaurant.description);
    document.querySelectorAll('#restaurante .restaurante-list li').forEach((item, index) => {
        if (content.restaurant.schedule[index]) setIconText(item, content.restaurant.schedule[index]);
    });
    document.querySelectorAll('.restaurante-bloque').forEach((block, index) => {
        const venue = content.restaurant.venues[index];
        if (!venue) return;
        block.querySelector('.restaurante-bloque-info h3').textContent = venue.name;
        block.querySelector('.restaurante-bloque-info p').textContent = venue.description;
        const hours = block.querySelector('.restaurante-horario');
        if (hours) hours.textContent = venue.hours;
        const carousel = block.querySelector('.restaurante-carousel');
        if (carousel) carousel.setAttribute('aria-label', venue.galleryLabel);
    });

    const roomOptions = document.querySelectorAll('select[name="habitacion"] option');
    content.rooms.forEach((room, index) => {
        if (roomOptions[index + 1]) roomOptions[index + 1].textContent = `${room.title} - ${room.price.replace(/<strong>|<\/strong>|<br>/g, '').replace(/From:|Rate:/, '').trim()}`;
    });

    setText('#galeria .section-title', content.gallery.title);
    setText('#galeria .section-subtitle', content.gallery.subtitle);
    document.querySelectorAll('.galeria-caption').forEach((caption, index) => {
        if (content.gallery.captions[index]) caption.textContent = content.gallery.captions[index];
    });

    setText('.opiniones .section-title', content.reviews.title);
    document.querySelectorAll('.opinion-card').forEach((card, index) => {
        const review = content.reviews.entries[index];
        if (!review) return;
        card.querySelector('p').textContent = review[0];
        card.querySelector('span').textContent = review[1];
    });

    setText('#ubicacion .section-title', content.location.title);
    setText('#ubicacion .mapa-container h3', content.location.map);
    const locationInfo = document.querySelector('.ubicacion-info');
    if (locationInfo) {
        const headings = locationInfo.querySelectorAll('.info-item h4');
        [content.location.address, content.location.directions, content.location.nearby, content.location.contact].forEach((text, index) => setIconText(headings[index], text));
        const paragraphs = locationInfo.querySelectorAll('.info-item p');
        if (paragraphs[0]) paragraphs[0].textContent = content.location.addressText;
        if (paragraphs[1]) paragraphs[1].textContent = content.location.directionsText;
        locationInfo.querySelectorAll('.info-item ul li').forEach((item, index) => {
            const parts = content.location.nearbyItems[index]?.split(': ');
            if (parts) item.innerHTML = `<strong>${parts[0]}:</strong> ${parts.slice(1).join(': ')}`;
        });
    }

    setText('.faq .section-title', 'Frequently Asked Questions');
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        if (!content.faq[index]) return;
        item.querySelector('h4').textContent = content.faq[index][0];
        item.querySelector('p').textContent = content.faq[index][1];
    });

    setText('#contacto .section-title', content.contact.title);
    document.querySelectorAll('.contacto-card h4').forEach((heading, index) => { heading.textContent = content.contact.cards[index]; });
    document.querySelector('.contacto-card:last-of-type p').textContent = content.contact.locationText;
    const contactLabels = document.querySelectorAll('#contactForm label');
    const contactInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    [0, 1, 2, 3].forEach((index) => { if (contactLabels[index]) contactLabels[index].textContent = content.contact.form[index]; });
    if (contactLabels[4]) contactLabels[4].textContent = content.contact.form[4];
    if (contactInputs[3]) contactInputs[3].setAttribute('placeholder', content.contact.form[5]);
    const contactSubmit = document.querySelector('#contactForm button');
    if (contactSubmit) contactSubmit.textContent = content.contact.form[6];

    const footerSections = document.querySelectorAll('.footer-section');
    if (footerSections[0]) footerSections[0].querySelector('p').textContent = content.footer.description;
    if (footerSections[1]) footerSections[1].querySelector('h4').textContent = content.footer.quickLinks;
    if (footerSections[1]) {
        footerSections[1].querySelectorAll('a').forEach((link, index) => {
            if (content.footer.quickLinkItems[index]) link.textContent = content.footer.quickLinkItems[index];
        });
    }
    if (footerSections[2]) {
        footerSections[2].querySelector('h4').textContent = content.footer.legal;
        const legalLinks = footerSections[2].querySelectorAll('a');
        legalLinks[0].textContent = content.footer.privacy;
        legalLinks[1].textContent = content.footer.terms;
    }
    if (footerSections[3]) {
        footerSections[3].querySelector('h4').textContent = content.footer.hours;
        const hours = footerSections[3].querySelectorAll('li');
        [content.footer.reception, content.footer.restaurant, content.footer.checkin].forEach((text, index) => { hours[index].textContent = text; });
    }
    if (footerSections[4]) footerSections[4].querySelector('h4').textContent = content.footer.follow;
    setText('.floating-book', content.footer.floatingBook);
    setText('.footer-bottom p', content.footer.rights);
}

function initializeTranslations() {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    const language = translations[requestedLanguage] ? requestedLanguage : getCurrentLanguage();

    document.documentElement.lang = language;
    applyTranslations();
    applyPageTranslations(language);

    document.querySelectorAll('.language-selector .lang-btn').forEach(link => {
        const linkLanguage = new URL(link.href, window.location.href).searchParams.get('lang') || 'es';
        const isActive = linkLanguage === language;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

window.hotelTranslations = translations;
window.getTranslation = getTranslation;
window.applyTranslations = applyTranslations;

document.addEventListener('DOMContentLoaded', initializeTranslations);
