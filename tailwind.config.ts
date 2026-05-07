import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          150: '#EBEBEB',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable', 'Pretendard',
          '-apple-system', 'BlinkMacSystemFont', 'system-ui',
          'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
