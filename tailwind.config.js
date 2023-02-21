const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./views/**/*.{html,hbs,js}'],

  theme: {
    screens: {
      xxs: '375px',
      // => @media (min-width: 375px) { ... }

      xs: '480px',
      // => @media (min-width: 480px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        app: ['Roboto', 'ui-sans-serif'],
      },
      flex: {
        1: '1 1 0%',
        auto: '1 1 auto',
        initial: '0 1 auto',
        inherit: 'inherit',
        none: 'none',
        2: '2 2 0%',
      },
      colors: {
        blurple: '#635BFF',
        notice: {
          text: '#656565',
          boder: '#a7a7a7',
        },
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },
        orange: {
          900: '#7C2D12',
          800: '#9A3412',
          700: '#C2410C',
          600: '#EA580C',
          500: '#F97316',
          400: '#FB923C',
          300: '#FDBA74',
          200: '#FED7AA',
          100: '#FFEDD5',
          50: '#FFF7ED',
        },
        green: {
          900: '#2BA166',
          800: '#27B06B',
          700: '#20BD6E',
          600: '#1BCC73',
          500: '#14DE79',
          400: '#18F285',
          300: '#35FF9A',
          200: '#83FFC1',
          100: '#B9FFDC',
          50: '#E0FFEF',
        },
        purple: {
          900: '#6D30CD',
          800: '#7733E2',
          700: '#8237F6',
          600: '#8C42FF',
          500: '#9855FF',
          400: '#AA73FF',
          300: '#BB8EFF',
          200: '#C9A6FF',
          100: '#E5D4FF',
          50: '#F5EEFF',
        },
        indigo: {
          900: '#312E81',
          800: '#3730A3',
          700: '#4338CA',
          600: '#4F46E5',
          500: '#6366F1',
          400: '#818CF8',
          300: '#A5B4FC',
          200: '#C7D2FE',
          100: '#E0E7FF',
          50: '#EEF2FF',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
