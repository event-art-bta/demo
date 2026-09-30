// Configuración de colores y fuentes de Tailwind.
// Debe cargarse justo después del script de Tailwind (en el <head>).
tailwind.config = {
    theme: {
        extend: {
            colors: {
                ivory: '#FFFFFF',          // blanco (fondo principal)
                aguaClara: '#A8DCD9',      // aguamarina clarito (secciones alternas)
                softPink: '#A8DCD9',       // aguamarina clarito (degradado de portada)
                champagne: '#178A7E',      // verde aguamarina (botones, títulos, detalles)
                champagneLight: '#CDEEEC', // aguamarina pastel (hover)
                charcoal: '#1E2F2E'        // texto oscuro
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                script: ['Great Vibes', 'cursive']
            }
        }
    }
};