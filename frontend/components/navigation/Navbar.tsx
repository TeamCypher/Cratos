"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CratosLogo } from "@/components/CratosLogo"
import { Outfit } from "next/font/google"
import { cn } from "@/lib/utils"
import { GoogleLogin, googleLogout } from '@react-oauth/google'

const rizoFont = Outfit({ subsets: ["latin"] })

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  React.useEffect(() => {
    const token = localStorage.getItem('google_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const scrollToUpload = () => {
    if (pathname !== '/') {
      router.push('/#upload-section')
    } else {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
  }

  const handleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      localStorage.setItem('google_token', credentialResponse.credential)
      setIsAuthenticated(true)
      // trigger history reload?
      window.dispatchEvent(new Event('auth_changed'))
    }
  }

  const handleLogout = () => {
    googleLogout()
    localStorage.removeItem('google_token')
    setIsAuthenticated(false)
    window.dispatchEvent(new Event('auth_changed'))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-6xl">
        {/* Logo */}
        <Link href="/" className="group">
          <CratosLogo width={36} height={36} imageClassName="rounded-lg shadow-lg shadow-primary/10 transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground", rizoFont.className)}>
          <Link href="/" className="hover:text-foreground transition-colors">Analyze</Link>
          <Link href="/history" className="hover:text-foreground transition-colors">History</Link>
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.error('Login Failed')}
              useOneTap
              theme="outline"
              type="standard"
              size="medium"
              text="signin_with"
              shape="rectangular"
            />
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          )}
          <ThemeToggle />
          <Button variant="default" className="font-semibold shadow-md shadow-primary/10" onClick={scrollToUpload}>
            Analyze Video
          </Button>
        </div>

        {/* Mobile Menu Toggle & Theme */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md absolute w-full left-0 top-16 shadow-2xl">
          <nav className={cn("flex flex-col p-6 gap-6 text-base font-medium text-muted-foreground", rizoFont.className)}>
            {!isAuthenticated ? (
              <div className="flex justify-center mb-4">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => console.error('Login Failed')}
                  useOneTap
                />
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
            )}
            <Link href="/" className={cn("hover:text-foreground transition-colors", rizoFont.className)} onClick={toggleMenu}>Analyze</Link>
            <Link href="/history" className={cn("hover:text-foreground transition-colors", rizoFont.className)} onClick={toggleMenu}>History</Link>
            <div className="pt-4 border-t border-border/50">
              <Button variant="default" className="w-full font-semibold" onClick={() => { toggleMenu(); scrollToUpload(); }}>
                Analyze Video
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
