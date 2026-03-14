import "./globals.css"
import NavBar from "@/components/nav-bar"
export const metadata={title:"Beerpong Premier League",description:"BPL hotfix final"}
export default function RootLayout({children}){return <html lang="cs"><body><NavBar />{children}<div className="footer-space" /></body></html>}
