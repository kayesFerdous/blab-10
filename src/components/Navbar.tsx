"use client"

import { Plus, UsersRound, Zap, LogIn, LogOut } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { href: "/rooms", icon: UsersRound, label: "Rooms" },
    { href: "/rooms/join-room", icon: Zap, label: "Join" },
    { href: "/rooms/create-room", icon: Plus, label: "Create Room" },
  ]

  return (
    <div className="h-screen w-14 sm:w-24 bg-black p-1 sm:p-2">
      <nav className="flex h-full w-full flex-col items-center rounded-xl border border-white/15 bg-black pt-2 p-1 sm:p-3">
        <Link
          href="/"
          className="mb-6 sm:mb-10 mt-2 font-bold text-sm sm:text-2xl text-white border-b border-white/15 group"
        >
          <span className="inline-block transition-all group-hover:text-blue-500">B</span>
          <span className="inline-block sm:inline">lab</span>
          <span className="sr-only">Blab</span>
        </Link>
        <div className="flex flex-1 flex-col gap-3 sm:gap-4">
          {links.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg text-white/70 transition-all hover:text-white",
                "hover:bg-blue-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                pathname === href && "bg-blue-600 text-white hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              )}
            >
              <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
              <span className="sr-only">{label}</span>
            </Link>
          ))}
        </div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="mt-auto h-9 w-9 sm:h-12 sm:w-12 rounded-lg p-0 overflow-hidden transition-all duration-200 hover:rounded-xl focus:rounded-xl">
                <Avatar className="h-full w-full">
                  <AvatarImage src={session.user?.image} />
                  <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-black text-white border-white/15" align="end" alignOffset={-40}>
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.user?.image} />
                  <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                  <p className="text-xs leading-none text-gray-400">{session.user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/15" />
              <DropdownMenuItem
                className="hover:bg-white/15 focus:bg-white/15 focus:text-white cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="mt-auto flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg text-white/70 transition-all hover:bg-blue-600 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <LogIn className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="sr-only">Sign In</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-black text-white border-white/15" align="end" alignOffset={-40}>
              <div className='space-x-2 p-1 text-sm'>Sign In with</div>
              <DropdownMenuSeparator className="bg-white/15" />
              <DropdownMenuItem
                className="hover:bg-white/15 focus:bg-white/15 focus:text-white cursor-pointer"
                onClick={() => signIn('google')}
              >
                Google
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/15 focus:bg-white/15 focus:text-white cursor-pointer"
                onClick={() => signIn('github')}
              >
                GitHub
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </div>
  )
}
