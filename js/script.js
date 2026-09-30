// =========================================
// FOTOS DEL ÁLBUM (carpeta Img/)
// Para agregar una foto: ponla en su carpeta y añade una línea aquí.
// =========================================
const galleryData = {
    familia: [
        { url: "Img/familia/foto1.jpg", caption: "Con mis padres y hermanos" },
        { url: "Img/familia/foto2.jpg", caption: "Abrazos de familia" },
        { url: "Img/familia/foto3.jpg", caption: "Momentos especiales con mamá" },
        { url: "Img/familia/foto4.jpg", caption: "Con papá en la celebración" },
        { url: "Img/familia/foto5.jpg", caption: "Sonrisas compartidas" }
    ],
    amigos: [
        { url: "Img/amigos/foto1.jpg", caption: "Mis mejores amigos" },
        { url: "Img/amigos/foto2.png", caption: "Fiesta y diversión" },
        { url: "Img/amigos/foto3.jpg", caption: "Risas inolvidables" }
    ],
    sesion: [
        { url: "Img/mi secion/foto1.jpg", caption: "Sesión editorial de moda" },
        { url: "Img/mi secion/foto2.jpg", caption: "Elegancia y luz natural" },
        { url: "Img/mi secion/foto3.jpg", caption: "Retrato de quinceañera" },
        { url: "Img/mi secion/foto4.jpg", caption: "Magia en cada detalle" },
        { url: "Img/mi secion/foto5.jpg", caption: "Estilo y sofisticación" }
    ],
    vals: [
        { url: "Img/el vals/foto1.jpg", caption: "Un momento para recordar.", quote: "Un momento para recordar." },
        { url: "Img/el vals/foto2.jpg", caption: "El vals con papá.", quote: "El abrazo más cálido y seguro del mundo." }
    ],
    celebracion: {
        // Aún no hay carpeta de "entrada". Mientras esté vacía, su pestaña se oculta sola.
        // Si creas Img/celebracion/entrada/, agrega aquí sus fotos.
        entrada: [],
        decoracion: [
            { url: "Img/celebracion/decoracion/foto1.jpg", caption: "Arreglos florales y luces" },
            { url: "Img/celebracion/decoracion/foto2.jpg", caption: "Mesas principales y detalles" },
            { url: "Img/celebracion/decoracion/foto3.jpg", caption: "Ambiente romántico nocturno" }
        ],
        baile: [
            { url: "Img/celebracion/baile/foto1.jpg", caption: "Fiesta y música" },
            { url: "Img/celebracion/baile/foto2.jpg", caption: "Todos en la pista de baile" },
            { url: "Img/celebracion/baile/foto3.jpg", caption: "Energía al máximo" }
        ],
        pastel: [
            { url: "Img/celebracion/pastel/foto1.jpg", caption: "El pastel de 15 años" }
        ],
        espontaneos: [
            { url: "Img/celebracion/espontaneo/foto1.jpg", caption: "Risas espontáneas" },
            { url: "Img/celebracion/espontaneo/foto2.jpg", caption: "Abrazos sorpresa" },
            { url: "Img/celebracion/espontaneo/foto3.jpg", caption: "Momentos sin pose" },
            { url: "Img/celebracion/espontaneo/foto4.jpg", caption: "Pura alegría" }
        ],
        detalles: [
            { url: "Img/celebracion/recuerdo_invitados/foto1.jpg", caption: "Recuerdos para invitados" }
        ]
    }
};

// Active state trackers for carousels
const carouselStates = {
    familia: { currentIndex: 0, data: galleryData.familia },
    amigos: { currentIndex: 0, data: galleryData.amigos },
    sesion: { currentIndex: 0, data: galleryData.sesion },
    vals: { currentIndex: 0, data: galleryData.vals },
    celebracion: { currentTab: 'decoracion', currentIndex: 0, data: galleryData.celebracion.decoracion }
};

// Initialize all carousels on load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // Setup mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Initialize each carousel
    initCarousel('familia');
    initCarousel('amigos');
    initCarousel('sesion');
    initCarousel('vals');

    // Ocultar las pestañas de Celebración que no tienen fotos
    // y abrir la primera que sí tenga
    let primeraPestana = null;
    document.querySelectorAll('#celebracion-tabs button').forEach(btn => {
        const tab = btn.getAttribute('data-tab');
        const fotos = galleryData.celebracion[tab] || [];
        if (fotos.length === 0) {
            btn.style.display = 'none';
        } else if (!primeraPestana) {
            primeraPestana = tab;
        }
    });
    switchCelebrationTab(primeraPestana || 'decoracion');
});

function initCarousel(id) {
    const container = document.getElementById(`carousel-${id}`);
    if (!container) return;

    const track = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const counter = container.querySelector('.counter-badge');
    const dotsContainer = container.querySelector('.dots-container');

    const state = carouselStates[id];
    const data = state.data;

    // Render slides
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    data.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'w-full h-full flex-shrink-0 relative cursor-pointer';
        slide.innerHTML = `
            <img src="${item.url}" alt="" class="slide-fondo" aria-hidden="true">
            <img src="${item.url}" alt="${item.caption}" class="slide-foto" onclick="openLightbox('${id}', ${index})">
        `;
        track.appendChild(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all ${index === state.currentIndex ? 'bg-champagne w-6' : 'bg-white/60 hover:bg-white'}`;
        dot.setAttribute('aria-label', `Ir a foto ${index + 1}`);
        dot.addEventListener('click', () => {
            state.currentIndex = index;
            updateCarousel(id);
        });
        dotsContainer.appendChild(dot);
    });

    // Se usa onclick (no addEventListener) para que al cambiar de pestaña
    // no se acumulen eventos repetidos.
    prevBtn.onclick = () => {
        state.currentIndex = (state.currentIndex - 1 + state.data.length) % state.data.length;
        updateCarousel(id);
    };

    nextBtn.onclick = () => {
        state.currentIndex = (state.currentIndex + 1) % state.data.length;
        updateCarousel(id);
    };

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.ontouchstart = e => {
        touchStartX = e.changedTouches[0].screenX;
    };

    track.ontouchend = e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(id);
    };

    function handleSwipe(carouselId) {
        if (touchEndX < touchStartX - 50) {
            // Swipe left -> next
            carouselStates[carouselId].currentIndex = (carouselStates[carouselId].currentIndex + 1) % carouselStates[carouselId].data.length;
            updateCarousel(carouselId);
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right -> prev
            carouselStates[carouselId].currentIndex = (carouselStates[carouselId].currentIndex - 1 + carouselStates[carouselId].data.length) % carouselStates[carouselId].data.length;
            updateCarousel(carouselId);
        }
    }

    updateCarousel(id);
}

function updateCarousel(id) {
    const container = document.getElementById(`carousel-${id}`);
    if (!container) return;

    const track = container.querySelector('.carousel-track');
    const counter = container.querySelector('.counter-badge');
    const dots = container.querySelectorAll('.dots-container button');
    const valCaption = container.querySelector('.val-caption');

    const state = carouselStates[id];
    const data = state.data;

    track.style.transform = `translateX(-${state.currentIndex * 100}%)`;
    counter.textContent = `${state.currentIndex + 1} / ${data.length}`;

    dots.forEach((dot, idx) => {
        if (idx === state.currentIndex) {
            dot.className = 'w-6 h-2.5 rounded-full bg-champagne transition-all';
        } else {
            dot.className = 'w-2.5 h-2.5 rounded-full bg-white/60 hover:bg-white transition-all';
        }
    });

    if (id === 'vals' && valCaption && data[state.currentIndex].quote) {
        valCaption.textContent = `"${data[state.currentIndex].quote}"`;
    }
}

// Switch Celebration category tabs
function switchCelebrationTab(tabName) {
    const buttons = document.querySelectorAll('#celebracion-tabs button');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.className = 'tab-btn px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-charcoal text-white shadow-md';
        } else {
            btn.className = 'tab-btn px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-ivory text-charcoal hover:bg-champagne/20 border border-champagne/30';
        }
    });

    carouselStates.celebracion.currentTab = tabName;
    carouselStates.celebracion.data = galleryData.celebracion[tabName];
    carouselStates.celebracion.currentIndex = 0;

    const celebText = document.getElementById('download-all-celeb-text');
    if (celebText) {
        celebText.textContent = `Descargar todas de ${btnLabel(tabName)}`;
    }

    initCarousel('celebracion');
}

function btnLabel(tabName) {
    const btn = document.querySelector(`#celebracion-tabs button[data-tab="${tabName}"]`);
    return btn ? btn.textContent.trim().toLowerCase() : tabName;
}

// Lightbox Functions
let activeLightboxGallery = null;
let activeLightboxIndex = 0;

function openLightbox(galleryId, index) {
    activeLightboxGallery = galleryId;
    activeLightboxIndex = index;
    const state = carouselStates[galleryId];
    const item = state.data[index];

    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');

    img.src = item.url;
    counter.textContent = `${index + 1} / ${state.data.length}`;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function openLightboxImage(url) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');

    img.src = url;
    counter.textContent = '1 / 1';
    activeLightboxGallery = null;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('flex');
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function lightboxPrev() {
    if (!activeLightboxGallery) return;
    const state = carouselStates[activeLightboxGallery];
    activeLightboxIndex = (activeLightboxIndex - 1 + state.data.length) % state.data.length;
    const item = state.data[activeLightboxIndex];
    document.getElementById('lightbox-img').src = item.url;
    document.getElementById('lightbox-counter').textContent = `${activeLightboxIndex + 1} / ${state.data.length}`;
}

function lightboxNext() {
    if (!activeLightboxGallery) return;
    const state = carouselStates[activeLightboxGallery];
    activeLightboxIndex = (activeLightboxIndex + 1) % state.data.length;
    const item = state.data[activeLightboxIndex];
    document.getElementById('lightbox-img').src = item.url;
    document.getElementById('lightbox-counter').textContent = `${activeLightboxIndex + 1} / ${state.data.length}`;
}

function downloadCurrentPhoto(galleryId) {
    const state = carouselStates[galleryId];
    const item = state.data[state.currentIndex];
    triggerDownload(item.url, `Valentina_15anos_${galleryId}_${state.currentIndex + 1}.${item.url.split('.').pop()}`);
}

function downloadLightboxCurrent() {
    if (activeLightboxGallery) {
        const state = carouselStates[activeLightboxGallery];
        const item = state.data[activeLightboxIndex];
        triggerDownload(item.url, `Valentina_15anos_${activeLightboxGallery}_${activeLightboxIndex + 1}.${item.url.split('.').pop()}`);
    } else {
        const img = document.getElementById('lightbox-img');
        triggerDownload(img.src, 'Valentina_15anos_foto.jpg');
    }
}

// Descarga todas las fotos de una sección (una tras otra)
function downloadAllGallery(galleryId) {
    let fotos;
    if (galleryId === 'inicio') {
        // Álbum completo: todas las secciones
        fotos = [
            ...galleryData.familia, ...galleryData.amigos, ...galleryData.sesion, ...galleryData.vals,
            ...Object.values(galleryData.celebracion).flat()
        ];
    } else {
        fotos = galleryData[galleryId];
    }
    descargarVarias(fotos, galleryId);
}

function downloadActiveCelebrationAll() {
    const tab = carouselStates.celebracion.currentTab;
    descargarVarias(galleryData.celebracion[tab], `celebracion_${tab}`);
}

function descargarVarias(fotos, nombre) {
    if (!fotos || fotos.length === 0) return;
    showToast("Descarga masiva", `Descargando ${fotos.length} fotos...`);
    fotos.forEach((foto, i) => {
        setTimeout(() => {
            const ext = foto.url.split('.').pop();
            descargarArchivo(foto.url, `Valentina_15anos_${nombre}_${i + 1}.${ext}`);
        }, i * 400);
    });
}

// Video Modal functions
function openVideoModal(title, videoSrc) {
    const modal = document.getElementById('video-modal');
    const titleEl = document.getElementById('video-modal-title');
    const player = document.getElementById('modal-video-player');

    titleEl.textContent = title;
    player.src = videoSrc;
    videoActivo = videoSrc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    player.play();
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    player.pause();
    player.src = '';
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

let videoActivo = '';

function downloadVideo(videoTitle, videoSrc) {
    showToast("Descarga de video", `Descargando "${videoTitle}"...`);
    descargarArchivo(videoSrc, `Valentina_15anos_${videoTitle.replace(/\s+/g, '_')}.mp4`);
}

function downloadActiveVideo() {
    if (!videoActivo) return;
    const titulo = document.getElementById('video-modal-title').textContent;
    downloadVideo(titulo, videoActivo);
}

// Descarga de una sola foto
function triggerDownload(url, filename) {
    showToast("Descarga iniciada", "Guardando fotografía...");
    descargarArchivo(url, filename);
}

// Crea un enlace temporal con "download" para bajar el archivo
function descargarArchivo(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Notificación (toast)
function showToast(title, msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent = msg;

    toast.classList.remove('translate-y-32', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-32', 'opacity-0');
    }, 4000);
}