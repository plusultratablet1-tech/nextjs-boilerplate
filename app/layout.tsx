import "./globals.css"
import { AuthProvider } from "@/lib/auth/AuthContext"

export const metadata = {
  title: "BearFitPH",
  description: "BearFitPH dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
