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
        return <div className="fixed inset-0 m-0 p-0 w-screen h-screen overflow-hidden bg-black z-50">{children}</div>
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
