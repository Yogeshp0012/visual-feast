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
    <body className={`${inter.className} bg-gray-900`}>{children}</body>
</html>
    );
}
