import "./globals.css"
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })

import ToasterContext from "./context/ToasterContext"
import AuthContext from "./context/AuthContext"
import ActiveStatus from "./components/ActiveStatus"

export const metadata = {
  title: "Messenger Clone",
  description: "Messenger Clone",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
