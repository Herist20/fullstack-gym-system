'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@gym/ui'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/classes', label: 'Classes' },
    { href: '/trainers', label: 'Trainers' },
    { href: '/membership', label: 'Membership' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">GYM</span>
            <span className="text-green-500">FIT</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-white ${
                    isActive ? 'text-green-500' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-green-500" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost">Login</Button>
            <Button>Join Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block border-l-2 py-2 pl-4 text-sm font-medium transition-colors hover:text-white ${
                    isActive
                      ? 'border-green-500 text-green-500'
                      : 'border-transparent text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-4 flex flex-col gap-2 px-4">
              <Button variant="ghost" className="w-full">Login</Button>
              <Button className="w-full">Join Now</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
