import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'contiroom · 찬양 악보와 콘티',
  description: '찬양 악보를 검색하고 콘티를 한 장에 담아보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
