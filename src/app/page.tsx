'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-full border-white/15 border rounded-lg bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-16 text-center space-y-4">
          <h1 className="text-7xl font-bold tracking-tighter animate-fade-in-down">
            <span className="text-blue-500">B</span>lab
          </h1>
          <p className="text-2xl text-gray-400 animate-fade-in-up max-w-2xl mx-auto">
            Dive into the endless chatter where your &#39;valuable&#39; time is as appreciated as your jokes — not at all!          </p>
        </header>

        <main className="space-y-20">
          <section className="space-y-10">
            <h2 className="text-4xl font-semibold text-center">What is Blab all about?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="message-circle"
                title="Chat Rooms"
                description="Join chat rooms and share how boring your life is with your homies."
              />
              <FeatureCard
                icon="users"
                title="Global Hangout"
                description="In the global room, you can chat with the whole community and disgrace yourself even more."
              />
              <FeatureCard
                icon="lock"
                title="Create Rooms"
                description="By creating your own room, you can kick your loved ones."
              />
            </div>
          </section>

          <section className="space-y-10">
            <h2 className="text-4xl font-semibold text-center">The Blab Rules</h2>
            <div className="bg-white/5 rounded-xl p-8">
              <ScrollArea className="h-[165px] w-full pr-4">
                <ol className="space-y-4 list-decimal list-inside text-lg">
                  <li>You can join up to 3 rooms.</li>
                  <li>Want to join a room? Send a request and pray the room creator isn’t on a power trip.</li>
                  <li>You can create only one room.</li>
                  <li>Blab, not brawl.</li>
                </ol>
              </ScrollArea>
            </div>
          </section>

          <section className="text-center space-y-8 pb-20">
            <h2 className="text-4xl font-semibold">Ready to dive in?</h2>
            <Link href="/rooms">
              <Button className="bg-blue-500 my-6 text-white border-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                Start Blabbing
              </Button>
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300">
      <div className="text-center space-y-4">
        <div className="flex justify-center text-white">
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

