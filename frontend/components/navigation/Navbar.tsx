"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-6xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Cratos</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Analyze</Link>
          <Link href="/vibe-check" className="hover:text-foreground transition-colors">Vibe Check</Link>
          <Link href="/history" className="hover:text-foreground transition-colors">History</Link>
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="default" className="font-semibold shadow-md shadow-primary/10">
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
          <nav className="flex flex-col p-6 gap-6 text-base font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors" onClick={toggleMenu}>Analyze</Link>
            <Link href="/vibe-check" className="hover:text-foreground transition-colors" onClick={toggleMenu}>Vibe Check</Link>
            <Link href="/history" className="hover:text-foreground transition-colors" onClick={toggleMenu}>History</Link>
            <div className="pt-4 border-t border-border/50">
              <Button variant="default" className="w-full font-semibold" onClick={toggleMenu}>
                Analyze Video
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
