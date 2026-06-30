import './globals.css'

export const metadata = {
  title: 'Vibhava Enterprises - Invoice Calculator',
  description: 'Simple invoice calculator for agricultural wholesale',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="max-w-3xl mx-auto py-4 px-4 sm:px-6">
              <h1 className="text-lg font-semibold">Vibhava Enterprises</h1>
            </div>
          </header>
          <main className="flex-1 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              {children}
            </div>
          </main>
          <footer className="bg-white border-t py-4">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-sm text-gray-500">
              © Vibhava Enterprises
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
