/* Builds tw.css for index.html and admin/index.html (no in-browser Tailwind):
   npx tailwindcss@3.4.17 -c tailwind.config.js -i tw.src.css -o tw.css --minify */
module.exports = {
    content: ['./index.html', './admin/index.html', './data.js', './demo/demo.js'],
    theme: {
        extend: {
            colors: {
                royalMaroon: '#4A0817', deepCrimson: '#5A0E1A', richBurgundy: '#2D040D',
                warmGold: '#D4AF37', antiqueGold: '#C5A059', softGold: '#E6CA65',
                silkVanilla: '#FAF6EE', creamAccent: '#F3ECE0', obsidian: '#121212', charcoal: '#1A1A1A',
                deepGold: '#7A5C18', cocoa: '#5C4636', cocoaSoft: '#6B5546'
            },
            fontFamily: {
                playfair: ['Playfair Display', 'serif'],
                cormorant: ['Cormorant Garamond', 'serif'],
                montserrat: ['Montserrat', 'sans-serif']
            },
            boxShadow: {
                'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
                'gold-sm': '0 0 10px rgba(212, 175, 55, 0.2)'
            }
        }
    }
};
