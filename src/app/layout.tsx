import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Poomsae Coach',
  description: 'Improve your Taekwondo forms with AI-powered feedback',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
