/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#6B0F1A',
          50: '#FDF2F4',
          100: '#FCE7EA',
          200: '#F7C9D0',
          300: '#EE9CA8',
          400: '#DF6478',
          500: '#C9354F',
          600: '#A81D38',
          700: '#8A1525',
          800: '#6B0F1A',
          900: '#4A0710',
          950: '#2E0308'
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FCF9EE',
          100: '#F7EED0',
          200: '#EFE0A8',
          300: '#E6C97A',
          400: '#DCB350',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8F6508',
          800: '#6C4B08',
          900: '#4A3306'
        },
        ivory: {
          DEFAULT: '#FAF6EE',
          pure: '#FFFFF0',
          warm: '#FAF6EE',
          cream: '#F5EBD6'
        },
        beige: {
          DEFAULT: '#EADBC0',
          soft: '#F5EBD6',
          warm: '#EADBC0',
          sand: '#DEC7A3'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #4A0710 0%, #6B0F1A 50%, #3A050B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E6C97A 0%, #D4AF37 50%, #B8860B 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FAF6EE 0%, #F5EBD6 100%)'
      },
      boxShadow: {
        royal: '0 10px 40px -10px rgba(107, 15, 26, 0.22)',
        gold: '0 8px 30px -6px rgba(212, 175, 55, 0.35)'
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'spin-reverse-slow': 'spin 80s linear infinite reverse',
        'float-gentle': 'floatGentle 6s ease-in-out infinite'
      },
      keyframes: {
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: []
};

