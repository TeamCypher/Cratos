"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CratosLogo } from "@/components/CratosLogo"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-6xl">
        {/* Logo */}
        <Link href="/" className="group">
          <CratosLogo width={36} height={36} imageClassName="rounded-lg shadow-lg shadow-primary/10 transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground font-rizo">
          <Link href="/" className="hover:text-foreground transition-colors">Analyze</Link>
          <Link href="/vibe-check" className="hover:text-foreground transition-colors">Vibe Check</Link>
          <Link href="/history" className="hover:text-foreground transition-colors">History</Link>
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="default" className="font-semibold shadow-md shadow-primary/10" onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}>
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
          <nav className="flex flex-col p-6 gap-6 text-base font-medium text-muted-foreground font-rizo">
            <Link href="/" className="hover:text-foreground transition-colors" onClick={toggleMenu}>Analyze</Link>
            <Link href="/vibe-check" className="hover:text-foreground transition-colors" onClick={toggleMenu}>Vibe Check</Link>
            <Link href="/history" className="hover:text-foreground transition-colors" onClick={toggleMenu}>History</Link>
            <div className="pt-4 border-t border-border/50">
              <Button variant="default" className="w-full font-semibold" onClick={() => { toggleMenu(); document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Analyze Video
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
