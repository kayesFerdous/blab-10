"use client"

import { useEffect, useState, useRef } from "react"
import { pusherClient } from "@/lib/pusher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Settings } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface Message {
  id: string
  roomId: string
  userId: string
  name: string
  message: string
  createdAt: Date
}

interface NewMessagesProps {
  roomId: string
  roomTitle: string
  userId: string
  name: string
  initialMessages: Message[]
}

export default function RoomMessage({ roomId, roomTitle, userId, name, initialMessages }: NewMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    initialMessages.map(msg => ({
      ...msg,
      createdAt: new Date(msg.createdAt)
    }))
  )
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messageIds = useRef(new Set(messages.map(m => m.id)))

  useEffect(() => {
    const channel = pusherClient.subscribe(roomId)

    channel.bind("new-message", (data: Message) => {
      if (!messageIds.current.has(data.id)) {
        messageIds.current.add(data.id)
        setMessages(prev => [...prev, { ...data, createdAt: new Date(data.createdAt) }])
      }
    })

    return () => {
      pusherClient.unsubscribe(roomId)
    }
  }, [roomId])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    setInput("")
    inputRef.current?.focus()

    try {
      const response = await fetch(`/api/rooms/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: trimmedInput,
          roomId,
          name
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="border-white/15 border-b sm:h-14 h-12 flex items-center justify-between px-4">
        <h2 className="sm:text-2xl text-xl font-bold text-white">{roomTitle}</h2>
        <Link href={`/rooms/room-settings/${roomId}`} passHref>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-blue-600 hover:bg-black">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Room Settings</span>
          </Button>
        </Link>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((message) => {
            const messageKey = `${message.id}-${message.userId}`
            return (
              <div key={messageKey} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-blue-600">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {message.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{message.name}</span>
                    <span className="text-xs text-zinc-400">
                      {new Date(message.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })} at {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-white">{message.message}</p>
                </div>
              </div>
            )
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={({ target }) => setInput(target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-900 border-zinc-800 text-white text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-500"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 bg-blue-600 hover:bg-blue-700"
            disabled={!input.trim()}
          >
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
