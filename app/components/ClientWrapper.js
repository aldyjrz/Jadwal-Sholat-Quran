'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'

export default function ClientWrapper({ children }) {
    const pathname = usePathname()
    const isScreen = pathname === '/screen' || pathname.startsWith('/screen/')

    // Jika ini adalah halaman /screen, jangan tampilkan Navbar, BottomNav, atau Footer
    // Selain itu hilangkan <main> padding untuk /screen agar full screen sempurna
    if (isScreen) {
        return <main className="m-0 p-0 h-screen w-screen overflow-hidden">{children}</main>
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BottomNav />
        </>
    )
}
