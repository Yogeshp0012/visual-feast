import Script from 'next/script';
import '../styles/globals.css';

export const metadata = {
    title: {
        template: '%s | REPIX',
        default: 'REPIX'
    }
};

export default function RootLayout({ children }) {
    return (
<html lang="en">
    <body className="bg-gray-900">{children}</body>
    <Script  src="https://cdn.jsdelivr.net/gh/silvia-odwyer/pixels.js/dist/Pixels.js" />

</html>
    );
}
