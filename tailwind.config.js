const colors = require('tailwindcss/colors');

module.exports = {
    future: {
        purgeLayersByDefault: true,
        applyComplexClasses: true,
    },
    purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // 'media' or 'class'
    theme: {
        extend: {
            zIndex: {
                100: '100',
            },
            keyframes: {
                opacity: {
                    from: {
                        opacity: 0,
                    },
                    to: {
                        opacity: 1,
                    },
                },
                spinner: {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: ' rotate(360deg)',
                    },
                },
                fadeLeft: {
                    '0%': {
                        transform: 'translateX(-50px)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'translateX(0px)',
                        opacity: 1,
                    },
                },
                fadeRight: {
                    '0%': {
                        transform: 'translateX(50px)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'translateX(0px)',
                        opacity: 1,
                    },
                },
            },
            animation: {
                spinner: ' spinner 1s linear infinite',
                opacity: 'opacity 0.2s ease-in-out',
                fadeLeft: 'fadeLeft 1s ease-in-out',
                fadeRight: 'fadeRight 1s ease-in-out',
            },
            width: {
                'max-content': 'max-content',
            },
            maxWidth: {
                '8xl': '1920px',
            },
            spacing: {},
            colors: {
                main: '#1d272e',
                'main-green': '#12c399',
                'main-green-500': '#0eb77d',
                'main-green-600': '#00a275',
                'c-secondary-900': '#26313a',
                'c-secondary-800': '#293843',
                'c-secondary-700': '#1c242b',
                'c-secondary': '#151d24',
                'lighten-5': '#334553',
                'muted': '#6c7983',
                'muted-500': '#26313a',
                'muted-900': '#283640',
                gray: {
                    ...colors.gray,
                    250: '#f5f5f5',
                },
                green: {
                    ...colors.green,
                    550: '#23c0b5',
                },
            },
            textColor: {
                light: '#e8eaeb',
                green: {
                    ...colors.green,
                    550: '#23c0b5',
                },
            },
            rotate: {
                '224': '225deg',
            },
            boxShadow: {
                'outline-2': '0 0 0 2px var(--accents-2)',
                magical:
                    'rgba(0, 0, 0, 0.02) 0px 30px 30px, rgba(0, 0, 0, 0.03) 0px 0px 8px, rgba(0, 0, 0, 0.05) 0px 1px 0px',
            },
            lineHeight: {
                'extra-loose': '2.2',
            },
            scale: {
                120: '1.2',
            },
            fontSize: {
                '10p': '10px',
            },
            spacing: {
                '20p': '20px',
            },
            gridAutoColumns: {
                '2fr': 'minmax(0, 2fr)',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
