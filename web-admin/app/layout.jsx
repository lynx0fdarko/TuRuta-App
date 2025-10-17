import './globals.css'

export const metadata = { title: 'EnRuta • IRTRAMMA' }

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#F6F0B7] text-slate-900">
        {children}
      </body>
    </html>
  )
}
